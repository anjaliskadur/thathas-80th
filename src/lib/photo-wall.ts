import fs from "fs";
import path from "path";

const IMAGE_EXT = /\.(jpe?g|png|webp|gif)$/i;

/** Placeholder SVGs used only if public/photos/wall is empty. */
const PLACEHOLDER_IMAGES = Array.from({ length: 20 }, (_, i) => {
  const n = String(i + 1).padStart(2, "0");
  return `/photos/memory-${n}.svg`;
});

/**
 * Reads every image in public/photos/wall.
 * Drop new jpg/png/webp files there — no code changes needed; redeploy to pick them up.
 */
export function getPhotoWallImages(): string[] {
  const dir = path.join(process.cwd(), "public", "photos", "wall");
  if (!fs.existsSync(dir)) return PLACEHOLDER_IMAGES;

  const files = fs
    .readdirSync(dir)
    .filter((name) => IMAGE_EXT.test(name) && !name.startsWith("."))
    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));

  if (files.length === 0) return PLACEHOLDER_IMAGES;

  return files.map((name) => `/photos/wall/${encodeURIComponent(name)}`);
}

export type WallColumn = {
  images: string[];
  direction: "up" | "down";
  /** seconds for one full loop */
  duration: number;
  /** negative delay starts the loop mid-cycle so columns don't sync */
  animationDelay: number;
};

/** Fisher–Yates shuffle — new array, does not mutate input. */
export function shuffle<T>(items: readonly T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Splits a photo list into alternating up/down columns, rotates each column's
 * stack so the first visible frames differ, and varies speed + phase.
 */
export function buildColumns(
  images: readonly string[],
  columnCount: number,
  baseDuration = 46
): WallColumn[] {
  const shuffled = shuffle(images);

  const columns: WallColumn[] = Array.from({ length: columnCount }, (_, i) => ({
    images: [] as string[],
    direction: (i % 2 === 0 ? "up" : "down") as "up" | "down",
    duration: baseDuration,
    animationDelay: 0,
  }));

  shuffled.forEach((src, i) => {
    columns[i % columnCount].images.push(src);
  });

  columns.forEach((col) => {
    while (col.images.length > 0 && col.images.length < 4) {
      col.images.push(...col.images);
    }

    if (col.images.length > 1) {
      const offset = Math.floor(Math.random() * col.images.length);
      col.images = [...col.images.slice(offset), ...col.images.slice(0, offset)];
    }

    col.duration = baseDuration + Math.random() * 18;
    col.animationDelay = -(Math.random() * col.duration);
  });

  return columns;
}
