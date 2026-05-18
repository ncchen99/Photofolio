"use client";

import { useEffect, useState, useRef, type CSSProperties } from "react";
import {
  extractDominantColor,
  averageColors,
  toAtmosphereTint,
  rgbString,
  type RGB,
} from "@/lib/color";

type Props = {
  /** Image srcs to sample colors from (usually thumbnails) */
  imageSrcs: string[];
  /** Optional className on the wrapper */
  className?: string;
  children: React.ReactNode;
};

/**
 * AtmosphereLayer
 *
 * Wraps a grid of images and places a layered, soft gradient
 * behind them. The gradient color is computed from the dominant
 * colors of all images — desaturated just enough to feel natural,
 * then painted as large blurred blobs that bleed into the page.
 *
 * Two layers:
 *  1. Wide outer wash  — very large, very blurred, low opacity
 *  2. Tight inner blobs — per-image color at different positions
 */
export default function AtmosphereLayer({
  imageSrcs,
  className = "",
  children,
}: Props) {
  const [atmosphere, setAtmosphere] = useState<{
    avg: RGB;
    tints: RGB[];
    rawColors: RGB[];
  } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (imageSrcs.length === 0) return;
    let cancelled = false;

    // Sample up to 8 images
    const sampled = imageSrcs.slice(0, 8);

    Promise.all(sampled.map(extractDominantColor)).then((rawColors) => {
      if (cancelled) return;

      // Per-image tints — moderate desaturation, elegant brightness (middle ground)
      const tints = rawColors.map((c) =>
        toAtmosphereTint(c, {
          maxSaturation: 0.32,
          targetLightness: 0.85,
          paperMix: 0.45,
        })
      );

      // Average tint — slightly more diffuse and integrated with paper base
      const avg = toAtmosphereTint(averageColors(rawColors), {
        maxSaturation: 0.24,
        targetLightness: 0.86,
        paperMix: 0.48,
      });

      setAtmosphere({ avg, tints, rawColors });
    });

    return () => { cancelled = true; };
  }, [imageSrcs]);

  // ── Layer 1: wide outer wash (very blurred, covers entire section) ──
  const outerStyle: CSSProperties = atmosphere
    ? {
        position: "absolute",
        inset: "-120px",
        zIndex: 0,
        pointerEvents: "none",
        filter: "blur(140px)",
        opacity: 1,
        transition: "opacity 2s ease-out",
        background: generateOuterWash(atmosphere.avg, atmosphere.tints),
      }
    : {
        position: "absolute",
        inset: "-120px",
        zIndex: 0,
        pointerEvents: "none",
        opacity: 0,
      };

  // ── Layer 2: tighter blobs (less blur, stronger colour punch) ──
  const innerStyle: CSSProperties = atmosphere
    ? {
        position: "absolute",
        inset: "-60px",
        zIndex: 0,
        pointerEvents: "none",
        filter: "blur(70px)",
        opacity: 0.85,
        transition: "opacity 2s ease-out",
        background: generateInnerBlobs(atmosphere.tints),
      }
    : {
        position: "absolute",
        inset: "-60px",
        zIndex: 0,
        pointerEvents: "none",
        opacity: 0,
      };

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      style={{ isolation: "isolate" }}
    >
      {/* Layer 1 — wide outer wash */}
      <div style={outerStyle} aria-hidden="true" />

      {/* Layer 2 — tighter inner colour blobs */}
      <div style={innerStyle} aria-hidden="true" />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </div>
  );
}

/**
 * Wide outer wash — a single large ellipse of the average colour
 * plus flanking blobs from the most prominent per-image tints.
 */
function generateOuterWash(avg: RGB, tints: RGB[]): string {
  const parts: string[] = [
    // Central full-coverage ellipse
    `radial-gradient(ellipse 120% 100% at 50% 50%, ${rgbString(avg, 0.55)}, transparent 75%)`,
  ];

  // Left third, top
  if (tints[0])
    parts.push(`radial-gradient(ellipse 70% 60% at 15% 35%, ${rgbString(tints[0], 0.40)}, transparent 65%)`);
  // Right third, top
  if (tints[1])
    parts.push(`radial-gradient(ellipse 70% 60% at 82% 30%, ${rgbString(tints[1], 0.38)}, transparent 65%)`);
  // Centre, bottom
  if (tints[2])
    parts.push(`radial-gradient(ellipse 80% 55% at 50% 80%, ${rgbString(tints[2], 0.35)}, transparent 65%)`);

  return parts.join(", ");
}

/**
 * Tighter inner blobs — one per sampled image, placed on a grid
 * that roughly matches a 3-column masonry layout.
 */
function generateInnerBlobs(tints: RGB[]): string {
  // Positions roughly correspond to masonry columns & rows
  const grid = [
    { x: 17, y: 28 },
    { x: 50, y: 22 },
    { x: 83, y: 28 },
    { x: 17, y: 65 },
    { x: 50, y: 72 },
    { x: 83, y: 65 },
    { x: 33, y: 45 },
    { x: 67, y: 48 },
  ];

  return tints
    .map((tint, i) => {
      const pos = grid[i % grid.length];
      const w = 48 + (i % 3) * 8;   // 48–64%
      const h = 42 + (i % 2) * 10;  // 42–52%
      return `radial-gradient(ellipse ${w}% ${h}% at ${pos.x}% ${pos.y}%, ${rgbString(tint, 0.55)}, transparent 70%)`;
    })
    .join(", ");
}
