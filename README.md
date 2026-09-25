# Image Background Remover

A Next.js + Tailwind CSS MVP for removing image backgrounds with the remove.bg API.

## Features

- Click and drag-and-drop image upload.
- JPG, PNG, and WEBP validation with a 5MB limit.
- Server-side `/api/remove-background` proxy for remove.bg.
- Original and processed image previews.
- Before / after comparison slider.
- Transparent PNG download.
- White, black, and custom solid background export through browser canvas.
- Privacy copy, FAQ schema, SEO metadata, and long-tail URL rewrites.

## Local Development

Install dependencies:

```bash
npm install
```

Create a local environment file:

```bash
cp .env.example .env.local
```

Set your remove.bg API key:

```text
REMOVE_BG_API_KEY=your_remove_bg_api_key
```

Run the development server:

```bash
npm run dev
```

Open `http://127.0.0.1:3000`.

## API

```text
POST /api/remove-background
```

Request:

```text
multipart/form-data
field: image
```

Success response:

```text
Content-Type: image/png
Cache-Control: no-store
```

## Cloudflare Notes

The app is structured for a Cloudflare Pages deployment with a server-side API route. Configure `REMOVE_BG_API_KEY` as a Cloudflare environment variable. For production Cloudflare hosting, use the current Next.js-on-Cloudflare adapter supported by your Cloudflare Pages setup.

Images are not stored by this application. Uploaded files are validated, proxied to remove.bg, and returned to the browser during the request lifecycle.

