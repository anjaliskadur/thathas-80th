/**
 * Compress family photos for the polaroid wall + gallery.
 *
 * Source: photos-originals/  (drop new originals here)
 * Output: public/photos/wall-web/  (served by the site)
 *
 * Usage: npm run optimize:wall
 */
import fs from "fs";
import path from "path";
import sharp from "sharp";

const ROOT = process.cwd();
const SOURCE_DIR = path.join(ROOT, "photos-originals");
const FALLBACK_SOURCE = path.join(ROOT, "public", "photos", "wall");
const OUT_DIR = path.join(ROOT, "public", "photos", "wall-web");
const MAX_WIDTH = 1200;
const WEBP_QUALITY = 78;
const IMAGE_EXT = /\.(jpe?g|png|webp|gif|tiff?)$/i;

function listImages(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((name) => IMAGE_EXT.test(name) && !name.startsWith("."))
    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));
}

function stem(filename) {
  return filename.replace(/\.[^.]+$/, "");
}

async function optimizeOne(srcPath, outPath) {
  await sharp(srcPath)
    .rotate() // honor EXIF orientation
    .resize({
      width: MAX_WIDTH,
      height: MAX_WIDTH,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: WEBP_QUALITY, effort: 4 })
    .toFile(outPath);
}

async function main() {
  const sourceDir = listImages(SOURCE_DIR).length > 0 ? SOURCE_DIR : FALLBACK_SOURCE;
  const files = listImages(sourceDir);

  if (files.length === 0) {
    console.error(
      `No images found in ${SOURCE_DIR} or ${FALLBACK_SOURCE}.\n` +
        `Drop originals into photos-originals/ then re-run.`
    );
    process.exit(1);
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  console.log(`Optimizing ${files.length} photo(s) from ${path.relative(ROOT, sourceDir)} → public/photos/wall-web/`);

  let ok = 0;
  for (const file of files) {
    const src = path.join(sourceDir, file);
    const out = path.join(OUT_DIR, `${stem(file)}.webp`);
    try {
      await optimizeOne(src, out);
      const before = fs.statSync(src).size;
      const after = fs.statSync(out).size;
      console.log(
        `  ✓ ${file} → ${path.basename(out)} (${(before / 1024 / 1024).toFixed(1)}MB → ${(after / 1024).toFixed(0)}KB)`
      );
      ok += 1;
    } catch (err) {
      console.error(`  ✗ ${file}: ${err instanceof Error ? err.message : err}`);
    }
  }

  console.log(`Done. ${ok}/${files.length} optimized.`);
}

main();
