# Cloudflare Pages Native GitHub Setup

Use Cloudflare Pages native GitHub integration with these settings:

```text
Project name: image-background-remover
Production branch: main
Framework preset: Next.js (Static HTML Export)
Build command: NEXT_OUTPUT=export NODE_OPTIONS=--max-old-space-size=2048 npm run pages:build
Build output directory: out
Root directory: /
```

Environment variables:

```text
REMOVE_BG_API_KEY=<your remove.bg API key>
NODE_VERSION=22
NEXT_OUTPUT=export
```

Cloudflare Pages will deploy the static Next.js app from `out` and the background-removal API from `functions/api/remove-background.ts`.
