"use client";

import { Children, useEffect, useState, type ReactNode } from "react";

/**
 * Greedy column-balanced masonry.
 *
 * Pass children and an `aspects` array (height / width per child, same order).
 * We pack each child into the currently shortest column so the bottom edge
 * stays close to flush — better than the round-robin split used by
 * `react-masonry-css`.
 */
function pickCols(width: number) {
  if (width >= 1280) return 3;
  if (width >= 768) return 2;
  return 1;
}

export default function MasonryGrid({
  children,
  aspects,
  gap = 16,
}: {
  children: ReactNode;
  aspects: number[];
  gap?: number;
}) {
  const [cols, setCols] = useState(3);

  useEffect(() => {
    const update = () => setCols(pickCols(window.innerWidth));
    update();
    window.addEventListener("resize", update, { passive: true });
    return () => window.removeEventListener("resize", update);
  }, []);

  const items = Children.toArray(children);
  const columns: ReactNode[][] = Array.from({ length: cols }, () => []);
  const heights = new Array(cols).fill(0);

  items.forEach((node, i) => {
    let target = 0;
    for (let c = 1; c < cols; c++) {
      if (heights[c] < heights[target]) target = c;
    }
    columns[target].push(node);
    heights[target] += aspects[i] ?? 1;
  });

  // Sort columns tallest-first so content fills left-to-right
  const sorted = columns
    .map((col, ci) => ({ col, height: heights[ci] }))
    .sort((a, b) => b.height - a.height)
    .map(({ col }) => col);

  return (
    <div className="flex w-full" style={{ gap }}>
      {sorted.map((col, ci) => (
        <div key={ci} className="flex-1 min-w-0 flex flex-col" style={{ gap }}>
          {col}
        </div>
      ))}
    </div>
  );
}
