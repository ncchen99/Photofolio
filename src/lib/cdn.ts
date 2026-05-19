/**
 * Prepend NEXT_PUBLIC_CDN_BASE (if set) to a root-relative path so images
 * can be served from jsDelivr in production while staying local in dev.
 */
const DEFAULT_CDN_BASE = process.env.NODE_ENV === "production"
  ? "https://raw.githubusercontent.com/ncchen99/Photofolio/refs/heads/main/public"
  : "";
const CDN_BASE = process.env.NEXT_PUBLIC_CDN_BASE?.replace(/\/+$/, "") || DEFAULT_CDN_BASE;

export function cdnUrl(path: string): string {
  if (!path) return path;
  if (/^https?:\/\//i.test(path)) return path;
  if (!CDN_BASE) return path;
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${CDN_BASE}${p}`;
}
