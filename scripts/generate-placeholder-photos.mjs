// Generates placeholder "photo" cards for the marquee wall so the layout can
// be previewed before real family photos are dropped into public/photos.
// Run: node scripts/generate-placeholder-photos.mjs
import { writeFileSync, mkdirSync } from "node:fs";

const OUT_DIR = new URL("../public/photos/", import.meta.url);
mkdirSync(OUT_DIR, { recursive: true });

const bgVariants = ["#0B0A08", "#120E0C", "#150C0E", "#0C0F0E"];
const gold = "#C6A15B";
const goldDim = "#8A6B2E";

// A small set of restrained gold line-art motifs evoking celebration,
// family and warmth without leaning on any single cliché.
const motifs = [
  // diya / lamp
  `<path d="M100 150c0 22 18 34 40 34s40-12 40-34c0-16-40-46-40-46s-40 30-40 46z" fill="none" stroke="${gold}" stroke-width="2"/><path d="M120 150c0 12 9 20 20 20s20-8 20-20" fill="none" stroke="${gold}" stroke-width="2"/><path d="M140 92c-6 8-8 14-8 20 0 6 4 10 8 10s8-4 8-10c0-6-2-12-8-20z" fill="${gold}"/>`,
  // lotus
  `<g fill="none" stroke="${gold}" stroke-width="2"><path d="M140 190c-40 0-56-34-56-56 22 0 40 10 50 26"/><path d="M140 190c40 0 56-34 56-56-22 0-40 10-50 26"/><path d="M140 190c-16-30-16-64 0-92"/><path d="M140 190c16-30 16-64 0-92"/><path d="M140 190c0-34 0-62 0-92"/></g>`,
  // laurel
  `<g fill="none" stroke="${gold}" stroke-width="2"><path d="M100 200c-20-40-14-90 40-120"/><path d="M180 200c20-40 14-90-40-120"/>${Array.from(
    { length: 5 },
    (_, i) => `<path d="M${104 + i * 6} ${188 - i * 26} q10 -6 18 -14" />`
  ).join("")}${Array.from(
    { length: 5 },
    (_, i) => `<path d="M${176 - i * 6} ${188 - i * 26} q-10 -6 -18 -14" />`
  ).join("")}</g>`,
  // monogram
  `<text x="140" y="168" font-family="Georgia, 'Times New Roman', serif" font-size="72" fill="${gold}" text-anchor="middle" letter-spacing="4">DK</text>`,
  // camera
  `<g fill="none" stroke="${gold}" stroke-width="2"><rect x="90" y="110" width="100" height="70" rx="8"/><circle cx="140" cy="145" r="22"/><circle cx="140" cy="145" r="10"/><rect x="115" y="96" width="30" height="14" rx="3"/></g>`,
  // musical note pair
  `<g fill="${gold}"><circle cx="108" cy="176" r="12"/><circle cx="164" cy="164" r="12"/></g><g fill="none" stroke="${gold}" stroke-width="2"><path d="M120 176V100l56 14v50"/></g>`,
  // teacup
  `<g fill="none" stroke="${gold}" stroke-width="2"><path d="M96 130h96v20c0 28-22 46-48 46s-48-18-48-46v-20z"/><path d="M192 138c14-2 22 6 22 18s-10 20-24 18"/><path d="M110 118c2-8 8-14 8-22M140 118c2-8 8-14 8-22M170 118c2-8 8-14 8-22" /></g>`,
  // open book
  `<g fill="none" stroke="${gold}" stroke-width="2"><path d="M140 108c-14-10-34-12-50-6v78c16-6 36-4 50 6"/><path d="M140 108c14-10 34-12 50-6v78c-16-6-36-4-50 6"/><path d="M140 108v78"/></g>`,
];

function rand(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function card(index, aspect) {
  const [w, h] = aspect === "portrait" ? [280, 350] : [350, 280];
  const bg = rand(bgVariants);
  const motif = rand(motifs);
  const id = String(index).padStart(2, "0");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <defs>
    <radialGradient id="glow${id}" cx="50%" cy="42%" r="65%">
      <stop offset="0%" stop-color="#221c14"/>
      <stop offset="100%" stop-color="${bg}"/>
    </radialGradient>
    <filter id="grain${id}">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" result="noise"/>
      <feColorMatrix in="noise" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.03 0"/>
      <feComposite operator="over" in2="SourceGraphic"/>
    </filter>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#glow${id})"/>
  <rect x="10" y="10" width="${w - 20}" height="${h - 20}" fill="none" stroke="${goldDim}" stroke-width="1"/>
  <g transform="translate(${w / 2 - 140}, ${h / 2 - 130})" opacity="0.85">${motif}</g>
  <rect width="${w}" height="${h}" filter="url(#grain${id})" opacity="0.5"/>
</svg>`;
}

let count = 0;
for (let i = 1; i <= 14; i++) {
  writeFileSync(new URL(`memory-${String(i).padStart(2, "0")}.svg`, OUT_DIR), card(i, "portrait"));
  count++;
}
for (let i = 15; i <= 20; i++) {
  writeFileSync(new URL(`memory-${String(i).padStart(2, "0")}.svg`, OUT_DIR), card(i, "landscape"));
  count++;
}

console.log(`Generated ${count} placeholder photo cards in public/photos/`);
