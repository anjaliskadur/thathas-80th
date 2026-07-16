"use client";

import { useEffect, useState } from "react";
import { buildColumns, photoWallImages, type WallColumn } from "@/lib/photo-wall";
import { MarqueeColumn } from "./marquee-column";

export function PhotoWall({ columnCount = 6 }: { columnCount?: number }) {
  const [columns, setColumns] = useState<WallColumn[] | null>(null);

  useEffect(() => {
    // Shuffle on the client so every visit (and every soft navigation home)
    // gets a fresh arrangement — not a build-time snapshot.
    setColumns(buildColumns(photoWallImages, columnCount));
  }, [columnCount]);

  if (!columns) {
    return (
      <div
        aria-hidden
        className="marquee-viewport"
        style={{ gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))` }}
      />
    );
  }

  return (
    <div
      aria-hidden
      className="marquee-viewport"
      style={{ gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))` }}
    >
      {columns.map((col, i) => (
        <MarqueeColumn key={i} {...col} />
      ))}
    </div>
  );
}
