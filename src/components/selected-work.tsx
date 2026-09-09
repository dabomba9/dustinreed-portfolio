"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { gsap, EASE, T, dur, prefersReducedMotion } from "@/lib/motion";
import StickerFrame from "@/components/sticker-frame";
import type { SelectedWork as Item } from "@/content/projects";

/**
 * The second tier: live sites, as a list you read rather than a grid you scan.
 *
 * The rows are text and stay text. This section was deliberately moved away
 * from carrying video once before, because a playing clip under a heading made
 * the whole tier read as the work I had not got around to writing up. So the
 * capture is not in the row - it is peeled up off the list on hover, and gone
 * again when you leave.
 *
 * Two behaviours, chosen by what the reader is holding:
 *
 *   fine pointer    nothing until hover or focus. The sticker is absolutely
 *                   positioned and does not participate in layout, so
 *                   revealing it cannot push the rows below and cannot slide
 *                   the row out from under the cursor - which would fire
 *                   mouseleave, collapse the clip, and flicker forever.
 *   coarse pointer  there is no hover to wait for, so the clip sits in the
 *                   row and plays when it scrolls into view, the way the case
 *                   study clips do.
 *
 * Reduced motion outrules both. The CSS blanket in globals.css kills
 * transitions but has no opinion about <video>, so that gate has to be here.
 */
const FINE = "(pointer: fine)";

/**
 * What the reader is holding, or null on the server, which cannot know.
 *
 * A subscription rather than one read in an effect: an iPad gains and loses a
 * trackpad mid-session, and this is the one hook that can answer during render
 * without guessing a value the server would have to disagree with.
 */
function usePointerMode(): "hover" | "inline" | null {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(FINE);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => (window.matchMedia(FINE).matches ? "hover" : "inline"),
    () => null,
  );
}

export default function SelectedWork({ items }: { items: Item[] }) {
  /* Null on the first paint, so no clip is rendered until the client knows
     which behaviour it owes the reader. On a fine pointer that is also the
     finished state - nothing shows until a hover asks for it. */
  const mode = usePointerMode();

  return (
    <ul>
      {items.map((item) => (
        <Row key={item.name} item={item} mode={mode} />
      ))}
    </ul>
  );
}

function Row({ item, mode }: { item: Item; mode: "hover" | "inline" | null }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const stickerRef = useRef<HTMLDivElement>(null);

  const hasClip = Boolean(item.clip && item.poster);
  const showClip = hasClip && mode !== null;

  /* Hover and focus are the same event here. A keyboard reader tabbing the
     list gets the clip a mouse reader gets. */
  function reveal(on: boolean) {
    if (mode !== "hover") return;
    const el = stickerRef.current;
    const v = videoRef.current;
    if (!el) return;

    gsap.to(el, {
      autoAlpha: on ? 1 : 0,
      y: on ? 0 : 10,
      duration: dur(T.hover),
      ease: EASE.snap,
    });

    if (!v || prefersReducedMotion()) return;
    if (on) {
      v.currentTime = 0;
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }

  /* Touch has no hover to wait for, so the clip plays on its way past and
     pauses when it leaves. A loop running in a tab nobody is looking at is a
     battery bill someone else pays. */
  useEffect(() => {
    if (mode !== "inline") return;
    const v = videoRef.current;
    if (!v || prefersReducedMotion()) return;

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
  }, [mode]);

  /* A div, not a span: StickerFrame renders a div, and phrasing content cannot
     carry flow content. In hover mode this sits directly under the <li>; in
     inline mode it is the third grid child of the <a>, never inside the
     paragraph span. */
  const clip = showClip ? (
    <div
      ref={stickerRef}
      aria-hidden={mode === "hover" ? true : undefined}
      className={
        mode === "hover"
          ? /* Out of flow and deaf to the pointer: it can neither displace the
               rows it covers nor swallow a click meant for one. The cost is
               StickerFrame's parallax, which needs pointer events to run.

               Anchored to the row's bottom edge rather than a fraction of its
               height, so it clears the paragraph it belongs to no matter how
               long that paragraph runs. It overlaps downward, into the row you
               have not read yet, which is the cheaper thing to cover. */
            "pointer-events-none absolute right-0 top-[calc(100%-2.5rem)] z-20 w-[26rem] max-w-[38vw] opacity-0"
          : "mt-8 md:col-span-2"
      }
    >
      <StickerFrame tilt={-1.5}>
        <video
          ref={videoRef}
          poster={item.poster}
          muted
          loop
          playsInline
          preload="none"
          aria-label={item.clipAlt}
          className="aspect-[1200/664] w-full rounded-[4px] object-cover"
        >
          <source src={`${item.clip}.webm`} type="video/webm" />
          <source src={`${item.clip}.mp4`} type="video/mp4" />
        </video>
      </StickerFrame>
    </div>
  ) : null;

  return (
    <li className="relative border-b border-rule">
      <a
        href={item.href}
        target="_blank"
        rel="noreferrer"
        onMouseEnter={() => reveal(true)}
        onMouseLeave={() => reveal(false)}
        onFocus={() => reveal(true)}
        onBlur={() => reveal(false)}
        /* Named explicitly, because name-from-content here is the project
           name plus the date plus every role plus the domain plus the whole
           paragraph - about forty words - and on touch the clip's own label
           joins it. Three of those in a row make the VoiceOver rotor
           unusable. The sentence is still read as content; it just is not
           the name of the link any more. */
        aria-label={`${item.name} — ${item.domain}`}
        className="group grid gap-x-10 gap-y-4 py-9 no-underline md:grid-cols-[1fr_1.05fr] md:py-11"
      >
        <span className="min-w-0">
          <span className="display block text-[2rem] text-type transition-colors group-hover:text-accent md:text-[2.75rem]">
            {item.name}
          </span>
          <span className="label mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-mute">
            <span className="text-type">{item.when}</span>
            {item.role.map((r) => (
              <span key={r} className="flex items-center gap-2">
                <span aria-hidden className="text-rule">
                  /
                </span>
                {r}
              </span>
            ))}
          </span>
          <span className="label mt-5 flex items-center gap-2 text-type transition-colors group-hover:text-accent">
            <span className="draw-link">{item.domain}</span>
            <span
              aria-hidden
              className="transition-transform group-hover:translate-x-0.5"
            >
              &#8599;
            </span>
          </span>
        </span>

        <span className="max-w-xl text-[1.0625rem] leading-relaxed text-soft">
          {item.line}
        </span>

        {mode === "inline" ? clip : null}
      </a>

      {mode === "hover" ? clip : null}
    </li>
  );
}
