"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap, EASE, T, dur } from "@/lib/motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import CommandPalette from "@/components/command-palette";
import { pages, caseOrder } from "@/content/nav";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [railOpen, setRailOpen] = useState(false);
  /* Tagged with the path it came from, so a stale value from the previous
     page is simply ignored rather than cleared by an effect. */
  const [spy, setSpy] = useState<{ path: string; id: string } | null>(null);
  const [progress, setProgress] = useState(0);
  const lastPct = useRef(0);
  const railListRef = useRef<HTMLUListElement>(null);
  const railMarkRef = useRef<HTMLSpanElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const current = pages.find((p) => p.href === pathname);

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

      if (e.key === "/") {
        e.preventDefault();
        setPaletteOpen(true);
      } else if (e.key === "?") {
        e.preventDefault();
        setShortcutsOpen((v) => !v);
      } else if (e.key === "Escape") {
        setShortcutsOpen(false);
        setRailOpen(false);
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
  }, [paletteOpen, step, router]);

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
      <nav
        aria-label="Mobile"
        className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-rule bg-cream/90 px-2 backdrop-blur-md lg:hidden"
      >
        <button
          onClick={() => setRailOpen((v) => !v)}
          className="label flex min-h-11 min-w-11 items-center gap-2 px-3 text-ink"
          aria-expanded={railOpen}
        >
          <span aria-hidden>{railOpen ? "\u00d7" : "\u2261"}</span> Index
        </button>
        <Link href="/" className="label flex min-h-11 items-center px-3 text-ink no-underline">
          Dustin Reed
        </Link>
        <button
          onClick={() => setPaletteOpen(true)}
          className="label flex min-h-11 min-w-11 items-center justify-center px-3 text-flame"
        >
          Search
        </button>
      </nav>

      {/* ---- rail ---- */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 flex w-[17rem] flex-col border-r border-rule bg-cream transition-transform duration-200 lg:translate-x-0 ${
          railOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-rule px-6 py-6">
          <Link href="/" className="block no-underline">
            <p className="font-display text-base font-extrabold tracking-tight text-ink">
              Dustin Reed
            </p>
            <p className="label mt-1.5 text-mute">Designer · San Juan, PR</p>
          </Link>
          <button
            onClick={() => setRailOpen(false)}
            className="label -mr-2 -mt-2 flex min-h-11 min-w-11 shrink-0 items-center justify-center text-lg text-mute lg:hidden"
            aria-label="Close index"
          >
            ×
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-5">
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
                  className="pointer-events-none absolute left-3 top-0 h-px w-5 bg-flame opacity-0"
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
                          on ? "text-flame" : "text-mute hover:text-ink"
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
            className="flex w-full items-center justify-between border border-rule bg-paper px-3 py-2.5 text-left transition-colors hover:border-flame"
          >
            <span className="label text-mute">Search</span>
            <kbd className="label hidden border border-rule px-1.5 py-0.5 text-mute lg:block">⌘K</kbd>
          </button>
          <a
            href="mailto:dr33d9@gmail.com"
            className="label mt-2 block border border-ink bg-ink px-3 py-2.5 text-center text-cream no-underline transition-colors hover:border-flame hover:bg-flame"
          >
            Email
          </a>
        </div>
      </aside>

      {railOpen ? (
        <button
          aria-label="Close index"
          onClick={() => setRailOpen(false)}
          className="fixed inset-0 z-20 bg-ink/25 lg:hidden"
        />
      ) : null}

      {/* ---- content ---- */}
      <div className="lg:pl-[17rem]">
        <main id="main" key={pathname} className="page-in min-h-screen pb-24">
          {children}
        </main>
      </div>

      {/* ---- status bar ---- */}
      <section
        aria-label="Reading progress"
        className="fixed inset-x-0 bottom-0 z-20 border-t border-rule bg-cream/90 backdrop-blur-md lg:pl-[17rem]"
      >
        <div
          ref={progressRef}
          aria-hidden
          className="h-px w-full origin-left bg-flame"
          style={{ transform: "scaleX(0)" }}
        />
        <div className="flex h-9 items-center gap-4 px-5 lg:px-8">
          <span className="label shrink-0 text-ink">
            {pathname === "/" ? "~/index" : `~${pathname}`}
          </span>
          {activeTitle ? (
            <span className="label truncate text-mute">§ {activeTitle}</span>
          ) : null}
          <span className="label ml-auto shrink-0 text-mute">{progress}%</span>
          <button
            onClick={() => setShortcutsOpen(true)}
            className="label hidden shrink-0 text-mute transition-colors hover:text-flame sm:block"
          >
            ? shortcuts
          </button>
        </div>
      </section>

      {paletteOpen ? <CommandPalette onClose={() => setPaletteOpen(false)} /> : null}
      {shortcutsOpen ? <Shortcuts onClose={() => setShortcutsOpen(false)} /> : null}
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
        active ? "bg-ink text-cream" : "text-soft hover:bg-paper hover:text-ink"
      }`}
    >
      <span className={`label shrink-0 ${active ? "text-cream" : "text-flame"}`}>
        {number}
      </span>
      <span className="truncate text-[0.9rem]">{label}</span>
    </Link>
  );
}

function Shortcuts({ onClose }: { onClose: () => void }) {
  const rows = [
    { keys: "⌘K", label: "Open the command palette" },
    { keys: "/", label: "Search" },
    { keys: "j", label: "Next case study" },
    { keys: "k", label: "Previous case study" },
    { keys: "g", label: "Go to the index" },
    { keys: "?", label: "This panel" },
    { keys: "esc", label: "Close" },
  ];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <button
        aria-label="Close"
        className="absolute inset-0 cursor-default bg-ink/25 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div className="palette-in relative w-full max-w-sm border border-ink bg-paper p-6 shadow-[0_24px_70px_-20px_rgba(22,25,27,0.45)]">
        <p className="label text-flame">Keyboard</p>
        <ul className="mt-5 space-y-2.5">
          {rows.map((r) => (
            <li key={r.keys} className="flex items-center justify-between gap-6">
              <span className="text-[0.9rem] text-soft">{r.label}</span>
              <kbd className="label shrink-0 border border-rule px-2 py-1 text-ink">
                {r.keys}
              </kbd>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
