"use client";

import { useEffect, useState } from "react";

/**
 * TEMPORARY. A palette switcher so the yellow can be judged against the
 * orange it would replace, on the real pages, at real sizes.
 *
 * Delete this file, its import in layout.tsx and the losing blocks in
 * globals.css once the call is made.
 */

const SCHEMES = [
  { id: "mark", name: "Yellow", note: "highlighter as a ground, ink as accent" },
  { id: "mustard", name: "Mustard", note: "yellow as accent text, darkened to pass" },
  { id: "orange", name: "Orange", note: "what ships today" },
] as const;

type Scheme = (typeof SCHEMES)[number]["id"];

export default function AccentSwitch() {
  const [scheme, setScheme] = useState<Scheme>("mark");
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const saved = window.localStorage.getItem("accent") as Scheme | null;
    if (saved && SCHEMES.some((s) => s.id === saved)) setScheme(saved);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.accent = scheme;
    window.localStorage.setItem("accent", scheme);
  }, [scheme]);

  // "y" cycles, so you can flip while reading without reaching for the mouse.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const el = e.target as HTMLElement | null;
      if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA")) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "y" || e.key === "Y") {
        setScheme((s) => {
          const i = SCHEMES.findIndex((x) => x.id === s);
          return SCHEMES[(i + 1) % SCHEMES.length].id;
        });
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const current = SCHEMES.find((s) => s.id === scheme)!;

  if (!open) return null;

  return (
    <div className="fixed bottom-4 left-4 z-[60] border border-ink bg-paper p-2 shadow-[4px_4px_0_0_var(--color-ink)]">
      <div className="flex items-center gap-1">
        {SCHEMES.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setScheme(s.id)}
            aria-pressed={scheme === s.id}
            className={`label min-h-11 px-3 ${
              scheme === s.id
                ? "bg-ink text-cream"
                : "text-mute hover:text-ink"
            }`}
          >
            {s.name}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Hide the palette switcher"
          className="label min-h-11 px-2 text-mute hover:text-ink"
        >
          &times;
        </button>
      </div>
      <p className="label mt-1 px-3 text-mute">
        {current.note} &middot; press Y
      </p>
    </div>
  );
}
