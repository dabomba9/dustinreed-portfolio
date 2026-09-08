"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap, dur, prefersReducedMotion } from "@/lib/motion";

/**
 * The physics of a sticker.
 *
 * Three moments, all serving the same idea - this is an object resting on a
 * surface, not a picture printed into the page:
 *
 *   settle   it arrives slightly over rotated and a little small, then drops
 *            onto its tilt with a short overshoot, the way a sticker is
 *            pressed down and springs back
 *   lift     hovering peels it up: it straightens, rises, and its shadow
 *            softens and spreads the way a shadow does when a thing moves
 *            away from the surface it sits on
 *   parallax a couple of degrees of tilt following the pointer, so the
 *            object has a front and a back rather than being flat art
 *
 * GSAP owns every transform on the card. The resting tilt is set here rather
 * than in CSS because a CSS rotate and a GSAP rotate on one element fight,
 * and the CSS one wins at exactly the wrong moment.
 *
 * Nothing is parked invisible in the markup: the entry state is applied by
 * this effect, so a page with no JavaScript shows the sticker sitting flat
 * and finished instead of a blank space waiting for an observer.
 */
export default function StickerFrame({
  tilt = -1,
  className = "",
  children,
}: {
  tilt?: number;
  className?: string;
  children: ReactNode;
}) {
  const wrap = useRef<HTMLDivElement | null>(null);
  const card = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = card.current;
    const outer = wrap.current;
    if (!el || !outer) return;

    const reduced = prefersReducedMotion();
    const fine =
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: fine)").matches;

    const ctx = gsap.context(() => {
      gsap.set(el, { rotation: tilt, transformPerspective: 900 });

      // settle
      const io = new IntersectionObserver(
        (entries) => {
          if (!entries.some((e) => e.isIntersecting)) return;
          gsap.fromTo(
            el,
            { rotation: tilt - 3.5, scale: 0.965, y: 20, autoAlpha: 0 },
            {
              rotation: tilt,
              scale: 1,
              y: 0,
              autoAlpha: 1,
              duration: dur(0.72),
              ease: "back.out(1.4)",
            },
          );
          io.disconnect();
        },
        { threshold: 0.2 },
      );
      io.observe(outer);

      if (reduced || !fine) return () => io.disconnect();

      // lift + parallax
      const rx = gsap.quickTo(el, "rotationX", { duration: 0.5, ease: "power3.out" });
      const ry = gsap.quickTo(el, "rotationY", { duration: 0.5, ease: "power3.out" });
      const rz = gsap.quickTo(el, "rotation", { duration: 0.5, ease: "power3.out" });
      const ty = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });

      function onMove(e: PointerEvent) {
        const b = outer!.getBoundingClientRect();
        const px = (e.clientX - b.left) / b.width - 0.5;
        const py = (e.clientY - b.top) / b.height - 0.5;
        ry(px * 5);
        rx(py * -3.5);
      }
      function onEnter() {
        rz(0);
        ty(-7);
        outer!.dataset.lifted = "true";
      }
      function onLeave() {
        rx(0);
        ry(0);
        rz(tilt);
        ty(0);
        delete outer!.dataset.lifted;
      }

      outer.addEventListener("pointerenter", onEnter);
      outer.addEventListener("pointermove", onMove);
      outer.addEventListener("pointerleave", onLeave);
      return () => {
        io.disconnect();
        outer.removeEventListener("pointerenter", onEnter);
        outer.removeEventListener("pointermove", onMove);
        outer.removeEventListener("pointerleave", onLeave);
      };
    }, outer);

    return () => ctx.revert();
  }, [tilt]);

  return (
    <div ref={wrap} className="group [perspective:900px]">
      <div
        ref={card}
        className={`rounded-xl bg-type p-4 shadow-[0_16px_36px_-16px_rgba(0,0,0,0.85)] transition-shadow duration-500 ease-out [transform-style:preserve-3d] group-data-[lifted]:shadow-[0_34px_70px_-20px_rgba(0,0,0,0.95)] md:rounded-2xl md:p-6 ${className}`}
        style={{ transform: `rotate(${tilt}deg)` }}
      >
        {children}
      </div>
    </div>
  );
}
