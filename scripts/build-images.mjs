#!/usr/bin/env node
// Stage 1: process source photos -> WebP + manifest
import { promises as fs } from "node:fs";
import path from "node:path";
import sharp from "sharp";
import matter from "gray-matter";

const ROOT = path.resolve(new URL("..", import.meta.url).pathname);
const SRC_DIR = path.join(ROOT, "content/projects");
const OUT_DIR = path.join(ROOT, "public/albums");
const AVATAR_SRC = path.join(ROOT, "content/assets/avatar.png");
const AVATAR_OUT = path.join(ROOT, "public/avatar.webp");
const MANIFEST_OUT = path.join(ROOT, "content/albums.json");

const ALBUMS = [
  { folder: "2024年末",      slug: "year-end-2024",     title: "2024 年末",     titleEn: "Year's End, 2024" },
  { folder: "myHome",        slug: "home",              title: "家",            titleEn: "Home" },
  { folder: "合歡山",         slug: "hehuanshan",        title: "合歡山",         titleEn: "Hehuanshan" },
  { folder: "嘉義",           slug: "chiayi",            title: "嘉義",           titleEn: "Chiayi" },
  { folder: "屏東獨旅",       slug: "pingtung-solo",     title: "屏東獨旅",       titleEn: "Pingtung, Alone" },
  { folder: "日本",           slug: "japan",             title: "日本",           titleEn: "Japan" },
  { folder: "果嶺野餐",       slug: "green-picnic",      title: "果嶺野餐",       titleEn: "Picnic on the Green" },
  { folder: "水交社",         slug: "shuijiaoshe",       title: "水交社",         titleEn: "Shuijiaoshe" },
  { folder: "永樂市場",       slug: "yongle-market",     title: "永樂市場",       titleEn: "Yongle Market" },
  { folder: "畢業奇美",       slug: "graduation-chimei", title: "畢業奇美",       titleEn: "Graduation, Chimei" },
  { folder: "眠月線",         slug: "mianyue-line",      title: "眠月線",         titleEn: "Mianyue Line" },
  { folder: "福岡 - 岡山",    slug: "fukuoka-okayama",   title: "福岡 — 岡山",    titleEn: "Fukuoka — Okayama" },
  { folder: "老鏡試用",       slug: "vintage-lens",      title: "Old Lens, New Tests", titleEn: "Old Lens, New Tests" },
];
// fix the last title (Chinese)
ALBUMS[ALBUMS.length - 1].title = "老鏡試用";

const BIO = {
  name: "馬臉",
  nameEn: "Horse Face",
  location: "Tanaka, Taiwan",
  intro: "Keep studying until you know who I am.",
  social: [
    { label: "Instagram", handle: "@horseface_1110", href: "https://www.instagram.com/horseface_1110/" },
  ],
  avatar: "/avatar.webp",
};

function slugifyStem(name) {
  const stem = name.replace(/\.[^.]+$/, "");
  return stem.toLowerCase().replace(/\s+/g, "-");
}

async function exists(p) {
  try { await fs.access(p); return true; } catch { return false; }
}
async function mtime(p) {
  try { return (await fs.stat(p)).mtimeMs; } catch { return 0; }
}

async function naturalSortPhotos(dir) {
  const entries = await fs.readdir(dir);
  const files = entries.filter(f => /\.(jpe?g)$/i.test(f));
  files.sort((a, b) => a.localeCompare(b, "en", { numeric: true, sensitivity: "base" }));
  return files;
}

const failures = [];
let totalSrcBytes = 0;
let totalOutBytes = 0;
let srcCount = 0;
let outCount = 0;

async function processOne(srcPath, outDisplay, outThumb) {
  const srcStat = await fs.stat(srcPath);
  srcCount++;
  totalSrcBytes += srcStat.size;

  const srcMtime = srcStat.mtimeMs;
  const dispMtime = await mtime(outDisplay);
  const thumbMtime = await mtime(outThumb);
  const upToDate = dispMtime > srcMtime && thumbMtime > srcMtime;

  let width, height;
  if (!upToDate) {
    const baseBuf = await fs.readFile(srcPath);
    // display
    const dispPipeline = sharp(baseBuf).rotate().resize({ width: 1200, withoutEnlargement: true }).webp({ quality: 88, effort: 5 });
    const dispOut = await dispPipeline.toBuffer({ resolveWithObject: true });
    await fs.writeFile(outDisplay, dispOut.data);
    width = dispOut.info.width;
    height = dispOut.info.height;

    const thumbPipeline = sharp(baseBuf).rotate().resize({ width: 600, withoutEnlargement: true }).webp({ quality: 80, effort: 5 });
    const thumbOut = await thumbPipeline.toBuffer();
    await fs.writeFile(outThumb, thumbOut);
  } else {
    const meta = await sharp(outDisplay).metadata();
    width = meta.width;
    height = meta.height;
  }

  const dispSize = (await fs.stat(outDisplay)).size;
  const thumbSize = (await fs.stat(outThumb)).size;
  totalOutBytes += dispSize + thumbSize;
  outCount += 2;
  return { width, height };
}

