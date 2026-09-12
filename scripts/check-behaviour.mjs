/**
 * Drive the site in a real browser and refuse to pass if a fixed bug is back.
 *
 * Every assertion here was a defect that shipped. None of them are caught by
 * eslint or by `next build`, because none of them are type errors or broken
 * imports - they are a touch toggle that latched on, a modal that let Tab
 * walk out of it, a stylesheet that took the native cursor away with nothing
 * drawing a replacement. All of those compile perfectly.
 *
 * Companion to themes.mjs --check, which does the same job for contrast. That
 * one is pure arithmetic so it can gate the build; this one needs a server and
 * a browser, so it is a separate command you run by hand or in CI.
 *
 * Deliberately not here: performance numbers, which drift with the network and
 * would make this flaky, and anything that has never been seen to fail. An
 * assertion whose failure mode is unknown is decoration.
 *
 *   npm run check
 */
import { chromium } from "playwright-core";
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";

const ORIGIN = process.env.CHECK_ORIGIN ?? "http://localhost:3000";

/* Chrome, wherever it happens to live. playwright-core ships no browser of its
   own - that is the point of it, and the cost is having to find one. */
const CHROME = [
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
].find((p) => existsSync(p));

const fails = [];
const passes = [];
const check = (name, ok, detail = "") => {
  (ok ? passes : fails).push(detail ? `${name} — ${detail}` : name);
  console.log(`  ${ok ? "ok  " : "FAIL"}  ${name}${detail && !ok ? `  (${detail})` : ""}`);
};

/* Start a dev server only if nothing is already answering. Requiring the
   caller to have one running is how a check gets ignored. */
async function serverUp() {
  try {
    const r = await fetch(ORIGIN, { signal: AbortSignal.timeout(2500) });
    return r.ok;
  } catch {
    return false;
  }
}

async function withServer(run) {
  if (await serverUp()) {
    console.log(`using the server already on ${ORIGIN}\n`);
    return run();
  }
  console.log("starting next dev…");
  const dev = spawn("npx", ["next", "dev"], { stdio: "ignore", detached: true });
  try {
    for (let i = 0; i < 60; i++) {
      if (await serverUp()) break;
      await new Promise((r) => setTimeout(r, 500));
      if (i === 59) throw new Error("dev server never came up");
    }
    console.log(`server ready on ${ORIGIN}\n`);
    return await run();
  } finally {
    try {
      process.kill(-dev.pid);
    } catch {
      /* already gone */
    }
  }
}

const DESKTOP = { viewport: { width: 1440, height: 900 } };
const PHONE = { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true };

