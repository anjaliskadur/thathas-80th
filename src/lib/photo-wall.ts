/**
 * Photos shown in the homepage marquee wall.
 *
 * Drop real family photos into public/photos/ (jpg/png/webp) and list the
 * filenames here. On every visit the wall shuffles order, column placement,
 * and animation phase so it never opens on the same pictures.
 */
export const photoWallImages = [
  "memory-01.svg",
  "memory-02.svg",
  "memory-03.svg",
  "memory-04.svg",
  "memory-05.svg",
  "memory-06.svg",
  "memory-07.svg",
  "memory-08.svg",
  "memory-09.svg",
  "memory-10.svg",
  "memory-11.svg",
  "memory-12.svg",
  "memory-13.svg",
  "memory-14.svg",
  "memory-15.svg",
  "memory-16.svg",
  "memory-17.svg",
  "memory-18.svg",
  "memory-19.svg",
  "memory-20.svg",
].map((file) => `/photos/${file}`);

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
 * Splits a (usually pre-shuffled) photo list into alternating up/down columns,
 * rotates each column's stack so the first visible frames differ, and varies
 * speed + phase so the wall feels organic.
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
