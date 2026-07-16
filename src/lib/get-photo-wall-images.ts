import "server-only";
import fs from "fs";
import path from "path";

const IMAGE_EXT = /\.(jpe?g|png|webp|gif)$/i;

/** Placeholder SVGs used only if wall-web is empty. */
const PLACEHOLDER_IMAGES = Array.from({ length: 20 }, (_, i) => {
  const n = String(i + 1).padStart(2, "0");
  return `/photos/memory-${n}.svg`;
});

/**
 * Reads every optimized image in public/photos/wall-web.
 * Drop new originals in photos-originals/, then run: npm run optimize:wall
 */
export function getPhotoWallImages(): string[] {
  const dir = path.join(process.cwd(), "public", "photos", "wall-web");
  if (!fs.existsSync(dir)) return PLACEHOLDER_IMAGES;

  const files = fs
    .readdirSync(dir)
    .filter((name) => IMAGE_EXT.test(name) && !name.startsWith("."))
    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));

  if (files.length === 0) return PLACEHOLDER_IMAGES;

  return files.map((name) => `/photos/wall-web/${name}`);
}
