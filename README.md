# Astro + Sveltia CMS Starter

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)

เว็บธุรกิจหน้าเดียวพร้อมบล็อก หลังบ้าน Sveltia CMS ที่ปรับแต่งเป็นภาษาไทย ระบบล็อกอิน GitHub ผ่าน Cloudflare Worker และ GitHub Actions แปลงรูปเป็น WebP อัตโนมัติ

*A one-page business site with a blog, a customised Thai Sveltia CMS admin, GitHub login through a Cloudflare Worker, and automatic WebP/WebM conversion with GitHub Actions.*

> **ข้อมูลตัวอย่างเป็นธุรกิจจริง (JINA SERVICE)** เบอร์โทรและช่องทางติดต่อใช้งานได้จริง **อย่า deploy โดยไม่เปลี่ยนข้อมูล** license ครอบคลุมเฉพาะโค้ด ดู [TRADEMARKS.md](TRADEMARKS.md)
>
> *The demo is a real business with real contact details. Only the code is open source. Replace the content before deploying.*

## Stack
Astro 4 · Tailwind CSS 3 · Sveltia CMS 0.256.1 · Cloudflare Workers (static assets) · GitHub Actions

## ความสามารถ
**หลังบ้าน CMS** (`/admin/`)
- แก้ข้อความและรูปของหน้าแรก: Hero, บริการ, อุปกรณ์, แกลเลอรี, มาตรฐาน, ราคา, แถบสายด่วน, FAQ, Footer และข้อความหัวหมวด
- เปิด/ปิดและเรียงลำดับส่วนต่างๆ ของหน้าแรก
- เขียนบทความ และแก้หัวข้อหน้า `/blog/`
- ตั้งค่าเว็บไซต์, SEO, ข้อมูลติดต่อ, โลโก้ และรหัส tracking
- ปรับหน้าตาหลังบ้าน แปลเมนูบัญชีเป็นภาษาไทย และมีแถบ URL ของส่วนที่กำลังแก้

**SEO และ AI agents**
- สร้าง `sitemap.xml`, `sitemap-index.xml`, `robots.txt`, `llms.txt` และ `llms-full.txt`
- Worker ใส่ `Link` header และส่ง Markdown ของหน้าแรกเมื่อคำขอมี `Accept: text/markdown`
- Worker ส่ง `Content-Signal: search=yes, ai-input=yes, ai-train=yes` ซึ่ง**อนุญาตให้ใช้ฝึก AI** ถ้าไม่ต้องการให้แก้ใน `worker.js`

**ความเร็ว**
- หลัง build จะตัด CSS ที่ไม่ได้ใช้ ย่อไฟล์ และสร้างรูป Hero สำหรับมือถือ

## โครงสร้าง
| Path | หน้าที่ |
|---|---|
| `02-astro-version/src/pages/` | หน้าเว็บ บล็อก และไฟล์ SEO |
| `02-astro-version/src/data/` | ข้อมูลที่ CMS แก้ไข |
| `02-astro-version/src/content/blog/` | บทความ Markdown |
| `02-astro-version/public/admin/` | หน้าหลังบ้านและ `config.yml` |
| `02-astro-version/public/media/` | รูปและวิดีโอ |
| `02-astro-version/scripts/` | ขั้นตอนหลัง build |
| `worker.js`, `wrangler.json` | เสิร์ฟเว็บและล็อกอิน CMS |
| `.github/` | แปลงรูปและวิดีโอ |

## เริ่มใช้งาน
กด **Fork** หรือ **Use this template** (ถ้ามี) แล้ว clone repo ของคุณ
```bash
cd 02-astro-version
npm install
npm run dev       # เปิดดูในเครื่อง
npm run build     # ผลลัพธ์อยู่ใน dist/
```

## ค่าที่ต้องเปลี่ยน
ค้นหา `xxxx` ในโปรเจกต์

