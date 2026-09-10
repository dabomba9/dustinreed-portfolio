"use client";

import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { THEME_NAMES, THEME_COUNT, THEME_GROUNDS } from "@/lib/themes";

/**
 * Two controls: the hue the site is drawn in, and whether its layout shows.
 *
 * Both write to <html> and to localStorage, and both are read back by the
 * inline script in layout.tsx before first paint - so a choice survives a
 * navigation without the default flashing past first.
 *
 * The slider is a real <input type="range">, which means arrow keys, Home
 * and End work without a line of code. Its value is a number, so it carries
 * aria-valuetext as well: a screen reader should say "Cobalt", not "7".
 *
 * Nothing here transitions. Putting a colour transition on the tokens would
 * animate every element on the page at once on every step of a drag, which
 * is a lot of paint for an effect nobody asked for.
 */
/* useLayoutEffect warns when it runs on the server, where it does nothing. */
const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

export default function Appearance() {
  const [theme, setTheme] = useState(0);
  const [grid, setGrid] = useState(false);

  /* Put the choice back on <html> after hydration, and read it from storage
     rather than from the element.
     
     React reconciles <html> against what the server rendered, and the server
     rendered no data-theme - so hydration DELETES the attribute the inline
     script set, and the reader watches their theme evaporate the instant the
     page becomes interactive. Measured on the built site: data-theme is "7"
     at readystate interactive, at DOMContentLoaded and at complete, and gone
     a tick later. suppressHydrationWarning does not prevent this; it only
     silences the console about it.
     
     A layout effect is the fix rather than a plain effect because React runs
     layout effects synchronously after commit and before the browser paints.
     The delete and this re-apply therefore land in the same frame, so there
     is nothing to see. A useEffect here would run after a paint, which is
     exactly the flash the inline script exists to prevent. */
  useIsoLayoutEffect(() => {
    let stored = 0;
    let wantsGrid = false;
    try {
      stored = Number(localStorage.getItem("dr-theme") ?? 0) || 0;
      wantsGrid = localStorage.getItem("dr-grid") === "1";
    } catch {}
    if (stored < 0 || stored >= THEME_COUNT) stored = 0;

    const el = document.documentElement;
    if (stored === 0) delete el.dataset.theme;
    else el.dataset.theme = String(stored);
    if (wantsGrid) el.dataset.grid = "1";
    else delete el.dataset.grid;

    setTheme(stored);
    setGrid(wantsGrid);
  }, []);

  const applyTheme = useCallback((next: number) => {
    setTheme(next);
    const el = document.documentElement;
    if (next === 0) delete el.dataset.theme;
    else el.dataset.theme = String(next);
    try {
      localStorage.setItem("dr-theme", String(next));
    } catch {}
    /* The browser chrome should follow the page. Without this the address
       bar on a phone stays the green of a theme the reader moved off. */
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", THEME_GROUNDS[next] ?? THEME_GROUNDS[0]);
  }, []);

  const toggleGrid = useCallback(() => {
    setGrid((was) => {
      const next = !was;
      const el = document.documentElement;
      if (next) el.dataset.grid = "1";
      else delete el.dataset.grid;
      try {
        localStorage.setItem("dr-grid", next ? "1" : "0");
      } catch {}
      return next;
    });
  }, []);

  return (
    <div className="flex items-center gap-3 px-3 py-3">
      <div className="flex min-w-0 flex-1 items-center gap-2.5">
        <svg
          aria-hidden
          viewBox="0 0 32 32"
          className="h-4 w-4 shrink-0 text-mute"
          fill="currentColor"
        >
          <path d="M17 2h-2v6h2V2zm-1 8c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm-1 10h2v-6h-2v6zM11.05 9.64 6.81 5.39 5.39 6.81l4.24 4.24 1.42-1.41zm9.9 12.73 4.24 4.24 1.41-1.41-4.24-4.24-1.41 1.41zM8 15H2v2h6v-2zm16 0v2h6v-2h-6zM5.39 25.19l1.42 1.42 4.24-4.24-1.41-1.42-4.25 4.24zM26.61 6.81l-1.42-1.42-4.24 4.24 1.41 1.42 4.25-4.24z" />
        </svg>

        <label className="sr-only" htmlFor="hue">
          Colour
        </label>
        <input
          id="hue"
          type="range"
          min={0}
          max={THEME_COUNT - 1}
          step={1}
          value={theme}
          onChange={(e) => applyTheme(Number(e.target.value))}
          aria-valuetext={THEME_NAMES[theme]}
          className="hue-slider min-w-0 flex-1"
        />
      </div>

      <button
        type="button"
        onClick={toggleGrid}
        aria-pressed={grid}
        aria-label="Layout guides"
        title="Layout guides"
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border transition-colors ${
          grid
            ? "border-edge bg-edge/15 text-accent"
            : "border-rule text-mute hover:border-control hover:text-type"
        }`}
      >
        <svg aria-hidden viewBox="0 0 32 32" className="h-4 w-4" fill="currentColor">
          <path d="M5 28h2V4H5v24zm5 0h2V4h-2v24zm5 0h2V4h-2v24zm5 0h2V4h-2v24zm5-24v24h2V4h-2z" />
        </svg>
      </button>
    </div>
  );
}
