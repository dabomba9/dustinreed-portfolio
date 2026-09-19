import { sendGAEvent } from "@next/third-parties/google";
import { analyticsPref } from "@/lib/preference";

/**
 * Analytics, strictly on the reader's say-so.
 *
 * Nothing here loads Google. The script is only ever mounted by
 * components/analytics.tsx, and only after consent, so a reader who never
 * answers - or says no - costs this site zero requests to anyone but itself.
 */

type Params = Record<string, string | number | boolean>;

/**
 * Record an event, if and only if this reader agreed and GA is actually on
 * the page. Checking `dataLayer` as well as the preference covers a reader
 * who said yes on production and is now on a preview, where GA never mounts:
 * without it, sendGAEvent would warn into their console for nothing.
 */
export function track(name: string, params: Params = {}): void {
  if (typeof window === "undefined") return;
  if (!analyticsPref.read()) return;
  if (!(window as Window & { dataLayer?: unknown[] }).dataLayer) return;
  sendGAEvent("event", name, params);
}

/**
 * Take consent back properly. Unmounting the component stops nothing: the
 * gtag script is already in the page and keeps sending until reload. So set
 * Google's own kill switch for this ID, and delete the cookies it wrote -
 * which live on the parent domain, so the bare hostname alone would miss
 * them.
 */
export function optOut(id: string): void {
  (window as unknown as Record<string, boolean>)[`ga-disable-${id}`] = true;

  const host = location.hostname;
  const parts = host.split(".");
  const domains = [host, `.${host}`, parts.length > 2 ? `.${parts.slice(-2).join(".")}` : null].filter(
    Boolean,
  ) as string[];

  for (const c of document.cookie.split(";")) {
    const name = c.split("=")[0]?.trim();
    if (!name || !name.startsWith("_ga")) continue;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    for (const d of domains) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${d}`;
    }
  }
}

/** Undo the kill switch, for a reader who opts back in without reloading. */
export function optIn(id: string): void {
  (window as unknown as Record<string, boolean>)[`ga-disable-${id}`] = false;
}
