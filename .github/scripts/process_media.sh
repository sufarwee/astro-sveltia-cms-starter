#!/usr/bin/env bash
# Called by .github/workflows/media-convert.yml. All logic lives here so it can change
# without editing the workflow file (that needs a token with the "workflow" scope).
set -euo pipefail

sudo apt-get update -qq
sudo apt-get install -y -qq ffmpeg
python -m pip install --quiet "pillow==11.0.0" "pillow-heif==0.20.0"

python .github/scripts/process_media.py 02-astro-version

if [ -z "$(git status --porcelain -- 02-astro-version/public/media 02-astro-version/src/data/gallery.json)" ]; then
  echo "No media changes"
  exit 0
fi
git config user.name "media-bot"
git config user.email "41898282+github-actions[bot]@users.noreply.github.com"
git add -A 02-astro-version/public/media 02-astro-version/src/data/gallery.json
git commit -m "chore(media): convert CMS uploads (WebP/WebM, posters, thumbnails)"
git pull --rebase origin main
git push origin HEAD:main
