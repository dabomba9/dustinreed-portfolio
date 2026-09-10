/**
 * Generate the site's themes, and refuse to emit one that fails contrast.
 *
 * The palette here is contrast-critical. --color-mute sits at 4.71:1 on
 * raised, a fifth of a point over the floor, and there is a note in
 * globals.css about a single wrong figure hiding a failing pair for a while.
 * Seventeen themes x six roles x two surfaces x two modes is 340 pairs, and
 * choosing 340 pairs by hand is how you ship a broken one.
 *
 * So none of them are chosen. Every colour is converted to OKLCH and its hue
 * rotated; then lightness is solved so the colour's RELATIVE LUMINANCE comes
 * back to exactly where it started. That last part matters and is easy to get
 * wrong: holding OKLCH lightness fixed is nearly right, but WCAG contrast is
 * built on relative luminance, which weights green far above blue. Rotating at
 * fixed L drifted --color-control from 3.05:1 to 2.89:1 and put fourteen of
 * the seventeen stops under the 3:1 floor. Solving for luminance instead holds
 * every ratio where it was.
 *
 * Two things give way, in this order, and never lightness: chroma, when a hue
 * cannot hold it inside sRGB, and then a small nudge of lightness away from
 * the surface when eight-bit rounding spends the last of a role's headroom.
 *
 *   node scripts/themes.mjs          write src/app/themes.css
 *   node scripts/themes.mjs --check  audit only, non-zero exit on any failure
 */
import { writeFileSync } from "node:fs";

const sRGBtoLin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const linTosRGB = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);
const hexToRgb = (h) => [0, 2, 4].map((i) => parseInt(h.slice(1).substr(i, 2), 16) / 255);
const clamp = (c) => Math.max(0, Math.min(1, c));
const rgbToHex = (rgb) =>
  "#" + rgb.map((c) => Math.round(clamp(c) * 255).toString(16).padStart(2, "0")).join("");

function rgbToOklab([r0, g0, b0]) {
  const [r, g, b] = [r0, g0, b0].map(sRGBtoLin);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

function oklabToRgb([L, a, b]) {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ].map(linTosRGB);
}

const inGamut = (rgb) => rgb.every((c) => c >= -1e-4 && c <= 1 + 1e-4);
const luminance = (hex) => {
  const [r, g, b] = hexToRgb(hex).map(sRGBtoLin);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a, b) => {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};

function toLch(hex) {
  const [L, a, b] = rgbToOklab(hexToRgb(hex));
  return [L, Math.hypot(a, b), ((Math.atan2(b, a) * 180) / Math.PI + 360) % 360];
}
function lchToRgb(L, C, H) {
  const r = (H * Math.PI) / 180;
  return oklabToRgb([L, C * Math.cos(r), C * Math.sin(r)]);
}
function lchToHex(L, C, H) {
  let rgb = lchToRgb(L, C, H);
  if (inGamut(rgb)) return rgbToHex(rgb);
  let lo = 0, hi = C;
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    if (inGamut(lchToRgb(L, mid, H))) lo = mid; else hi = mid;
  }
  return rgbToHex(lchToRgb(L, lo, H));
}

/** The colour at this hue whose relative luminance matches the original. */
function solveForLuminance(targetY, chroma, H) {
  let C = chroma;
  for (let attempt = 0; attempt < 6; attempt++) {
    let lo = 0, hi = 1;
    for (let i = 0; i < 50; i++) {
      const mid = (lo + hi) / 2;
      const rgb = lchToRgb(mid, C, H).map(clamp);
      const y = rgb.map(sRGBtoLin).reduce((s, c, j) => s + [0.2126, 0.7152, 0.0722][j] * c, 0);
      if (y < targetY) lo = mid; else hi = mid;
    }
    const L = (lo + hi) / 2;
    if (inGamut(lchToRgb(L, C, H))) return rgbToHex(lchToRgb(L, C, H));
    C *= 0.8; // give up saturation, never luminance
  }
  return lchToHex(0.5, C, H);
}

/** Walk a foreground away from its surfaces until it clears the floor. */
function repair(hex, surfaces, minimum, margin = 0.03) {
  let [L, C, H] = toLch(hex);
  const lighter = luminance(hex) > Math.max(...surfaces.map(luminance));
  for (let i = 0; i < 400; i++) {
    if (surfaces.every((s) => contrast(hex, s) >= minimum + margin)) return hex;
    L = lighter ? Math.min(1, L + 0.002) : Math.max(0, L - 0.002);
    hex = lchToHex(L, C, H);
  }
  return hex;
}