async function mapWithConcurrency(items, limit, worker) {
  const results = new Array(items.length);
  let idx = 0;
  const runners = Array.from({ length: limit }, async () => {
    while (true) {
      const i = idx++;
      if (i >= items.length) return;
      try { results[i] = await worker(items[i], i); }
      catch (err) { failures.push({ item: items[i], error: String(err && err.message || err) }); }
    }
  });
  await Promise.all(runners);
  return results;
}

async function main() {
  await fs.mkdir(path.dirname(MANIFEST_OUT), { recursive: true });
  await fs.mkdir(path.dirname(AVATAR_OUT), { recursive: true });

  const albumsManifest = [];

  for (let i = 0; i < ALBUMS.length; i++) {
    const a = ALBUMS[i];
    const srcAlbumDir = path.join(SRC_DIR, a.folder);
    const outAlbumDir = path.join(OUT_DIR, a.slug);
    if (!(await exists(srcAlbumDir))) {
      failures.push({ item: srcAlbumDir, error: "album folder missing" });
      continue;
    }
    await fs.mkdir(outAlbumDir, { recursive: true });
    const files = await naturalSortPhotos(srcAlbumDir);
    const tasks = files.map(f => ({ src: path.join(srcAlbumDir, f), stem: slugifyStem(f), origName: f }));

    const photos = new Array(tasks.length);
    await mapWithConcurrency(tasks, 4, async (t, idx) => {
      const outDisplay = path.join(outAlbumDir, `${t.stem}.webp`);
      const outThumb = path.join(outAlbumDir, `${t.stem}.thumb.webp`);
      const { width, height } = await processOne(t.src, outDisplay, outThumb);
      photos[idx] = {
        src: `/albums/${a.slug}/${t.stem}.webp`,
        thumb: `/albums/${a.slug}/${t.stem}.thumb.webp`,
        width,
        height,
      };
    });

    const cleanPhotos = photos.filter(Boolean);

    // Read MDX (title / date / areas / body intro)
    const mdxPath = path.join(srcAlbumDir, "index.mdx");
    let mdxTitle = a.title;
    let date = null;
    let areas = [];
    let description = "";
    if (await exists(mdxPath)) {
      try {
        const raw = await fs.readFile(mdxPath, "utf8");
        const parsed = matter(raw);
        if (parsed.data?.title) mdxTitle = String(parsed.data.title).trim();
        if (parsed.data?.date) date = String(parsed.data.date).trim();
        if (Array.isArray(parsed.data?.areas)) {
          areas = parsed.data.areas
            .map(s => String(s).trim())
            .filter(Boolean);
        }
        description = parsed.content.trim().replace(/^---\s*$/m, "").trim();
      } catch (err) {
        failures.push({ item: mdxPath, error: String(err.message || err) });
      }
    }

    albumsManifest.push({
      slug: a.slug,
      title: mdxTitle,
      titleEn: a.titleEn,
      date,
      areas,
      description,
      cover: cleanPhotos[0]?.src ?? null,
      photos: cleanPhotos,
    });
  }

  // Sort albums by date desc (newest first); albums without a date sink to the bottom
  albumsManifest.sort((x, y) => {
    if (!x.date && !y.date) return 0;
    if (!x.date) return 1;
    if (!y.date) return -1;
    return y.date.localeCompare(x.date);
  });
  albumsManifest.forEach((a, i) => { a.no = String(i + 1).padStart(2, "0"); });

  // Avatar
  if (await exists(AVATAR_SRC)) {
    try {
      const srcStat = await fs.stat(AVATAR_SRC);
      const outM = await mtime(AVATAR_OUT);
      if (outM <= srcStat.mtimeMs) {
        await sharp(AVATAR_SRC).rotate().resize({ width: 800, withoutEnlargement: true }).webp({ quality: 90, effort: 5 }).toFile(AVATAR_OUT);
      }
    } catch (err) {
      failures.push({ item: AVATAR_SRC, error: String(err.message || err) });
    }
  } else {
    failures.push({ item: AVATAR_SRC, error: "avatar source missing" });
  }

  const manifest = { bio: BIO, albums: albumsManifest };
  await fs.writeFile(MANIFEST_OUT, JSON.stringify(manifest, null, 2) + "\n");

  console.log("---- Stage 1 summary ----");
  console.log(`Source files: ${srcCount}`);
  console.log(`Output files (display+thumb): ${outCount}`);
  console.log(`Source bytes:  ${totalSrcBytes.toLocaleString()} (${(totalSrcBytes/1048576).toFixed(2)} MiB)`);
  console.log(`Output bytes:  ${totalOutBytes.toLocaleString()} (${(totalOutBytes/1048576).toFixed(2)} MiB)`);
  console.log(`Failures: ${failures.length}`);
  for (const f of failures) console.log(`  - ${f.item}: ${f.error}`);
  console.log(`Manifest: ${MANIFEST_OUT}`);
}

main().catch(err => { console.error(err); process.exit(1); });
