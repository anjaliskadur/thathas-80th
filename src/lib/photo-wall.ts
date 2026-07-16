/**
 * Client-safe photo-wall helpers (no Node fs).
 * Server-only discovery lives in get-photo-wall-images.ts.
 */

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

/** Pick a shuffled subset for the homepage marquee (lighter first paint). */
export function pickHeroImages(images: readonly string[], max = 24): string[] {
  if (images.length <= max) return shuffle(images);
  return shuffle(images).slice(0, max);
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
  if (images.length === 0) return [];

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