await withServer(async () => {
  if (!CHROME) {
    console.error(
      "No Chrome or Chromium found. Install Google Chrome, or point this at one\n" +
        "by editing the CHROME list in scripts/check-behaviour.mjs.",
    );
    process.exit(1);
  }
  const browser = await chromium.launch({ executablePath: CHROME, headless: true });
  const page = async (opts) => (await browser.newContext(opts)).newPage();
  const settle = (p, ms = 1000) => p.waitForTimeout(ms);

  /* ---- stickers ------------------------------------------------------
     Tapping one used to latch it on for good: pointerleave fires before
     click on touch, so the wrapper's hide() cleared the flag and the click
     toggled it straight back to true. And four could stack over the prose. */
  {
    const p = await page(PHONE);
    await p.goto(ORIGIN, { waitUntil: "networkidle" });
    await settle(p);
    const shown = () =>
      p.evaluate(() => {
        const b = [...document.querySelectorAll("button")].find((x) =>
          /Puerto Rico/.test(x.textContent),
        );
        const card = b?.parentElement.querySelector("span[aria-hidden]");
        return card ? getComputedStyle(card).visibility : "missing";
      });
    const trigger = p.locator('button:has-text("Puerto Rico")').first();
    await trigger.scrollIntoViewIfNeeded();
    await trigger.tap();
    await settle(p, 700);
    const afterFirst = await shown();
    await trigger.tap();
    await settle(p, 700);
    const afterSecond = await shown();
    check("sticker: a tap shows it", afterFirst === "visible", `got ${afterFirst}`);
    check("sticker: a second tap hides it", afterSecond === "hidden", `got ${afterSecond}`);
    await p.close();
  }

  {
    const p = await page(PHONE);
    await p.goto(`${ORIGIN}/about`, { waitUntil: "networkidle" });
    await settle(p, 1800);
    const open = () => p.evaluate(() => document.querySelectorAll('button[data-on="true"]').length);
    let most = 0;
    for (const name of ["Mid century houses", "Eames pieces", "Michael Jordan"]) {
      const t = p.locator(`button:text-is("${name}")`).first();
      if (!(await t.count())) continue;
      await t.scrollIntoViewIfNeeded();
      await t.tap({ force: true });
      await settle(p, 450);
      most = Math.max(most, await open());
    }
    check("sticker: never more than one open", most <= 1, `saw ${most} at once`);
    await p.close();
  }

  /* ---- command palette -----------------------------------------------
     aria-modal was asserted while Tab walked straight out onto the links
     behind the scrim, and Escape was bound to the input alone, so one Tab
     left a keyboard user with no way to dismiss it. */
  {
    const p = await page(DESKTOP);
    await p.goto(ORIGIN, { waitUntil: "networkidle" });
    await settle(p);
    await p.keyboard.press("Meta+k");
    await settle(p, 700);
    const opened = await p.evaluate(() => !!document.querySelector('[role="dialog"]'));
    for (let i = 0; i < 40; i++) await p.keyboard.press("Tab");
    const inside = await p.evaluate(
      () => !!document.activeElement?.closest('[role="dialog"]'),
    );
    await p.keyboard.press("Escape");
    await settle(p, 500);
    const closed = await p.evaluate(() => !document.querySelector('[role="dialog"]'));
    check("palette: opens on ⌘K", opened);
    check("palette: focus stays inside after 40 tabs", inside);
    check("palette: escape closes it from anywhere inside", closed);
    await p.close();
  }

  /* ---- the rail ------------------------------------------------------
     Closed, it sat off-screen but kept nine focusable descendants in the
     tab order, with no focus ring anywhere on screen. */
  {
    const p = await page(PHONE);
    await p.goto(ORIGIN, { waitUntil: "networkidle" });
    await settle(p, 1200);
    const r = await p.evaluate(() => {
      const a = document.querySelector("aside");
      return {
        offscreen: a.getBoundingClientRect().right <= 0,
        inert: a.hasAttribute("inert"),
      };
    });
    check("rail: closed on a phone and off-screen", r.offscreen);
    check("rail: closed means inert", r.inert);
    await p.close();
  }

  /* ---- the drawn cursor ----------------------------------------------
     The worst one. globals.css took the native cursor away unconditionally
     while a React component drew the replacement, so blocked or slow JS
     left a desktop visitor with an invisible pointer site-wide. */
  {
    const ctx = await browser.newContext({ ...DESKTOP, javaScriptEnabled: false });
    const p = await ctx.newPage();
    await p.goto(ORIGIN, { waitUntil: "domcontentloaded" });
    const html = await p.content();
    check("cursor: no-JS ships no glyphs", !/cnt-cursor__svg/.test(html));
    check(
      "cursor: no-JS sets no drawn-cursor flag",
      !/data-drawn-cursor=/.test(html),
      "the flag was in the server markup",
    );
    await ctx.close();
  }

  /* The assertion that actually guards the bug, and the reason the two above
     are not enough on their own: with the suppression ungated, both of them
     still pass. Neither the flag nor the glyphs appear without JS either way
     - the component simply never runs - while `cursor: none` applies from the
     stylesheet regardless and the pointer vanishes anyway.

     So check the invariant instead: every rule that takes the cursor away
     must be scoped to the flag the component sets once it is drawing. */
  {
    const p = await page(DESKTOP);
    await p.goto(ORIGIN, { waitUntil: "networkidle" });
    const ungated = await p.evaluate(() => {
      const bad = [];
      const walk = (rules) => {
        for (const r of rules) {
          if (r.cssRules) walk(r.cssRules);
          if (!r.style || !r.selectorText) continue;
          if (r.style.getPropertyValue("cursor") !== "none") continue;
          if (!r.selectorText.includes("data-drawn-cursor")) bad.push(r.selectorText);
        }
      };
      for (const sheet of document.styleSheets) {
        try {
          walk(sheet.cssRules);
        } catch {
          /* a cross-origin sheet cannot be read; none of ours are */
        }
      }
      return bad;
    });
    check(
      "cursor: every cursor:none rule is gated on the drawn flag",
      ungated.length === 0,
      ungated.length ? `ungated: ${ungated.join(", ")}` : "",
    );
    await p.close();
  }

  {
    const p = await page(PHONE);
    await p.goto(ORIGIN, { waitUntil: "networkidle" });
    await settle(p);
    const n = await p.evaluate(() => document.querySelectorAll(".cnt-cursor__svg").length);
    check("cursor: touch renders nothing", n === 0, `${n} glyphs on a phone`);
    await p.close();
  }

  {
    const p = await page(DESKTOP);
    await p.goto(ORIGIN, { waitUntil: "networkidle" });
    await p.evaluate(() => localStorage.clear());
    await p.reload({ waitUntil: "networkidle" });
    await settle(p);
    const state = () =>
      p.evaluate(() => ({
        attr: document.documentElement.dataset.drawnCursor ?? null,
        cursor: getComputedStyle(document.body).cursor,
      }));
    const on = await state();
    check("cursor: draws on a fine pointer", on.attr === "true" && on.cursor === "none");

    const glyph = () => p.evaluate(() => document.querySelector(".cnt-cursor")?.dataset.state);
    const a = p.locator('a[href*="curbnturf.com"]').first();
    await a.scrollIntoViewIfNeeded();
    await a.hover();
    await settle(p, 400);
    const overLink = await glyph();
    await p.locator("h1").first().hover();
    await settle(p, 400);
    const overText = await glyph();
    check("cursor: link state over a link", overLink === "link", `got ${overLink}`);
    check("cursor: default over prose", overText === "default", `got ${overText}`);

    /* The off switch. Drawing the pointer overrides OS settings - enlarged,
       high-contrast, shake-to-locate - none of which are readable here. */
    const toggle = async () => {
      await p.keyboard.press("?");
      await settle(p, 500);
      await p.locator('[role="dialog"] button[aria-label*="drawn cursor"]').click();
      await settle(p, 700);
    };
    await toggle();
    const off = await state();
    check("cursor: the off switch restores the native pointer", off.attr === null && off.cursor !== "none");
    await p.reload({ waitUntil: "networkidle" });
    await settle(p);
    const persisted = await state();
    check("cursor: off survives a reload", persisted.attr === null);
    await toggle();
    const backOn = await state();
    check("cursor: it can be turned back on", backOn.attr === "true");
    await p.close();
  }

  await browser.close();
});

console.log();
if (fails.length) {
  console.error(`${fails.length} of ${fails.length + passes.length} checks FAILED:`);
  for (const f of fails) console.error("  " + f);
  process.exit(1);
}
console.log(`all ${passes.length} behaviour checks pass`);
