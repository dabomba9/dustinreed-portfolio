"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap, EASE, T, dur, prefersReducedMotion } from "@/lib/motion";
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
  const videoRef = useRef<HTMLVideoElement>(null);
  const firstPaint = useRef(true);

  /* Play only the clip belonging to the row the pointer is on, and only once
     the reader has actually pointed at one. The first row is active on load,
     so playing on mount would pull a megabyte of video at every visitor
     whether they engaged with the index or not - preload="none" plus this is
     what keeps the homepage costing nothing until someone reaches for it.

     Never under reduced motion, where the poster is the whole story. React
     remounts the element on a slug change because of the key, so this
     restarts from the first frame each time. */
  const touched = useRef(false);
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !touched.current || prefersReducedMotion()) return;
    v.currentTime = 0;
    v.play().catch(() => {});
    return () => v.pause();
  }, [activeSlug]);

  function point(slug: string) {
    touched.current = true;
    setActiveSlug(slug);
  }

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
      <ul className="border-t border-type">
        {studies.map((study) => {
          const on = study.slug === active?.slug;
          return (
            <li key={study.slug} className="border-b border-rule">
              <Link
                href={`/work/${study.slug}`}
                onMouseEnter={() => point(study.slug)}
                onFocus={() => point(study.slug)}
                className="group grid grid-cols-[2.5rem_1fr] items-baseline gap-x-4 gap-y-2 py-7 no-underline md:grid-cols-[3rem_1fr_auto] md:gap-x-8 md:py-8"
              >
                <span
                  className={`label transition-colors ${
                    on ? "text-accent" : "text-mute"
                  }`}
                >
                  {study.number}
                </span>

                <span>
                  <span className="label block text-mute">{study.client}</span>
                  <span className="mt-2 block font-display text-xl font-bold leading-tight tracking-tight text-type transition-colors group-hover:text-accent md:text-[1.65rem]">
                    {study.title}
                  </span>
                  <span className="mt-3 block max-w-md text-[0.95rem] leading-relaxed text-soft lg:hidden">
                    {study.blurb}
                  </span>
                </span>

                <span
                  aria-hidden
                  className={`label hidden self-center transition-all md:block ${
                    on ? "translate-x-1 text-accent" : "text-mute"
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
              {active.clip ? (
                /* The still is the poster, so the pane never flashes empty
                   while the video loads. Muted, looping, inline; it only
                   exists for the row the pointer is already on. */
                <video
                  key={active.clip}
                  ref={videoRef}
                  poster={active.image}
                  muted
                  loop
                  playsInline
                  preload="none"
                  className="aspect-[4/3] w-full border border-rule bg-raised object-cover"
                >
                  <source src={`${active.clip}.webm`} type="video/webm" />
                  <source src={`${active.clip}.mp4`} type="video/mp4" />
                </video>
              ) : active.image ? (
                <Image
                  src={active.image}
                  alt=""
                  width={880}
                  height={660}
                  sizes="320px"
                  className="aspect-[4/3] w-full border border-rule bg-raised object-cover"
                />
              ) : (
                <div className="flex aspect-[4/3] w-full items-center justify-center border border-dashed border-rule bg-raised px-5">
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
