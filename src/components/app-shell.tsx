"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { gsap, EASE, T, dur } from "@/lib/motion";
import PuertoRico from "@/components/puerto-rico";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import CommandPalette from "@/components/command-palette";
import { pages, caseOrder } from "@/content/nav";
import { shortcutsPref, cursorPref } from "@/lib/preference";

/** Whether the rail is docked rather than a drawer. Matches `lg:` in the
    class list; false on the server, which is the safe answer - a drawer
    that is inert until proven otherwise never traps anyone. */
function useIsDesktop(): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia("(min-width: 1024px)");
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia("(min-width: 1024px)").matches,
    () => false,
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [railOpen, setRailOpen] = useState(false);
  const isDesktop = useIsDesktop();
  /**
   * Single-character shortcuts need an off switch to satisfy WCAG 2.1.4.
   * They are the reason a speech-input user cannot dictate on this page
   * without being navigated away by a misheard syllable, and j/k/g collide
   * with NVDA and JAWS quick-navigation keys in browse mode.
   *
   * Default on, because they are the point of the site; remembered, because
   * a preference you have to set on every page is not a preference. Read
   * after mount so the server and the first client render agree.
   */
  const shortcutsOn = useSyncExternalStore(shortcutsPref.subscribe, shortcutsPref.read, () => true);
  const toggleShortcuts = useCallback(() => shortcutsPref.write(!shortcutsPref.read()), []);
  const cursorOn = useSyncExternalStore(cursorPref.subscribe, cursorPref.read, () => true);
  const toggleCursor = useCallback(() => cursorPref.write(!cursorPref.read()), []);
  /* Tagged with the path it came from, so a stale value from the previous
     page is simply ignored rather than cleared by an effect. */
  const [spy, setSpy] = useState<{ path: string; id: string } | null>(null);
  const [progress, setProgress] = useState(0);
  const lastPct = useRef(0);
  const railListRef = useRef<HTMLUListElement>(null);
  const railMarkRef = useRef<HTMLSpanElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const current = pages.find((p) => p.href === pathname);
  /* Direction C hides the chrome on the landing page only. Everything below
     still renders, so the two directions differ by exactly one variable. */

  /* ---- keyboard ---------------------------------------------------- */
  const isTyping = () => {
    const el = document.activeElement;
    if (!el) return false;
    const tag = el.tagName.toLowerCase();
    return tag === "input" || tag === "textarea" || (el as HTMLElement).isContentEditable;
  };

  const step = useCallback(
    (dir: 1 | -1) => {
      const i = caseOrder.indexOf(pathname);
      if (i === -1) {
        router.push(caseOrder[dir === 1 ? 0 : caseOrder.length - 1]);
        return;
      }
      const next = (i + dir + caseOrder.length) % caseOrder.length;
      router.push(caseOrder[next]);
    },
    [pathname, router]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setShortcutsOpen(false);
        setPaletteOpen((v) => !v);
        return;
      }
      if (paletteOpen || isTyping()) return;

      /* Escape is not a single character and stays available even with the
         shortcuts switched off - it is how you get out of things. */
      if (e.key === "Escape") {
        setShortcutsOpen(false);
        setRailOpen(false);
        return;
      }

      /* WCAG 2.1.4 asks for one of: an off switch, remapping, or focus
         scoping. This is the off switch, and it is why the ? panel that
         documents these keys is also where you turn them off.

         Modifier chords belong to the browser and to assistive tech, not
         to us: Ctrl+J opens Downloads and Ctrl+G is Find Again, and both
         were being swallowed here. */
      if (!shortcutsOn) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      if (e.key === "/") {
        e.preventDefault();
        setPaletteOpen(true);
      } else if (e.key === "?") {
        e.preventDefault();
        setShortcutsOpen((v) => !v);
      } else if (e.key === "j") {
        e.preventDefault();
        step(1);
      } else if (e.key === "k") {
        e.preventDefault();
        step(-1);
      } else if (e.key === "g") {
        e.preventDefault();
        router.push("/");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [paletteOpen, shortcutsOn, step, router]);

  /* ---- scroll spy + progress --------------------------------------- */
  useEffect(() => {
    const headings = Array.from(
      document.querySelectorAll<HTMLElement>("h2[data-section]")
    );

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setSpy({ path: pathname, id: visible[0].target.id });
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
    );
    headings.forEach((h) => observer.observe(h));

    /* AppShell survives navigation, so this is the same DOM node every
       time and the effect re-runs on every pathname change. Without the
       kill in the cleanup below, each navigation left another live tween
       attached to the one progress bar. */
    const bar = progressRef.current;
    const setScale = bar
      ? gsap.quickTo(bar, "scaleX", { duration: dur(0.25), ease: "power2.out" })
      : null;
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0;
      if (setScale) setScale(pct / 100);
      // The numeric readout only needs whole percents, so it re-renders
      // ~100 times over a full page instead of on every scroll event.
      const rounded = Math.round(pct);
      if (rounded !== lastPct.current) {
        lastPct.current = rounded;
        setProgress(rounded);
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      if (bar) gsap.killTweensOf(bar);
    };
  }, [pathname]);

  const activeSection = spy && spy.path === pathname ? spy.id : null;
  useEffect(() => {
    const list = railListRef.current;
    const mark = railMarkRef.current;
    if (!list || !mark) return;
    if (!activeSection) {
      gsap.to(mark, { opacity: 0, duration: dur(0.15) });
      return;
    }
    const link = list.querySelector<HTMLElement>(`[data-rail="${activeSection}"]`);
    if (!link) return;
    const dash = link.firstElementChild as HTMLElement | null;
    const y = link.offsetTop + (dash ? dash.offsetTop - link.offsetTop : 10);
    gsap.to(mark, {
      y,
      opacity: 1,
      duration: dur(T.indicator),
      ease: EASE.out,
      overwrite: true,
    });
  }, [activeSection, pathname]);

  const activeTitle =
    current?.sections.find((s) => s.id === activeSection)?.title ?? null;

  return (
    <>
      {/* ---- mobile bar ---- */}
      {(
      <nav
        aria-label="Page header"
        className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-rule bg-ground/90 px-2 backdrop-blur-md lg:hidden"
      >
        <button
          onClick={() => setRailOpen((v) => !v)}
          className="label flex min-h-11 min-w-11 items-center gap-2 px-3 text-type"
          aria-expanded={railOpen}
          aria-controls="index-rail"
        >
          <span aria-hidden>{railOpen ? "\u00d7" : "\u2261"}</span> Index
        </button>
        <Link
          href="/"
          className="label flex min-h-11 items-center gap-2 px-3 text-type no-underline"
        >
          <Image
            src="/media/dustin-portrait-line.png"
            alt=""
            width={606}
            height={640}
            className="h-7 w-auto"
          />
          Dustin Reed
        </Link>
        <button
          onClick={() => setPaletteOpen(true)}
          className="label flex min-h-11 min-w-11 items-center justify-center px-3 text-accent"
        >
          Search
        </button>
      </nav>
      )}

      {/* ---- rail ---- */}
      {(
      <aside
        id="index-rail"
        aria-label="Index"
        /* Offscreen is not gone. Translated out of view the rail kept every
           one of its nine controls in the tab order and in the accessibility
           tree, so on a phone with the index closed you tabbed through a
           drawer you could not see, with no focus ring anywhere on screen.
           Only below lg, where it is actually hidden. */
        inert={!railOpen && !isDesktop}
        className={`fixed inset-y-0 left-0 z-30 flex w-[21rem] flex-col border-r border-rule bg-ground transition-transform duration-200 lg:translate-x-0 ${
          railOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Identity block. Two equal halves either side of a hairline: who,
            and where. Both columns are flex-1 basis-0 so they split the rail
            evenly rather than the face taking whatever it wants and the
            island living in the remainder.

            The role and the availability line sit full width underneath. In
            a 135px column "FOUNDING DESIGNER" wraps to four lines; across the
            whole rail it is one. Splitting the block this way is what lets
            the columns be equal without the type paying for it. */}
        <div className="border-b border-rule px-4 pb-5 pt-7">
          <div className="flex items-start justify-between gap-2">
            <Link
              href="/"
              className="group flex min-w-0 flex-1 items-end gap-4 no-underline"
            >
              <span className="flex min-w-0 flex-1 basis-0 flex-col items-center gap-3">
                <Image
                  src="/media/dustin-portrait-line.png"
                  alt=""
                  width={606}
                  height={640}
                  priority
                  className="w-full max-w-[9rem] transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:scale-[1.03]"
                />
                <span className="label -mr-[0.13em] text-center leading-none text-type">
                  Dustin Reed
                </span>
              </span>

              <span aria-hidden className="w-px shrink-0 self-stretch bg-rule" />

              <span className="flex min-w-0 flex-1 basis-0 flex-col items-center gap-3">
                <PuertoRico className="w-full max-w-[8rem] text-accent" />
                <span className="label -mr-[0.13em] whitespace-nowrap text-center leading-[1.5] text-mute">
                  San Juan,
                  <br />
                  Puerto Rico
                </span>
              </span>
            </Link>

            <button
              onClick={() => setRailOpen(false)}
              className="label -mr-2 -mt-3 flex min-h-11 min-w-11 shrink-0 items-center justify-center text-lg text-mute lg:hidden"
              aria-label="Close index"
            >
              ×
            </button>
          </div>

          <p className="label -mr-[0.13em] mt-5 border-t border-rule pt-4 text-center text-mute">
            Founding Designer &amp; Design Engineer
          </p>

          <p className="label mt-3 flex items-center justify-center gap-2 text-type">
            <span aria-hidden className="size-2 shrink-0 rounded-full bg-solid" />
            Open to work
          </p>
        </div>

        <nav aria-label="Work and site" className="flex-1 overflow-y-auto px-3 py-5">
          <p className="label px-3 pb-2 text-mute">Work</p>
          {pages
            .filter((p) => p.kind === "case")
            .map((p) => (
              <RailLink
                key={p.href}
                href={p.href}
                active={pathname === p.href}
                number={p.number}
                label={p.label}
                onNavigate={() => setRailOpen(false)}
              />
            ))}

          <p className="label px-3 pb-2 pt-6 text-mute">Site</p>
          <RailLink
            href="/"
            active={pathname === "/"}
            number="→"
            label="Index"
            onNavigate={() => setRailOpen(false)}
          />
          <RailLink
            href="/about"
            active={pathname === "/about"}
            number="→"
            label="About"
            onNavigate={() => setRailOpen(false)}
          />

          {current && current.sections.length > 0 ? (
            <>
              <p className="label px-3 pb-2 pt-8 text-mute">On this page</p>
              <ul ref={railListRef} className="relative space-y-px">
                <span
                  ref={railMarkRef}
                  aria-hidden
                  className="pointer-events-none absolute left-3 top-0 h-0.5 w-5 bg-edge opacity-0"
                />
                {current.sections.map((s) => {
                  const on = s.id === activeSection;
                  return (
                    <li key={s.id}>
                      <a
                        href={`#${s.id}`}
                        data-rail={s.id}
                        onClick={() => setRailOpen(false)}
                        className={`flex gap-2.5 px-3 py-1.5 text-[0.8rem] leading-snug no-underline transition-colors ${
                          on ? "text-accent" : "text-mute hover:text-type"
                        }`}
                      >
                        <span
                          aria-hidden
                          className={`mt-[0.55em] h-px w-3 shrink-0 transition-opacity ${
                            on ? "opacity-0" : "bg-rule opacity-100"
                          }`}
                        />
                        <span className="truncate">{s.title}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </>
          ) : null}
        </nav>

        <div className="border-t border-rule p-3">
          <button
            onClick={() => setPaletteOpen(true)}
            className="flex w-full items-center justify-between border border-control bg-raised px-3 py-2.5 text-left transition-colors hover:border-edge"
          >
            <span className="label text-mute">Search</span>
            <kbd className="label hidden border border-rule px-1.5 py-0.5 text-mute lg:block">⌘K</kbd>
          </button>
          <a
            href="mailto:dr33d9@gmail.com"
            className="plate label mt-2 block border border-type bg-ground px-3 py-2.5 text-center no-underline transition-colors hover:border-edge hover:bg-solid"
          >
            Email
          </a>
        </div>
      </aside>
      )}

      {railOpen ? (
        <button
          aria-label="Close index"
          onClick={() => setRailOpen(false)}
          className="fixed inset-0 z-20 bg-black/60 lg:hidden"
        />
      ) : null}

      {/* ---- content ---- */}
      <div className="lg:pl-[21rem]">
        <main id="main" key={pathname} className="page-in min-h-screen pb-24">
          {children}
        </main>
      </div>

      {/* ---- status bar ---- */}
      {(
      <section
        aria-label="Reading progress"
        className="fixed inset-x-0 bottom-0 z-20 border-t border-rule bg-ground/90 backdrop-blur-md lg:pl-[21rem]"
      >
        <div
          ref={progressRef}
          aria-hidden
          className="h-0.5 w-full origin-left bg-edge"
          style={{ transform: "scaleX(0)" }}
        />
        <div className="flex h-9 items-center gap-4 px-5 lg:px-8">
          <span className="label shrink-0 text-type">
            {pathname === "/" ? "~/index" : `~${pathname}`}
          </span>
          {activeTitle ? (
            <span className="label truncate text-mute">§ {activeTitle}</span>
          ) : null}
          <span className="label ml-auto shrink-0 text-mute">{progress}%</span>
          <button
            onClick={() => setShortcutsOpen(true)}
            className="label hidden h-9 shrink-0 items-center px-1 text-mute transition-colors hover:text-accent sm:flex"
          >
            ? shortcuts
          </button>
        </div>
      </section>
      )}

      {paletteOpen ? <CommandPalette onClose={() => setPaletteOpen(false)} /> : null}
      {shortcutsOpen ? (
        <Shortcuts
          onClose={() => setShortcutsOpen(false)}
          shortcutsOn={shortcutsOn}
          onToggle={toggleShortcuts}
          cursorOn={cursorOn}
          onToggleCursor={toggleCursor}
        />
      ) : null}
    </>
  );
}

