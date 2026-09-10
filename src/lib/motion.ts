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

/**
 * True when the reader has asked their browser to spend less data, or is on a
 * connection where a megabyte of autoplaying video is an imposition.
 *
 * Clips on this site are decoration on top of text that already says the same
 * thing, so on a metered phone they should stay a poster until tapped. The
 * poster is a single small JPEG and carries the picture on its own.
 */
export function prefersLightData(): boolean {
  if (typeof navigator === "undefined") return false;
  const c = (
    navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
    }
  ).connection;
  if (!c) return false;
  return Boolean(c.saveData) || c.effectiveType === "slow-2g" || c.effectiveType === "2g";
}

/** Duration, collapsed to ~0 when the viewer asked for reduced motion. */
export function dur(seconds: number): number {
  return prefersReducedMotion() ? 0.001 : seconds;
}

export { gsap };
