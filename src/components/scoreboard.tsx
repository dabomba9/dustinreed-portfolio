"use client";

import { useEffect, useRef } from "react";
import { gsap, EASE, dur } from "@/lib/motion";

/**
 * Twenty-five cells, five of them lit. The only element on the site that
 * breaks the centred column, which is the point — the number it carries is
 * the one thing here nobody else could publish.
 *
 * The cells wipe in on first view rather than on load, so the reveal happens
 * when someone is actually looking at it.
 */
export default function Scoreboard({
  lit = 5,
  total = 25,
  headline,
  litLabel,
  restLabel,
}: {
  lit?: number;
  total?: number;
  headline: string;
  litLabel: string;
  restLabel: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const cells = root.querySelectorAll<HTMLElement>("[data-cell]");
    const ctx = gsap.context(() => {
      gsap.set(cells, { scaleY: 0.25, opacity: 0.35, transformOrigin: "bottom" });
      const io = new IntersectionObserver(
        (entries) => {
          if (!entries[0].isIntersecting) return;
          io.disconnect();
          gsap.to(cells, {
            scaleY: 1,
            opacity: 1,
            duration: dur(0.5),
            ease: EASE.out,
            stagger: dur(0.018),
          });
        },
        { threshold: 0.4 }
      );
      io.observe(root);
      return () => io.disconnect();
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="my-16">
      <div className="mx-auto max-w-5xl px-6 md:px-10 lg:px-14">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
          <span className="display text-6xl text-flame md:text-8xl">{lit}</span>
          <span className="display text-3xl text-mute md:text-4xl">of</span>
          <span className="display text-6xl md:text-8xl">{total}</span>
          <span className="label ml-2 max-w-[26ch] leading-relaxed text-mute">{headline}</span>
        </div>
      </div>

      {/* Edge to edge. Nothing else on the site does this. */}
      <div className="mt-8 flex w-full gap-px px-1">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            data-cell
            className={`h-24 flex-1 md:h-28 ${i < lit ? "bg-flame" : "bg-rule"}`}
          />
        ))}
      </div>

      <div className="mx-auto mt-4 flex max-w-5xl flex-wrap justify-between gap-3 px-6 md:px-10 lg:px-14">
        <span className="label text-flame">{litLabel}</span>
        <span className="label text-right text-mute">{restLabel}</span>
      </div>
    </div>
  );
}