function RailLink({
  href,
  active,
  number,
  label,
  onNavigate,
}: {
  href: string;
  active: boolean;
  number: string;
  label: string;
  onNavigate: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={`flex min-h-11 items-center gap-3 px-3 py-2 no-underline transition-colors ${
        active ? "plate bg-ground" : "text-soft hover:bg-raised hover:text-type"
      }`}
    >
      <span className={`label shrink-0 ${active ? "text-type" : "text-accent"}`}>
        {number}
      </span>
      <span className="truncate text-[0.9rem]">{label}</span>
    </Link>
  );
}

/**
 * The panel that documents the keyboard is also where the keyboard is
 * turned off. That is not a coincidence: WCAG 2.1.4 wants the off switch
 * discoverable, and the one place a reader has already gone looking for
 * these keys is the list of them.
 *
 * It was a modal in appearance only - no role, no name, no focus moved in,
 * nothing to return focus to. Opening it announced nothing at all, on the
 * one panel whose entire job is explaining access.
 */
function Shortcuts({
  onClose,
  shortcutsOn,
  onToggle,
  cursorOn,
  onToggleCursor,
}: {
  onClose: () => void;
  shortcutsOn: boolean;
  onToggle: () => void;
  cursorOn: boolean;
  onToggleCursor: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const restoreTo = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const node = panelRef.current;
    node?.addEventListener("keydown", onKey);
    return () => {
      node?.removeEventListener("keydown", onKey);
      restoreTo?.focus?.();
    };
  }, [onClose]);

  const rows = [
    { keys: "⌘K", label: "Open the command palette", always: true },
    { keys: "/", label: "Search", always: false },
    { keys: "j", label: "Next case study", always: false },
    { keys: "k", label: "Previous case study", always: false },
    { keys: "g", label: "Go to the index", always: false },
    { keys: "?", label: "This panel", always: false },
    { keys: "esc", label: "Close", always: true },
  ];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        aria-hidden
        className="absolute inset-0 cursor-default bg-black/60 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Keyboard shortcuts"
        tabIndex={-1}
        className="palette-in relative w-full max-w-sm border border-type bg-raised p-6 shadow-[0_24px_70px_-20px_rgba(22,25,27,0.45)] outline-none"
      >
        <p className="label text-accent">Keyboard</p>
        <ul className="mt-5 space-y-2.5">
          {rows.map((r) => (
            <li key={r.keys} className="flex items-center justify-between gap-6">
              <span
                className={`text-[0.9rem] ${
                  shortcutsOn || r.always ? "text-soft" : "text-mute line-through"
                }`}
              >
                {r.label}
              </span>
              <kbd className="label shrink-0 border border-rule px-2 py-1 text-type">
                {r.keys}
              </kbd>
            </li>
          ))}
        </ul>

        {/* Both switches exist for the same reason: the interface does
            something the reader may need to take back. Kept together so
            there is one place to look, and the panel that documents the
            behaviour is the panel that turns it off. */}
        <div className="mt-6 space-y-4 border-t border-rule pt-4">
          <div className="flex items-center justify-between gap-4">
            <span className="text-[0.9rem] text-soft">
              Single-key shortcuts
              <span className="label mt-1 block text-mute">
                {shortcutsOn ? "On" : "Off — ⌘K and esc still work"}
              </span>
            </span>
            <button
              type="button"
              onClick={onToggle}
              aria-pressed={shortcutsOn}
              /* Named in full. Both switches read "Turn off", and a button
                 list that offers the same word twice tells you nothing
                 about which is which. */
              aria-label={`${shortcutsOn ? "Turn off" : "Turn on"} single-key shortcuts`}
              className="label min-h-11 shrink-0 border border-edge px-3 text-type transition-colors hover:bg-raised"
            >
              {shortcutsOn ? "Turn off" : "Turn on"}
            </button>
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="text-[0.9rem] text-soft">
              Drawn cursor
              <span className="label mt-1 block text-mute">
                {cursorOn ? "On" : "Off — your system pointer is back"}
              </span>
            </span>
            <button
              type="button"
              onClick={onToggleCursor}
              aria-pressed={cursorOn}
              aria-label={`${cursorOn ? "Turn off" : "Turn on"} the drawn cursor`}
              className="label min-h-11 shrink-0 border border-edge px-3 text-type transition-colors hover:bg-raised"
            >
              {cursorOn ? "Turn off" : "Turn on"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
