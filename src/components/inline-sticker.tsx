"use client";

import Art from "@/components/art";
import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { gsap, dur, prefersReducedMotion } from "@/lib/motion";

/**
 * Only one sticker is ever up at a time.
 *
 * On a pointer device the hover does this for free - you can only be on one
 * word. A tap has no such limit, so without this, tapping four words on the
 * About page leaves four images stacked over the paragraph. Opening one
 * announces itself and every other instance stands down.
 */
const OPENED = "sticker:opened";

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
 * Three things make it disappear reliably, all learned the hard way:
 *
 *   overwrite  every tween kills the one before it. Without this, leaving
 *              quickly starts a 0.22s hide while the 0.5s show is still
 *              running; the hide finishes first and the show keeps writing
 *              opacity back up, parking the sticker on screen for good.
 *   two flags  hover and focus are tracked separately and the sticker is
 *              shown when either is true. One boolean gets out of step the
 *              moment a click, a tab-away or a scroll interleaves with a
 *              pointer event.
 *   one owner  only the button clears hover. The wrapper used to call a full
 *              hide() on pointerleave, which ran BEFORE click on touch - so a
 *              tap cleared `tapped` and then toggled it back to true, and the
 *              sticker could never be dismissed on a phone. The same handler
 *              also cleared `focused` out from under a keyboard user who
 *              happened to sweep the mouse past the word.
 *
 * The sticker is `pointer-events-none` so it can never sit between the reader
 * and the text underneath it, and Escape dismisses it without moving the
 * pointer, which is what WCAG 1.4.13 asks of content shown on hover.
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
  const id = useId();
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
   *
   * It is cleared on a timer as well as by the focus it expects, because
   * Safari and Firefox on macOS do not focus a button on click at all. There
   * the focus never arrives, and a flag that only a focus can clear stays
   * true for the life of the component - silently swallowing the reveal for
   * the next keyboard user who tabs here.
   */
  const focusFromPointer = useRef(false);
  const clearLatch = useRef<number | null>(null);
  /**
   * How the last press arrived. `click` is a MouseEvent and carries no
   * pointerType of its own, and `(hover: hover)` is the wrong question - a
   * touchscreen laptop answers yes to it and its finger taps then match
   * neither branch.
   */
  const lastPointer = useRef<string>("mouse");

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

  /**
   * Escape dismisses it. WCAG 1.4.13 asks that content shown on hover or
   * focus be dismissible without moving the pointer, and at 15rem over a
   * 38rem column this covers the lines you are reading. Captured, and the
   * event stopped, so one Escape does one thing - otherwise it reaches the
   * shell and closes the rail while the sticker stays put.
   */
  useEffect(() => {
    if (!shown) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.stopPropagation();
      hide();
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [shown, hide]);

  /** Another sticker opening is this one's cue to go. */
  useEffect(() => {
    if (!shown) return;
    const onOther = (e: Event) => {
      if ((e as CustomEvent<string>).detail !== id) hide();
    };
    window.addEventListener(OPENED, onOther);
    return () => window.removeEventListener(OPENED, onOther);
  }, [shown, id, hide]);

  /** Unmounting mid-hover must not leave a tween or a timer behind. */
  useEffect(() => {
    const el = card.current;
    return () => {
      if (el) gsap.killTweensOf(el);
      if (clearLatch.current) window.clearTimeout(clearLatch.current);
    };
  }, []);

  return (
    <span className="relative inline">
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
        onPointerDown={(e) => {
          lastPointer.current = e.pointerType;
          focusFromPointer.current = true;
          if (clearLatch.current) window.clearTimeout(clearLatch.current);
          clearLatch.current = window.setTimeout(() => {
            focusFromPointer.current = false;
          }, 300);
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
        onClick={() => {
          // On anything with a real pointer, hover is already in charge.
          if (lastPointer.current !== "touch") return;
          tapped.current = !tapped.current;
          if (tapped.current) {
            window.dispatchEvent(new CustomEvent(OPENED, { detail: id }));
          }
          sync();
        }}
        data-on={shown}
        className="swipe cursor-pointer text-left"
      >
        {children}
      </button>

      <span
        ref={card}
        aria-hidden
        style={{ width: size, opacity: 0, visibility: "hidden" }}
        className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-3 block drop-shadow-[0_18px_28px_rgba(0,0,0,0.55)]"
      >
        <Art src={src} width={width} height={height} className="w-full" />
      </span>
    </span>
  );
}
