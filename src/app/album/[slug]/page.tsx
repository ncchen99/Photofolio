import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import SiteHeader from "@/components/SiteHeader";
import PhotoGrid from "@/components/PhotoGrid";
import { getAlbum, getAllAlbums, getNextAlbum } from "@/lib/albums";
import { cdnUrl } from "@/lib/cdn";

export const dynamic = "force-static";
export const revalidate = false;
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllAlbums().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const album = getAlbum(slug);
  if (!album) return {};
  const title = `${album.title} — Horse Face`;
  const description = album.description || `${album.titleEn} · ${album.photos.length} frames.`;
  const imageUrl = cdnUrl(album.cover);
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: imageUrl }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function AlbumPage(
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const album = getAlbum(slug);
  if (!album) notFound();

  const next = getNextAlbum(slug);

  return (
    <div>
      <SiteHeader back />

      <section className="px-6 md:px-12 pt-10 md:pt-14 pb-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="font-serif text-[40px] md:text-[64px] leading-[1.05] tracking-[-0.01em] text-ink m-0">
              {album.title}
            </h1>
            <div className="font-mono text-[11px] tracking-[0.22em] uppercase text-ink-mute mt-3 flex flex-wrap gap-x-3 gap-y-1">
              {album.date ? <span>{album.date}</span> : null}
              {album.areas?.map((a) => (
                <span key={a}>· {a}</span>
              ))}
            </div>
          </div>
          <div className="font-mono text-[11px] tracking-[0.22em] uppercase text-ink-mute">
            {album.photos.length} frames
          </div>
        </div>
        {album.description ? (
          <p className="font-serif text-base md:text-lg text-ink-soft mt-6 max-w-2xl leading-relaxed whitespace-pre-line">
            {album.description}
          </p>
        ) : null}
      </section>

      <main className="px-6 md:px-12 pb-16">
        <PhotoGrid photos={album.photos} />
      </main>

      {next ? (
        <footer className="px-6 md:px-12 py-12 border-t border-ink/15">
          <Link
            href={`/album/${next.slug}`}
            className="inline-flex items-baseline gap-3 group"
          >
            <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-ink-mute">
              Next
            </span>
            <span className="font-serif text-2xl md:text-3xl text-ink group-hover:text-rust transition-colors inline-flex items-baseline gap-2">
              {next.title}
              <ArrowRightIcon className="w-5 h-5 self-center" strokeWidth={1.6} />
            </span>
          </Link>
        </footer>
      ) : null}
    </div>
  );
}
