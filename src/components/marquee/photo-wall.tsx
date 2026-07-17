"use client";

import { useEffect, useRef, useState } from "react";
import { buildColumns, pickHeroImages } from "@/lib/photo-wall";
import { MarqueeColumn } from "./marquee-column";
import type { WallColumn } from "@/lib/photo-wall";

function columnCountForWidth(width: number) {
  if (width < 640) return 3;
  if (width < 1024) return 4;
  return 6;
}

export function PhotoWall({ images }: { images: string[] }) {
  const poolRef = useRef(pickHeroImages(images, 24));
  const countRef = useRef(0);
  const [columns, setColumns] = useState<WallColumn[]>(() =>
    buildColumns(poolRef.current.slice(0, 15), 3)
  );

  useEffect(() => {
    poolRef.current = pickHeroImages(images, 24);
    countRef.current = 0;

    function rebuild(force = false) {
      const count = columnCountForWidth(window.innerWidth);
      if (!force && count === countRef.current) return;
      countRef.current = count;
      const max = count <= 3 ? 15 : 24;
      setColumns(buildColumns(poolRef.current.slice(0, max), count, 46, false));
    }

    rebuild(true);
    const onResize = () => rebuild(false);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [images]);

  if (columns.length === 0) {
    return <div aria-hidden className="marquee-viewport" />;
  }

  return (
    <div
      aria-hidden
      className="marquee-viewport"
      style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}
    >
      {columns.map((col, i) => (
        <MarqueeColumn key={`${columns.length}-${i}`} {...col} />
      ))}
    </div>
  );
}
