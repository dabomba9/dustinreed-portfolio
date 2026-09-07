"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { gsap, EASE, T, dur } from "@/lib/motion";
import Link from "next/link";
import type { CaseStudy } from "@/content/projects";

/**
 * Index on the left, detail on the right. Hovering or focusing a row swaps
 * the detail pane instead of floating a card over the list, so nothing is
 * ever occluded and the whole thing behaves like a product view.
 * Below lg the pane is dropped and each row carries its own blurb.
 */
export default function WorkIndex({ studies }: { studies: CaseStudy[] }) {
  const [activeSlug, setActiveSlug] = useState(studies[0]?.slug);
  const active = studies.find((s) => s.slug === activeSlug) ?? studies[0];
  const paneRef = useRef<HTMLDivElement>(null);
  const firstPaint = useRef(true);

  /* The pane is one surface whose contents change, not two panes swapping.
     A short rise plus fade reads as that; an instant replace does not. */
  useLayoutEffect(() => {
    if (firstPaint.current) {
      firstPaint.current = false;
      return;
    }
    const el = paneRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: dur(T.swap), ease: EASE.out }
      );
    }, el);
    return () => ctx.revert();
  }, [activeSlug]);

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_20rem] lg:gap-14">
      <ul className="border-t border-ink">
        {studies.map((study) => {
          const on = study.slug === active?.slug;
          return (
            <li key={study.slug} className="border-b border-rule">
              <Link
                href={`/work/${study.slug}`}
                onMouseEnter={() => setActiveSlug(study.slug)}
                onFocus={() => setActiveSlug(study.slug)}
                className="group grid grid-cols-[2.5rem_1fr] items-baseline gap-x-4 gap-y-2 py-7 no-underline md:grid-cols-[3rem_1fr_auto] md:gap-x-8 md:py-8"
              >
                <span
                  className={`label transition-colors ${
                    on ? "text-flame" : "text-mute"
                  }`}
                >
                  {study.number}
                </span>

                <span>
                  <span className="label block text-mute">{study.client}</span>
                  <span className="mt-2 block font-display text-xl font-bold leading-tight tracking-tight text-ink transition-colors group-hover:text-flame md:text-[1.65rem]">
                    {study.title}
                  </span>
                  <span className="mt-3 block max-w-md text-[0.95rem] leading-relaxed text-soft lg:hidden">
                    {study.blurb}
                  </span>
                </span>

                <span
                  aria-hidden
                  className={`label hidden self-center transition-all md:block ${
                    on ? "translate-x-1 text-flame" : "text-mute"
                  }`}
                >
                  &rarr;
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Detail pane. Decorative: everything in it is reachable from the row. */}
      <div aria-hidden className="hidden lg:block">
        {active ? (
          <div className="sticky top-10">
            <div key={active.slug} ref={paneRef}>
              {active.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={active.image}
                  alt=""
                  className="aspect-[4/3] w-full border border-rule bg-paper object-cover"
                />
              ) : (
                <div className="flex aspect-[4/3] w-full items-center justify-center border border-dashed border-rule bg-paper px-5">
                  <span className="label text-center text-mute">{active.imageAlt}</span>
                </div>
              )}

              <p className="mt-5 text-[0.95rem] leading-relaxed text-soft">
                {active.blurb}
              </p>

              <ul className="mt-5 space-y-1.5">
                {active.facts.map((fact) => (
                  <li key={fact} className="label flex gap-2.5 text-mute">
                    <span aria-hidden className="mt-[0.55em] h-px w-3 shrink-0 bg-rule" />
                    {fact}
                  </li>
                ))}
              </ul>

              {active.live ? (
                <p className="label mt-5 text-mute">{active.live.label}</p>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
