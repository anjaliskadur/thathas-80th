"use client";

import { useState } from "react";
import { buildColumns, pickHeroImages } from "@/lib/photo-wall";
import { MarqueeColumn } from "./marquee-column";

const HERO_MAX = 24;

export function PhotoWall({
  images,
  columnCount = 6,
}: {
  images: string[];
  columnCount?: number;
}) {
  // Cap + shuffle once per mount so every visit looks different.
  const [columns] = useState(() =>
    buildColumns(pickHeroImages(images, HERO_MAX), columnCount)
  );

  if (columns.length === 0) {
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
