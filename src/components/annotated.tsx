"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { dur, prefersReducedMotion } from "@/lib/motion";

/**
 * A screenshot that argues.
 *
 * The captions on this site make claims; until now the images underneath them
 * just sat there. These marks point at the thing being claimed, in the same
 * thick brush the portrait mark is drawn in.
 *
 * Geometry is written in percentages of the image, so a mark stays on its
 * target at every breakpoint. The overlay's viewBox is the image's own pixel
 * size and every stroke is non-scaling, so the line keeps one weight whether
 * the figure is 380px wide on a phone or full bleed on a desktop.
 */

type Ring = { kind: "ring"; x: number; y: number; w: number; h: number };
type Arrow = { kind: "arrow"; from: [number, number]; to: [number, number]; bend?: number };
export type Mark = Ring | Arrow;

export type Note = {
  at: [number, number];
  text: string;
  align?: "left" | "right" | "center";
};

/** Deterministic wobble. No randomness, so the server and client agree. */
function wobble(i: number, seed: number) {
  return (
    Math.sin(i * 0.9 + seed) * 0.55 +
    Math.sin(i * 2.3 + seed * 1.7) * 0.3 +
    Math.sin(i * 5.1 + seed * 0.4) * 0.14
  );
}

/** An open marker loop that overshoots its start, the way a hand does. */
function ringPath(m: Ring, W: number, H: number, seed = 1) {
  const cx = ((m.x + m.w / 2) / 100) * W;
  const cy = ((m.y + m.h / 2) / 100) * H;
  const rx = (m.w / 200) * W;
  const ry = (m.h / 200) * H;
  const STEPS = 64;
  const START = -0.45;
  const SWEEP = Math.PI * 2 + 0.62;
  const pts: string[] = [];
  for (let i = 0; i <= STEPS; i++) {
    const t = START + (i / STEPS) * SWEEP;
    // Wobble as an absolute radial offset, bounded by the SHORTER radius.
    // Scaling it per axis blew the vertical jitter out on a wide, flat ring
    // and the line stopped reading as one confident stroke.
    const off = wobble(i, seed) * Math.min(rx, ry) * 0.1;
    const x = cx + Math.cos(t) * (rx + off);
    const y = cy + Math.sin(t) * (ry + off);
    pts.push(`${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return pts.join(" ");
}

/** A curved lead line with a two stroke head, drawn as one path. */
function arrowPath(m: Arrow, W: number, H: number) {
  const [x1, y1] = [(m.from[0] / 100) * W, (m.from[1] / 100) * H];
  const [x2, y2] = [(m.to[0] / 100) * W, (m.to[1] / 100) * H];
  const bend = m.bend ?? 0.22;
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const cx = mx - dy * bend;
  const cy = my + dx * bend;

  // Head angle comes from the curve's own tangent at the tip.
  const a = Math.atan2(y2 - cy, x2 - cx);
  const len = Math.min(Math.hypot(dx, dy) * 0.18, 26);
  const spread = 0.42;
  const h1x = x2 - Math.cos(a - spread) * len;
  const h1y = y2 - Math.sin(a - spread) * len;
  const h2x = x2 - Math.cos(a + spread) * len;
  const h2y = y2 - Math.sin(a + spread) * len;

  return (
    `M${x1.toFixed(1)} ${y1.toFixed(1)} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)} ` +
    `M${h1x.toFixed(1)} ${h1y.toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)} L${h2x.toFixed(1)} ${h2y.toFixed(1)}`
  );
}

export default function Annotated({
  src,
  alt,
  caption,
  marks = [],
  notes = [],
  width = 1600,
  height = 1000,
  wide = false,
}: {
  src: string;
  alt: string;
  caption?: string;
  marks?: Mark[];
  notes?: Note[];
  width?: number;
  height?: number;
  wide?: boolean;
}) {
  const svgRef = useRef<SVGSVGElement | null>(null);

  // The marks are drawn in the markup and visible without JavaScript. The
  // dash offset is only applied once we know we can animate it back to zero,
  // so a failed script leaves ink on the page rather than an empty box.
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || prefersReducedMotion()) return;
    const paths = Array.from(svg.querySelectorAll<SVGPathElement>("path[data-draw]"));
    if (!paths.length) return;

    paths.forEach((p) => {
      const len = p.getTotalLength();
      p.style.strokeDasharray = `${len}`;
      p.style.strokeDashoffset = `${len}`;
    });

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        paths.forEach((p, i) => {
          p.style.transition = `stroke-dashoffset ${dur(0.7)}s cubic-bezier(0.16,1,0.3,1) ${i * 0.12}s`;
          p.style.strokeDashoffset = "0";
        });
        io.disconnect();
      },
      { threshold: 0.35 },
    );
    io.observe(svg);
    return () => io.disconnect();
  }, []);

  return (
    <figure className={`my-14 ${wide ? "md:-mx-24 lg:-mx-40" : ""}`}>
      <div className="relative rounded-sm border border-rule bg-raised p-2">
        <div className="relative">
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            sizes="(min-width: 1024px) 900px, 100vw"
            className="h-auto w-full rounded-[2px]"
          />

          {marks.length > 0 && (
            <svg
              ref={svgRef}
              aria-hidden
              viewBox={`0 0 ${width} ${height}`}
              preserveAspectRatio="none"
              className="pointer-events-none absolute inset-0 h-full w-full"
            >
              {marks.map((m, i) => (
                <path
                  key={i}
                  data-draw
                  d={m.kind === "ring" ? ringPath(m, width, height, i + 1) : arrowPath(m, width, height)}
                  fill="none"
                  stroke="var(--color-solid)"
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                />
              ))}
            </svg>
          )}

          {notes.map((n, i) => (
            <span
              key={i}
              className={`label pointer-events-none absolute max-w-[17rem] leading-[1.45] text-solid drop-shadow-[0_1px_3px_rgba(0,0,0,0.85)] ${
                n.align === "right"
                  ? "-translate-x-full text-right"
                  : n.align === "center"
                    ? "-translate-x-1/2 text-center"
                    : ""
              }`}
              style={{ left: `${n.at[0]}%`, top: `${n.at[1]}%` }}
            >
              {n.text}
            </span>
          ))}
        </div>
      </div>

      {caption ? (
        <figcaption className="mt-3 text-sm leading-relaxed text-mute">{caption}</figcaption>
      ) : null}
    </figure>
  );
}
