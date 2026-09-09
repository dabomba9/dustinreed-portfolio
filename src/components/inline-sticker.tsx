"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { gsap, dur, prefersReducedMotion } from "@/lib/motion";

/**
 * A sticker that pops out of a phrase.
 *
 * The About page names the designers I learned from. One of them designed a
 * plywood elephant, and I own it, so the elephant should be able to show up
 * when someone points at his name. That is the whole idea: a reward for
 * reading closely rather than a thing the page announces.
 *
 * Rules it follows:
 *
 *   keyboard   the trigger is a real button, so tab and focus reveal it too.
 *              An easter egg only mouse users can find is a smaller easter egg.
 *   touch      tap toggles, because there is no hover on a phone.
 *   reduced    honoured. It appears and disappears without the overshoot.
 *              motion
 *   readers    the image is decorative and hidden. The sentence already says
 *              the name; the picture adds nothing a screen reader needs.
 *
 * The sticker is `pointer-events-none` so it can never sit between the reader
 * and the text underneath it.
 */
export default function InlineSticker({
  src,
  width,
  height,
  children,
  size = "9.5rem",
  tilt = -5,
}: {
  src: string;
  width: number;
  height: number;
  children: ReactNode;
  /** Rendered width of the sticker. */
  size?: string;
  /** Resting rotation in degrees. */
  tilt?: number;
}) {
  const [shown, setShown] = useState(false);
  const card = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const el = card.current;
    if (!el) return;

    if (prefersReducedMotion()) {
      gsap.set(el, { autoAlpha: shown ? 1 : 0, xPercent: -50, scale: 1, rotate: tilt, y: 0 });
      return;
    }

    if (shown) {
      gsap.fromTo(
        el,
        { autoAlpha: 0, xPercent: -50, scale: 0.55, rotate: tilt - 12, y: 18 },
        {
          autoAlpha: 1,
          xPercent: -50,
          scale: 1,
          rotate: tilt,
          y: 0,
          duration: dur(0.5),
          ease: "back.out(2.2)",
        },
      );
    } else {
      gsap.to(el, {
        autoAlpha: 0,
        xPercent: -50,
        scale: 0.8,
        rotate: tilt - 8,
        y: 10,
        duration: dur(0.22),
        ease: "power2.in",
      });
    }
  }, [shown, tilt]);

  return (
    <span className="relative inline-block">
      <button
        type="button"
        onMouseEnter={() => setShown(true)}
        onMouseLeave={() => setShown(false)}
        onFocus={() => setShown(true)}
        onBlur={() => setShown(false)}
        onClick={() => setShown((v) => !v)}
        aria-expanded={shown}
        data-on={shown}
        className="mark swipe cursor-pointer"
      >
        {children}
      </button>

      <span
        ref={card}
        aria-hidden
        style={{ width: size, opacity: 0, visibility: "hidden" }}
        className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-3 block drop-shadow-[0_18px_28px_rgba(0,0,0,0.55)]"
      >
        <Image src={src} alt="" width={width} height={height} className="h-auto w-full" />
      </span>
    </span>
  );
}
