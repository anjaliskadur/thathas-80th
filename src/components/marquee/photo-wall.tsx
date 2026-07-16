"use client";

import { useEffect, useState } from "react";
import { buildColumns, type WallColumn } from "@/lib/photo-wall";
import { MarqueeColumn } from "./marquee-column";

export function PhotoWall({
  images,
  columnCount = 6,
}: {
  images: string[];
  columnCount?: number;
}) {
  const [columns, setColumns] = useState<WallColumn[] | null>(null);

  useEffect(() => {
    // Shuffle on the client so every visit gets a fresh arrangement.
    setColumns(buildColumns(images, columnCount));
  }, [images, columnCount]);

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
