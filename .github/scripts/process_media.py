#!/usr/bin/env python3
"""Normalize media uploaded through the CMS so the site stays fast and deployable.

Runs in GitHub Actions after every push that touches public/media or gallery.json:
  * gallery photos that are not WebP (jpg/png/heic...) -> WebP, max 1920px, camera rotation applied
  * videos (mp4/mov/m4v, or WebM over the size cap) -> WebM (VP9/Opus) under 24 MB + a poster image
  * every gallery photo / video poster gets a 240px "*.thumb.webp" for the thumbnail strip
gallery.json is updated to point at the converted files. Usage: process_media.py <astro-project-dir>
"""
import json
import subprocess
import sys
from pathlib import Path

from PIL import Image, ImageOps

try:  # iPhone HEIC photos
    from pillow_heif import register_heif_opener
    register_heif_opener()
except ImportError:
    pass

ROOT = Path(sys.argv[1] if len(sys.argv) > 1 else "02-astro-version").resolve()
PUBLIC = ROOT / "public"
GALLERY = ROOT / "src" / "data" / "gallery.json"
VIDEO_EXT = {".mp4", ".mov", ".m4v", ".webm"}
WEB_IMAGE_EXT = {".webp"}
MAX_IMAGE = 1920
THUMB_W = 240
MAX_VIDEO_BYTES = 24 * 1024 * 1024  # Cloudflare Workers static assets reject files over 25 MiB

changed: list[str] = []


def to_path(src: str) -> Path:
    return PUBLIC / src.split("?")[0].lstrip("./").lstrip("/")


def to_src(path: Path, like: str) -> str:
    rel = path.relative_to(PUBLIC).as_posix()
    return ("./" if like.startswith("./") else "/") + rel


def open_upright(path: Path) -> Image.Image:
    img = ImageOps.exif_transpose(Image.open(path))  # apply camera EXIF rotation to the pixels
    return img.convert("RGBA" if img.mode in ("RGBA", "LA", "P") else "RGB")


def make_thumb(path: Path) -> None:
    thumb = path.with_name(path.stem + ".thumb.webp")
    if thumb.exists() or not path.exists():
        return
    img = open_upright(path)
    img.thumbnail((THUMB_W, THUMB_W * 4))
    img.save(thumb, "WEBP", quality=72, method=6)
    changed.append(f"thumb {thumb.relative_to(PUBLIC)}")


def image_to_webp(path: Path) -> Path:
    out = path.with_suffix(".webp")
    img = open_upright(path)
    img.thumbnail((MAX_IMAGE, MAX_IMAGE))
    img.save(out, "WEBP", quality=85, method=6)
    if out != path:
        path.unlink()
    changed.append(f"image {path.name} -> {out.name}")
    return out


def ffmpeg(*args: str) -> None:
    subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", *args], check=True)


def video_to_webm(path: Path) -> Path:
    out = path.with_suffix(".webm")
    tmp = path.with_name(path.stem + ".tmp.webm")
    # Try decreasing quality/size until the file fits the deploy limit (ffmpeg auto-rotates phone video)
    for crf, height in ((33, 1280), (38, 960), (42, 720), (46, 540)):
        ffmpeg("-i", str(path), "-vf", f"scale=-2:'min({height},ih)'", "-c:v", "libvpx-vp9", "-b:v", "0",
               "-crf", str(crf), "-row-mt", "1", "-deadline", "good", "-cpu-used", "4",
               "-c:a", "libopus", "-b:a", "64k", str(tmp))
        if tmp.stat().st_size <= MAX_VIDEO_BYTES:
            break
    if tmp.stat().st_size > MAX_VIDEO_BYTES:
        tmp.unlink()
        raise SystemExit(f"{path.name}: still over 24 MB after compression; trim the clip and upload again")
    if path != out:
        path.unlink()
    tmp.replace(out)
    changed.append(f"video {path.name} -> {out.name} ({out.stat().st_size // 1024} KB)")
    return out


def make_poster(video: Path) -> Path:
    poster = video.with_name(video.stem + "-poster.jpg")
    if not poster.exists():
        ffmpeg("-ss", "1", "-i", str(video), "-frames:v", "1", "-vf", "scale='min(720,iw)':-2", "-q:v", "4", str(poster))
        if not poster.exists():  # clip shorter than 1s
            ffmpeg("-i", str(video), "-frames:v", "1", "-vf", "scale='min(720,iw)':-2", "-q:v", "4", str(poster))
        changed.append(f"poster {poster.name}")
    return poster


def main() -> None:
    data = json.loads(GALLERY.read_text(encoding="utf-8"))
    for item in data.get("items", []):
        src = item.get("src") or ""
        path = to_path(src)
        if not src or not path.exists():
            print(f"skip (missing file): {src}")
            continue
        ext = path.suffix.lower()
        if ext in VIDEO_EXT:
            if ext != ".webm" or path.stat().st_size > MAX_VIDEO_BYTES:
                path = video_to_webm(path)
                item["src"] = to_src(path, src)
            item["type"] = "video"
            poster = to_path(item["poster"]) if item.get("poster") else make_poster(path)
            if item.get("poster") and not poster.exists():
                poster = make_poster(path)
            if poster.name != path.stem + "-poster.jpg":
                item["poster"] = to_src(poster, src)
            make_thumb(poster)
        else:
            if ext not in WEB_IMAGE_EXT:
                path = image_to_webp(path)
                item["src"] = to_src(path, src)
            item["type"] = "image"
            make_thumb(path)
    if changed:
        GALLERY.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("\n".join(changed) or "nothing to do")


if __name__ == "__main__":
    main()
