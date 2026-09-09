"use client";

import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { gsap, EASE, T, dur } from "@/lib/motion";
import { useRouter } from "next/navigation";
import { pages } from "@/content/nav";
import { selectedWork, caseStudies } from "@/content/projects";

type Item = {
  id: string;
  group: string;
  title: string;
  /** Extra text the matcher sees but the row doesn't show. */
  search?: string;
  subtitle?: string;
  hint?: string;
  run: () => void;
  external?: boolean;
};

/** Subsequence match, the way every good palette works: "onbfarm" finds
    "Onboarding a farmer". Returns a score so better matches sort first. */
function fuzzy(query: string, text: string): number | null {
  if (!query) return 0;
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  let qi = 0;
  let score = 0;
  let streak = 0;
  let firstIndex = -1;
  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) {
      if (firstIndex < 0) firstIndex = ti;
      streak += 1;
      score += streak * 2;
      if (ti === 0 || t[ti - 1] === " ") score += 6;
      qi += 1;
    } else {
      streak = 0;
    }
  }
  if (qi < q.length) return null;
  return score - firstIndex * 0.2;
}

export default function CommandPalette({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const listId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  /* One state object: typing resets the cursor in the same update, so no
     effect has to reach in afterwards. The component is mounted only while
     the palette is open, so it always starts empty. */
  const [{ query, active }, setState] = useState({ query: "", active: 0 });
  const setQuery = (text: string) => setState({ query: text, active: 0 });
  const setActive = (fn: (a: number) => number) =>
    setState((s) => ({ ...s, active: fn(s.active) }));
  const listRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<HTMLDivElement>(null);

  const items = useMemo<Item[]>(() => {
    const out: Item[] = [];

    for (const page of pages) {
      const study = caseStudies.find((c) => `/work/${c.slug}` === page.href);
      out.push({
        id: `page:${page.href}`,
        group: page.kind === "case" ? "Case studies" : "Pages",
        title: page.kind === "case" ? `${page.number} — ${page.label}` : page.label,
        subtitle: study?.title,
        // The case study's own headline and blurb are the words people
        // actually remember, so the matcher sees them even though the
        // row shows the client name.
        search: study ? `${study.title} ${study.blurb} ${study.facts.join(" ")}` : undefined,
        hint: page.href,
        run: () => router.push(page.href),
      });
      for (const section of page.sections) {
        out.push({
          id: `sec:${page.href}#${section.id}`,
          group: `In ${page.label}`,
          title: section.title,
          hint: page.number,
          run: () => router.push(`${page.href}#${section.id}`),
        });
      }
    }

    for (const w of selectedWork) {
      out.push({
        id: `ext:${w.href}`,
        group: "Live sites",
        title: w.name,
        hint: w.href.replace(/^https?:\/\/(www\.)?/, ""),
        external: true,
        run: () => window.open(w.href, "_blank", "noreferrer"),
      });
    }

    out.push({
      id: "act:email",
      group: "Actions",
      title: "Email Dustin",
      hint: "dr33d9@gmail.com",
      run: () => {
        window.location.href = "mailto:dr33d9@gmail.com";
      },
    });
    out.push({
      id: "act:linkedin",
      group: "Actions",
      title: "Open LinkedIn",
      hint: "in/dreeddesign",
      external: true,
      run: () =>
        window.open("https://www.linkedin.com/in/dreeddesign/", "_blank", "noreferrer"),
    });
    out.push({
      id: "act:github",
      group: "Actions",
      title: "Open GitHub",
      hint: "dabomba9",
      external: true,
      run: () => window.open("https://github.com/dabomba9", "_blank", "noreferrer"),
    });

    return out;
  }, [router]);

  /* One derived value drives everything: the flat list (for keyboard
     position and the count) and the grouped list (for display). Grouping
     collects every item of a group together, not just adjacent ones. */
  const { flat, groups } = useMemo(() => {
    const matched = !query.trim()
      ? items.slice(0, 40)
      : items
          .map((item) => ({
            item,
            score: fuzzy(query.trim(), `${item.title} ${item.subtitle ?? ""} ${item.group} ${item.search ?? ""}`),
          }))
          .filter((r): r is { item: Item; score: number } => r.score !== null)
          .sort((a, b) => b.score - a.score)
          .slice(0, 40)
          .map((r) => r.item);

    const order: string[] = [];
    const byGroup = new Map<string, Item[]>();
    for (const item of matched) {
      if (!byGroup.has(item.group)) {
        byGroup.set(item.group, []);
        order.push(item.group);
      }
      byGroup.get(item.group)!.push(item);
    }

    const grouped = order.map((group) => ({ group, items: byGroup.get(group)! }));
    return { flat: grouped.flatMap((g) => g.items), groups: grouped };
  }, [items, query]);

  /**
   * A dialog owes the keyboard three things, and this had none of them.
   *
   *   trap     Tab used to walk out of an aria-modal dialog and onto the
   *            page behind the scrim, where the focus ring is invisible.
   *   escape   was bound to the input alone, so one Tab and there was no
   *            way out at all - the scrim is tabIndex={-1} and unreachable.
   *   restore  focus fell to <body> on close and the next Tab restarted
   *            from the top of the document.
   *
   * Handled here on the root rather than on the input, so it holds wherever
   * focus happens to be inside the panel.
   */
  useEffect(() => {
    /* Captured before the input is focused, not after - which is why the
       input is focused here rather than with autoFocus. autoFocus lands
       during commit, so by the time an effect runs the "previously focused
       element" is already the input, and closing would restore focus to a
       node that no longer exists. */
    const restoreTo = document.activeElement as HTMLElement | null;
    const root = rootRef.current;
    if (!root) return;
    inputRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const focusable = root.querySelectorAll<HTMLElement>(
        'input, button:not([tabindex="-1"]), [href], [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    root.addEventListener("keydown", onKey);
    return () => {
      root.removeEventListener("keydown", onKey);
      restoreTo?.focus?.();
    };
  }, [onClose]);

  /* Entrance. The panel is the object; the scrim is atmosphere behind it. */
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(scrimRef.current, { opacity: 0 }, { opacity: 1, duration: dur(0.16), ease: "none" });
      gsap.fromTo(
        panelRef.current,
        { opacity: 0, y: -10, scale: 0.985 },
        { opacity: 1, y: 0, scale: 1, duration: dur(T.panel), ease: EASE.out }
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  /* One indicator that travels, rather than a background flicking between rows. */
  useEffect(() => {
    const list = listRef.current;
    const marker = markerRef.current;
    if (!list || !marker) return;
    const el = list.querySelector<HTMLElement>('[data-active="true"]');
    if (!el) {
      gsap.to(marker, { opacity: 0, duration: dur(0.12) });
      return;
    }
    el.scrollIntoView({ block: "nearest" });
    const target = { y: el.offsetTop - list.scrollTop, h: el.offsetHeight };
    const first = gsap.getProperty(marker, "opacity") === 0;
    gsap.to(marker, {
      y: target.y,
      height: target.h,
      opacity: 1,
      duration: first ? dur(0.01) : dur(T.indicator),
      ease: EASE.out,
      overwrite: true,
    });
  }, [active, flat]);

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[12vh]"
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
    >
      {/* Not a button. A full-viewport "Close, button" is something iOS
          VoiceOver lands on while swiping, and Escape at the dialog level
          is the real affordance. */}
      <div
        ref={scrimRef}
        aria-hidden
        className="absolute inset-0 cursor-default bg-black/60 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <div
        ref={panelRef}
        className="relative w-full max-w-xl overflow-hidden border border-type bg-raised shadow-[0_24px_70px_-20px_rgba(22,25,27,0.45)]"
      >
        <div className="flex items-center gap-3 border-b border-rule px-4">
          <span className="label text-accent">&gt;</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown" || (e.key === "n" && e.ctrlKey)) {
                e.preventDefault();
                setActive((a) => Math.min(a + 1, flat.length - 1));
              } else if (e.key === "ArrowUp" || (e.key === "p" && e.ctrlKey)) {
                e.preventDefault();
                setActive((a) => Math.max(a - 1, 0));
              } else if (e.key === "Enter") {
                e.preventDefault();
                const item = flat[active];
                if (item) {
                  item.run();
                  onClose();
                }
              }
            }}
            placeholder="Search work, sections, sites"
            className="w-full bg-transparent py-4 font-mono text-sm text-type outline-none placeholder:text-mute"
            aria-label="Search"
            /* The arrow keys move a highlight, never DOM focus - so without
               these the row a reader is on is announced by nothing at all,
               and Enter navigates somewhere they were never told about. */
            role="combobox"
            aria-expanded="true"
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={flat[active] ? `${listId}-${active}` : undefined}
          />
          <kbd className="label shrink-0 border border-rule px-1.5 py-1 text-mute">esc</kbd>
        </div>

        <div
          ref={listRef}
          id={listId}
          role="listbox"
          aria-label="Results"
          className="relative max-h-[52vh] overflow-y-auto py-2"
        >
          <div
            ref={markerRef}
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 bg-edge opacity-0"
          />
          {flat.length === 0 ? (
            <p className="px-4 py-8 text-center font-mono text-sm text-mute">
              Nothing matches that.
            </p>
          ) : (
            groups.map((group) => (
              <div key={group.group} className="mb-1">
                <p className="label px-4 py-2 text-mute">{group.group}</p>
                {group.items.map((item) => {
                  const myIndex = flat.indexOf(item);
                  const isActive = myIndex === active;
                  return (
                    <button
                      key={item.id}
                      id={`${listId}-${myIndex}`}
                      role="option"
                      aria-selected={isActive}
                      /* The input keeps focus and drives the list through
                         aria-activedescendant, so rows are not tab stops -
                         that is what stops the visible highlight and the
                         real focus position from drifting apart. */
                      tabIndex={-1}
                      data-active={isActive}
                      onMouseMove={() => setActive(() => myIndex)}
                      onClick={() => {
                        item.run();
                        onClose();
                      }}
                      className={`relative flex w-full items-baseline justify-between gap-4 px-4 py-2.5 text-left transition-colors duration-150 ${
                        isActive ? "text-ground" : "text-type"
                      }`}
                    >
                      <span className="min-w-0 flex-1 truncate text-[0.9rem]">
                        {item.title}
                        {item.subtitle ? (
                          <span
                            className={
                              isActive ? "text-ground/75" : "text-mute"
                            }
                          >
                            {" · "}
                            {item.subtitle}
                          </span>
                        ) : null}
                        {item.external ? (
                          <span aria-hidden className="ml-1.5 opacity-60">
                            &#8599;
                          </span>
                        ) : null}
                      </span>
                      {item.hint ? (
                        <span
                          className={`shrink-0 font-mono text-[0.7rem] ${
                            isActive ? "text-ground/70" : "text-mute"
                          }`}
                        >
                          {item.hint}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        <div className="flex items-center gap-4 border-t border-rule px-4 py-2.5">
          <Hint keys="↑↓" label="navigate" />
          <Hint keys="↵" label="open" />
          <Hint keys="esc" label="close" />
          {/* Live, so typing reports what it found. Without this a reader
              filters the list and is told nothing changed. */}
          <span role="status" aria-live="polite" className="label ml-auto text-mute">
            {flat.length} results
          </span>
        </div>
      </div>
    </div>
  );
}

function Hint({ keys, label }: { keys: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <kbd className="label border border-rule px-1.5 py-0.5 text-mute">{keys}</kbd>
      <span className="label text-mute">{label}</span>
    </span>
  );
}