// Exactly what globals.css carries today. Stop 0 must reproduce it.
const DARK = {
  ground: "#0d2117", raised: "#152c21", type: "#f1efe3", soft: "#c2c6b9",
  mute: "#8d9387", rule: "#21402f", control: "#4d7a5f", accent: "#c6ff00",
};
const PLATE = {
  ground: "#f1efe3", raised: "#ffffff", type: "#0d2117", soft: "#41474c",
  mute: "#5c625a", rule: "#d9d5c4", control: "#7c8a72", accent: "#566f00",
};

const NAMES = ["Lime","Fern","Jade","Teal","Aqua","Sky","Azure","Cobalt","Indigo",
  "Violet","Orchid","Magenta","Rose","Crimson","Rust","Amber","Olive"];
const STOPS = NAMES.length;
const TEXT_ROLES = ["type", "soft", "mute", "accent"];
const UI_ROLES = ["control"];
const SURFACES = ["ground", "raised"];

function rotate(palette, delta) {
  const out = {};
  for (const [role, value] of Object.entries(palette)) {
    const [, C, H] = toLch(value);
    out[role] = solveForLuminance(luminance(value), C, (H + delta) % 360);
  }
  const surfaces = SURFACES.map((s) => out[s]);
  for (const r of TEXT_ROLES) out[r] = repair(out[r], surfaces, 4.5);
  for (const r of UI_ROLES) out[r] = repair(out[r], surfaces, 3.0);
  return out;
}

const themes = Array.from({ length: STOPS }, (_, i) => {
  const delta = (360 / STOPS) * i;
  return {
    i, name: NAMES[i],
    dark: i ? rotate(DARK, delta) : { ...DARK },
    plate: i ? rotate(PLATE, delta) : { ...PLATE },
  };
});

function audit() {
  const fails = [];
  for (const t of themes)
    for (const mode of ["dark", "plate"])
      for (const [roles, min] of [[TEXT_ROLES, 4.5], [UI_ROLES, 3.0]])
        for (const role of roles)
          for (const surface of SURFACES) {
            const r = contrast(t[mode][role], t[mode][surface]);
            if (r < min)
              fails.push(`stop ${t.i} ${t.name} ${mode} ${role} on ${surface} = ${r.toFixed(2)} (need ${min})`);
          }
  // Type sitting ON the highlighter. The marker is always the dark palette's
  // accent, even inside a .plate, and the type on it is always the dark
  // ground - so this pair is the same in both modes and easy to forget.
  for (const t of themes) {
    const r = contrast(t.dark.ground, t.dark.accent);
    if (r < 4.5)
      fails.push(`stop ${t.i} ${t.name} on-mark on mark = ${r.toFixed(2)} (need 4.5)`);
  }
  return fails;
}

const fails = audit();
const pairs = STOPS * 2 * (TEXT_ROLES.length + UI_ROLES.length) * SURFACES.length;
if (fails.length) {
  console.error(`${fails.length} of ${pairs} pairs fail:\n` + fails.map((f) => "  " + f).join("\n"));
  process.exit(1);
}
console.log(`${STOPS} themes, ${pairs} pairs, all clear WCAG AA`);
if (process.argv.includes("--check")) process.exit(0);

const vars = (p, indent) =>
  Object.entries(p).map(([k, v]) => `${indent}--color-${k}: ${v};`).join("\n");

let css = `/* Generated by scripts/themes.mjs. Do not edit by hand.
   Every pair in here was checked against WCAG AA at build time; run
   \`npm run themes:check\` to check it again. */\n\n`;
for (const t of themes) {
  if (t.i === 0) continue; // stop 0 is what @theme already declares
  css += `[data-theme="${t.i}"] {\n${vars(t.dark, "  ")}\n`;
  css += `  --color-mark: ${t.dark.accent};\n  --color-solid: ${t.dark.accent};\n  --color-edge: ${t.dark.accent};\n`;
  css += `  --color-on-mark: ${t.dark.ground};\n}\n`;
  css += `[data-theme="${t.i}"] .plate {\n${vars(t.plate, "  ")}\n`;
  css += `  --color-edge: ${t.plate.accent};\n  --color-on-mark: ${t.dark.ground};\n}\n\n`;
}
writeFileSync(new URL("../src/app/themes.css", import.meta.url), css);

const names = themes.map((t) => t.name);
writeFileSync(
  new URL("../src/lib/themes.ts", import.meta.url),
  `/* Generated by scripts/themes.mjs. Do not edit by hand. */\n` +
  `export const THEME_NAMES = ${JSON.stringify(names)} as const;\n` +
  `export const THEME_GROUNDS = ${JSON.stringify(themes.map((t) => t.dark.ground))} as const;\n` +
  `export const THEME_COUNT = ${STOPS};\n`
);
console.log("wrote src/app/themes.css and src/lib/themes.ts");
