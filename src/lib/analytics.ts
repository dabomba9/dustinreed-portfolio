import { sendGAEvent } from "@next/third-parties/google";
import { analyticsPref } from "@/lib/preference";

/**
 * Analytics, on until the reader turns it off.
 *
 * Nothing here loads Google; components/analytics.tsx mounts the script.
 * This is the rest: counting an event, and switching the whole thing off or
 * back on - from the homepage footer or the ? panel, which both come
 * through setAnalytics so there is one way to do it, not two.
 */

type Params = Record<string, string | number | boolean>;

/**
 * Record an event, unless this reader switched analytics off, and only if GA
 * is actually on the page. Checking `dataLayer` as well as the preference
 * covers every build without GA - dev, previews, CI - where sendGAEvent would
 * otherwise warn into the console for nothing.
 */
export function track(name: string, params: Params = {}): void {
  if (typeof window === "undefined") return;
  if (!analyticsPref.read()) return;
  if (!(window as Window & { dataLayer?: unknown[] }).dataLayer) return;
  sendGAEvent("event", name, params);
}

/**
 * Switch it off properly. Unmounting the component stops nothing: the
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

/** Undo the kill switch, for a reader who turns it back on without reloading. */
export function optIn(id: string): void {
  (window as unknown as Record<string, boolean>)[`ga-disable-${id}`] = false;
}

/**
 * The one way to change it. The footer button and the ? switch both call
 * this, so turning it off always does the whole job - kill switch, cookies
 * and the remembered choice - whichever one the reader happened to find.
 */
export function setAnalytics(id: string, on: boolean): void {
  if (on) optIn(id);
  else optOut(id);
  analyticsPref.write(on);
}