| ไฟล์ | ค่า |
|---|---|
| `02-astro-version/public/admin/config.yml` | `repo` เป็น `owner/repo` ของคุณ, `base_url` เป็น URL เว็บ และลิงก์ในคำอธิบาย |
| `wrangler.json` | `name` ชื่อ Worker, `GITHUB_CLIENT_ID`, `MAIN_DOMAIN` (คง `xxxx` ไว้ถ้าใช้ workers.dev) |
| `02-astro-version/src/data/settings.json` | `gtmId`, `sentryKey` (`xxxx` = ปิด), `canonicalUrl` และข้อมูลธุรกิจ |
| `02-astro-version/public/standalone.js` | `access_key` ของ Web3Forms และอีเมลตอบกลับสำรองของฟอร์มติดต่อ |
| `02-astro-version/src/layouts/BaseLayout.astro` | `msvalidate.01` สำหรับ Bing หรือลบ tag ออก |

นอกจากนี้ให้เปลี่ยนโลโก้ รูป วิดีโอ QR เบอร์โทร บทความ ข้อความที่เขียนไว้ในไฟล์ `.astro` และภาพตัวอย่างใบอนุญาตใน `public/documents/`

## Deploy บน Cloudflare และตั้งค่าล็อกอิน CMS
1. สร้าง GitHub OAuth App (GitHub → Settings → Developer settings) โดยตั้ง callback URL เป็น `https://<โดเมนของคุณ>/callback`
2. ใส่ Client ID ใน `wrangler.json`
3. ใส่ Client Secret เป็น Worker secret **ห้าม commit**
   ```bash
   npx wrangler secret put GITHUB_OAUTH_SECRET
   ```
4. build และ deploy จากโฟลเดอร์หลักของ repo
   ```bash
   npm run build
   npx wrangler deploy
   ```
5. เปิด `https://<โดเมนของคุณ>/admin/` แล้วล็อกอินด้วย GitHub

การล็อกอินตรวจค่า `state` เพื่อกัน CSRF และขอสิทธิ์ `repo` ซึ่ง**ครอบคลุมทุก repo ที่ผู้ล็อกอินเข้าถึงได้** ควรจำกัดคนใช้ หรือปรับ scope ใน `worker.js` ให้เหมาะกับงาน

## แปลงรูปและวิดีโออัตโนมัติ (GitHub Actions)
ไฟล์: [`.github/workflows/media-convert.yml`](.github/workflows/media-convert.yml) และ [`.github/scripts/`](.github/scripts/)

**ทำงานเมื่อ** push เข้า `main` ที่แก้ `public/media/`, `gallery.json`, `.github/scripts/` หรือตัว workflow หรือกด **Run workflow** เอง

**แปลงเฉพาะไฟล์ที่อยู่ในรายการ `src/data/gallery.json`** รูปในส่วนอื่นของเว็บจะไม่ถูกแปลง

| ไฟล์ต้นฉบับ | ผลลัพธ์ |
|---|---|
| JPG, PNG, HEIC และรูปอื่นที่ Pillow เปิดได้ | WebP ด้านยาวไม่เกิน 1920px หมุนตามข้อมูลกล้อง |
| MP4, MOV, M4V หรือ WebM ที่ใหญ่เกิน | WebM (VP9/Opus) ไม่เกิน 24 MB พร้อมภาพ poster |
| ทุกรูปและ poster | thumbnail กว้างไม่เกิน 240px (`*.thumb.webp`) |

จากนั้นบอตจะอัปเดต `gallery.json` แล้ว commit กลับเข้า `main` **รูปและวิดีโอต้นฉบับที่ถูกแปลงจะถูกลบจากเวอร์ชันล่าสุด** ควรเก็บต้นฉบับไว้เอง ไฟล์ยังอาจอยู่ในประวัติ Git ถ้าวิดีโอบีบแล้วเกิน 24 MB workflow จะล้มเหลว ให้ตัดคลิปให้สั้นลง

**เปิดใช้ใน fork:** แท็บ **Actions** → เปิดใช้งาน workflow และถ้า push กลับไม่ได้ ให้ตรวจ **Settings → Actions → General → Workflow permissions** กับกฎป้องกัน branch

หลังบอต commit แล้ว ให้ `git pull` ก่อนแก้โค้ดในเครื่อง

## License
โค้ดใช้ [Apache License 2.0](LICENSE) เมื่อแจกต่อให้คง license และ [NOTICE](NOTICE) ไว้
ชื่อ โลโก้ และเนื้อหาตัวอย่างไม่รวมใน license: [TRADEMARKS.md](TRADEMARKS.md)

Copyright 2026 Sufarwee Dunyamat (sufarweededev)
