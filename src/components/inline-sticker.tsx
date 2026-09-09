"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
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
 *   touch      tap toggles, because there is no hover on a phone. On a device
 *              that does hover, a click is ignored - the pointer already
 *              governs the sticker, and letting click toggle as well means a
 *              click while hovering hides it under your own cursor.
 *   reduced    honoured. It appears and disappears without the overshoot.
 *              motion
 *   readers    the image is decorative and hidden. The sentence already says
 *              the name; the picture adds nothing a screen reader needs.
 *
 * Two things make it disappear reliably, both learned the hard way:
 *
 *   overwrite  every tween kills the one before it. Without this, leaving
 *              quickly starts a 0.22s hide while the 0.5s show is still
 *              running; the hide finishes first and the show keeps writing
 *              opacity back up, parking the sticker on screen for good.
 *   two flags  hover and focus are tracked separately and the sticker is
 *              shown when either is true. One boolean gets out of step the
 *              moment a click, a tab-away or a scroll interleaves with a
 *              pointer event.
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
  const hovering = useRef(false);
  const focused = useRef(false);
  /** Set by a tap on a device with no hover, where click is the only input. */
  const tapped = useRef(false);
  /**
   * True between pointerdown and the focus it causes. A click focuses the
   * button, and that focus would otherwise outlive the pointer and strand
   * the sticker on screen. Asking the button whether it matches
   * :focus-visible does not work here - Chromium has not applied it yet
   * when the focus handler runs, so keyboard users would lose the sticker.
   */
  const focusFromPointer = useRef(false);

  const sync = useCallback(() => {
    setShown(hovering.current || focused.current || tapped.current);
  }, []);

  const hide = useCallback(() => {
    hovering.current = false;
    focused.current = false;
    tapped.current = false;
    setShown(false);
  }, []);

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
          overwrite: true,
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
        overwrite: true,
      });
    }
  }, [shown, tilt]);

  /**
   * Backstops for the leave the browser never sends: the tab going to the
   * background, or the window losing focus, while the pointer sits on the
   * word. Deliberately NOT scroll - the browser already fires pointerleave
   * when the word slides out from under the cursor, and hiding on every
   * scroll event means a stray trackpad nudge kills a sticker you are still
   * pointing at.
   */
  useEffect(() => {
    if (!shown) return;
    const onHidden = () => {
      if (document.visibilityState === "hidden") hide();
    };
    window.addEventListener("blur", hide);
    document.addEventListener("visibilitychange", onHidden);
    return () => {
      window.removeEventListener("blur", hide);
      document.removeEventListener("visibilitychange", onHidden);
    };
  }, [shown, hide]);

  /** Unmounting mid-hover must not leave a tween running on a dead node. */
  useEffect(() => {
    const el = card.current;
    return () => {
      if (el) gsap.killTweensOf(el);
    };
  }, []);

  return (
    <span className="relative inline-block" onPointerLeave={hide}>
      <button
        type="button"
        onPointerEnter={(e) => {
          if (e.pointerType === "touch") return;
          hovering.current = true;
          sync();
        }}
        onPointerLeave={() => {
          hovering.current = false;
          sync();
        }}
        onPointerCancel={hide}
        onPointerDown={() => {
          focusFromPointer.current = true;
        }}
        onFocus={() => {
          // Only a keyboard landing should reveal it.
          if (focusFromPointer.current) {
            focusFromPointer.current = false;
            return;
          }
          focused.current = true;
          sync();
        }}
        onBlur={() => {
          focusFromPointer.current = false;
          focused.current = false;
          sync();
        }}
        onClick={(e) => {
          // On anything with a real pointer, hover is already in charge.
          if (window.matchMedia("(hover: hover)").matches) {
            e.preventDefault();
            return;
          }
          tapped.current = !tapped.current;
          sync();
        }}
        aria-expanded={shown}
        data-on={shown}
        className="swipe cursor-pointer"
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
