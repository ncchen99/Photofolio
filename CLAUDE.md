# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev              # local dev server
npm run prepare-images   # convert JPGs → WebP + regenerate content/albums.json
npm run build            # SSG build (next build)
npm run start            # serve the build output
npm run lint             # eslint
```

`prepare-images` runs `scripts/build-images.mjs` (Node + sharp). It has its own `package.json` in `scripts/` — dependencies are installed separately via `cd scripts && npm install`.

## Architecture

**Fully static site** — Next.js 15 App Router with `force-static` / `revalidate: false` on all pages. No server runtime; all routes are build-time generated.

### Data flow

```
content/projects/<ChineseFolder>/   ← original JPGs + index.mdx (not deployed)
        ↓  npm run prepare-images
public/albums/<slug>/               ← display WebP (1200px, q88) + thumb WebP (600px, q80)
content/albums.json                 ← single manifest: bio + all album metadata + photo dimensions
        ↓  import at build time
src/lib/albums.ts                   ← typed helpers (getAllAlbums, getAlbum, getBio, getNextAlbum)
        ↓
src/app/page.tsx                    ← home (bio + album grid)
src/app/album/[slug]/page.tsx       ← album detail (masonry + lightbox)
```

### Key design decisions

- **`content/albums.json`** is the single source of truth at build time. It must be committed to git because jsDelivr serves images directly from the GitHub repo (`public/albums/`).
- **CDN vs local**: `src/lib/cdn.ts` prepends `NEXT_PUBLIC_CDN_BASE` to image paths in production; unset = local `/albums/…` paths. See `.env.example`.
- **Masonry** (`src/components/Masonry.tsx`) is a custom greedy column-balancer — it packs each photo into the shortest column using aspect ratios, then sorts columns tallest-first. It is not `react-masonry-css` (which is still a dependency but unused).
- **Lightbox** (`src/components/Lightbox.tsx`) uses Swiper. Desktop shows arrow buttons + X; mobile hides arrows and relies on swipe gestures.
- **`next.config.ts`**: `images.unoptimized: true` — Next.js image optimization is disabled since images are pre-processed by sharp and served via jsDelivr CDN.

### Adding a new album

1. Put JPG originals in `content/projects/<ChineseFolderName>/`
2. Add `index.mdx` with frontmatter: `cover`, `date` (YYYY-MM-DD, used for sort order), `title`, `areas[]`
3. Add an entry to the `ALBUMS` array at the top of `scripts/build-images.mjs`: `{ folder, slug, title, titleEn }`
4. Run `npm run prepare-images`
5. Commit `public/albums/<slug>/` and `content/albums.json`

### Deployment

Vercel (recommended) — set `NEXT_PUBLIC_CDN_BASE=https://cdn.jsdelivr.net/gh/ncchen99/Photofolio@main/public` in project environment variables. Also works on Cloudflare Pages / Netlify / GitHub Pages since the output is pure static.
