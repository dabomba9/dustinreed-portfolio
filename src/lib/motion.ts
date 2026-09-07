import { gsap } from "gsap";

/**
 * One motion system for the whole site.
 *
 * Two rules everything obeys:
 *   1. Every duration and curve comes from here, so nothing drifts.
 *   2. Reduced motion is honoured at the source — `dur()` returns
 *      near-zero, so animations still RUN and still land on their final
 *      values, they just take no time. That is safer than skipping them,
 *      which leaves elements parked at their start state.
 */

export const EASE = {
  /** Default: fast out, long settle. Matches the CSS page transition. */
  out: "power3.out",
  /** For anything that should feel physical — panels, indicators. */
  spring: "elastic.out(1, 0.85)",
  /** Short, flat, for hover states that must not feel laggy. */
  snap: "power2.out",
} as const;

export const T = {
  hover: 0.22,
  panel: 0.32,
  swap: 0.2,
  indicator: 0.34,
} as const;

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Duration, collapsed to ~0 when the viewer asked for reduced motion. */
export function dur(seconds: number): number {
  return prefersReducedMotion() ? 0.001 : seconds;
}

export { gsap };
