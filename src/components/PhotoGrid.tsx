"use client";

import { useState } from "react";
import Image from "next/image";
import type { Photo } from "@/lib/albums";
import { cdnUrl } from "@/lib/cdn";
import MasonryGrid from "./Masonry";
import Lightbox from "./Lightbox";
import AtmosphereLayer from "./AtmosphereLayer";

export default function PhotoGrid({ photos }: { photos: Photo[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const aspects = photos.map((p) => p.height / p.width);

  // Sample thumbnails for atmosphere (up to 6)
  const thumbSrcs = photos
    .slice(0, 6)
    .map((p) => cdnUrl(p.thumb || p.src));

  return (
    <>
      <AtmosphereLayer imageSrcs={thumbSrcs}>
        <MasonryGrid aspects={aspects} gap={16}>
          {photos.map((p, i) => (
            <button
              key={p.src}
              type="button"
              onClick={() => setOpenIdx(i)}
              className="group relative block w-full overflow-hidden bg-[#1a1410] cursor-zoom-in"
              aria-label={`Open photo ${i + 1}`}
            >
              <Image
                src={cdnUrl(p.thumb || p.src)}
                alt=""
                width={p.width}
                height={p.height}
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                className="w-full h-auto transition-transform duration-700 ease-out group-hover:scale-[1.02]"
              />

              {/* Fog edges: softens the transition between image and background */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  boxShadow: "inset 0 0 12px 4px rgba(241, 232, 212, 0.10)",
                }}
                aria-hidden="true"
              />
            </button>
          ))}
        </MasonryGrid>
      </AtmosphereLayer>
      {openIdx !== null ? (
        <Lightbox
          photos={photos}
          index={openIdx}
          onIndexChange={setOpenIdx}
          onClose={() => setOpenIdx(null)}
        />
      ) : null}
    </>
  );
}
