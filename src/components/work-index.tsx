"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import Image from "next/image";
import StickerFrame from "@/components/sticker-frame";
import { gsap, EASE, T, dur, prefersReducedMotion, prefersLightData } from "@/lib/motion";
import Link from "next/link";
import type { CaseStudy } from "@/content/projects";

/**
 * Index on the left, detail on the right. Hovering or focusing a row swaps
 * the detail pane instead of floating a card over the list, so nothing is
 * ever occluded and the whole thing behaves like a product view.
 *
 * Below lg the pane cannot follow a pointer that does not exist, so it is
 * dropped and every row carries its own clip, blurb and facts instead. That
 * is not a downgrade: on a phone these rows have to outrank Selected work
 * further down the page, and for a while they did the opposite - a case
 * study was twenty pixels of text and no picture, sitting above a live site
 * with a thirty two pixel name and a playing capture. The flagship tier
 * looked like the afterthought. Here it gets the bigger type and the wider
 * clip, because it is the more important work.
 */
const WIDE = "(min-width: 1024px)";

/**
 * Whether the detail pane is on screen, or null on the server, which cannot
 * know. Null renders no clip at all, so the markup the server sent and the
 * markup the client hydrates agree; the clips appear on the pass after.
 */
function useHasPane(): boolean | null {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(WIDE);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(WIDE).matches,
    () => null,
  );
}

/**
 * One row's clip, for the layout with no pane. Plays on its way past and
 * pauses when it leaves, so a loop never runs in a tab nobody is looking at.
 */
function RowClip({ study }: { study: CaseStudy }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v || prefersReducedMotion() || prefersLightData()) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) v.play().catch(() => {});
          else v.pause();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <span className="col-span-2 mt-6 block md:col-span-3">
      <StickerFrame tilt={-1.2}>
        <video
          ref={ref}
          poster={study.image}
          muted
          loop
          playsInline
          preload="none"
          aria-label={study.imageAlt}
          className="aspect-[1200/670] w-full rounded-[4px] object-cover"
        >
          <source src={`${study.clip}.webm`} type="video/webm" />
          <source src={`${study.clip}.mp4`} type="video/mp4" />
        </video>
      </StickerFrame>
    </span>
  );
}

export default function WorkIndex({ studies }: { studies: CaseStudy[] }) {
  const hasPane = useHasPane();
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
                  {/* Bigger below lg than at lg: with the pane on screen the
                      list is sharing its width and wants smaller type, but on
                      a phone this headline is the whole tier and has to carry
                      more weight than a company name further down the page. */}
                  <span className="mt-2 block font-display text-[1.75rem] font-bold leading-tight tracking-tight text-type transition-colors group-hover:text-accent md:text-[2rem] lg:text-[1.65rem]">
                    {study.title}
                  </span>
                  <span className="mt-3 block max-w-md text-[0.95rem] leading-relaxed text-soft lg:hidden">
                    {study.blurb}
                  </span>

                  {/* The facts, which only the pane used to show. On a phone
                      there is no pane, so without these a case study row was
                      a headline and a sentence while a live site below it
                      listed its dates, its roles and its domain. */}
                  <span className="mt-4 block space-y-1.5 lg:hidden">
                    {study.facts.map((fact) => (
                      <span key={fact} className="label flex gap-2.5 text-mute">
                        <span
                          aria-hidden
                          className="mt-[0.55em] h-px w-3 shrink-0 bg-rule"
                        />
                        {fact}
                      </span>
                    ))}
                  </span>

                  {/* The detail pane beside this list is aria-hidden, and it
                      is the only place the blurb, the facts and the live
                      site are rendered at lg and up - so a screen reader on
                      a desktop got the number, the client and the title and
                      nothing else, while a sighted reader got all of it.
                      Visually hidden rather than absent: the pane still does
                      the showing, this does the saying. */}
                  <span className="sr-only hidden lg:block">
                    {study.blurb}
                    {study.facts.map((f) => ` ${f}.`)}
                    {study.live ? ` Live at ${study.live.label}.` : null}
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

                {hasPane === false && study.clip && study.image ? (
                  <RowClip study={study} />
                ) : null}
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
                  aria-label={active.imageAlt}
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
