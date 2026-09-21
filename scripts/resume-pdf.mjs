/**
 * Print scripts/resume/resume.html to public/dustin-reed-resume.pdf.
 *
 *     npm run resume
 *
 * The résumé used to exist only as a PDF exported from outside the repo, so
 * changing a date meant finding whatever produced it. The HTML is the source
 * now and this is the export step, which makes the PDF a build artifact that
 * happens to be committed - the same arrangement as the generated favicons.
 *
 * Chrome does the printing, the same browser scripts/check-behaviour.mjs
 * drives, for the same reason: playwright-core ships no browser of its own,
 * and the one already installed prints the fonts and the layout the way a
 * reader's browser would.
 */
import { chromium } from "playwright-core";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const SOURCE = resolve(here, "resume/resume.html");
const OUT = resolve(here, "../public/dustin-reed-resume.pdf");

const CHROME = [
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
].find((p) => existsSync(p));

if (!CHROME) {
  console.error("no Chrome found - install Google Chrome and run this again");
  process.exit(1);
}

const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const page = await browser.newPage();

/* file:// so the @font-face rules can reach ../../src/fonts. */
await page.goto(`file://${SOURCE}`, { waitUntil: "load" });
/* The fonts are font-display: block, so a page that has not finished
   loading them prints blank text rather than fallback text. */
await page.evaluate(() => document.fonts.ready);

await page.pdf({
  path: OUT,
  format: "Letter",
  printBackground: true,
  /* The page boxes carry their own padding; a printer margin on top of it
     would shrink the layout and push the second page onto a third. */
  margin: { top: "0", right: "0", bottom: "0", left: "0" },
});

await browser.close();
console.log(`wrote ${OUT}`);
