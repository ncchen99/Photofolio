"use client";

import SkeletonImage from "./SkeletonImage";
import Link from "next/link";
import type { Album } from "@/lib/albums";
import { cdnUrl } from "@/lib/cdn";
import MasonryGrid from "./Masonry";
import AtmosphereLayer from "./AtmosphereLayer";

export default function AlbumGrid({ albums }: { albums: Album[] }) {
  const aspects = albums.map((a) => {
    const first = a.photos[0];
    return first ? first.height / first.width : 1.25;
  });

  // Gather cover image URLs for atmosphere sampling
  const coverSrcs = albums.map((a) => cdnUrl(a.cover));

  return (
    <AtmosphereLayer imageSrcs={coverSrcs}>
      <MasonryGrid aspects={aspects} gap={16}>
        {albums.map((a) => {
          const first = a.photos[0];
          return (
            <Link
              key={a.slug}
              href={`/album/${a.slug}`}
              className="group block relative overflow-hidden"
            >
              <SkeletonImage
                src={cdnUrl(a.cover)}
                alt={a.title}
                width={first?.width ?? 1200}
                height={first?.height ?? 1500}
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                className="w-full h-auto transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              />

              {/* Fog edges: softens the transition between image and background */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  boxShadow: "inset 0 0 12px 4px rgba(241, 232, 212, 0.10)",
                }}
                aria-hidden="true"
              />

              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500">
                <div className="p-4 text-paper-soft">
                  <div className="font-serif text-xl leading-tight">{a.title}</div>
                  <div className="font-mono text-[10px] tracking-[0.18em] uppercase mt-1 text-paper-soft/80">
                    {(a.areas && a.areas[0]) || a.titleEn} · {a.photos.length} frames
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </MasonryGrid>
    </AtmosphereLayer>
  );
}
