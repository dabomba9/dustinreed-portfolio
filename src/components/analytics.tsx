"use client";

import { useSyncExternalStore } from "react";
import { GoogleAnalytics } from "@next/third-parties/google";
import { analyticsPref } from "@/lib/preference";

/**
 * Google Analytics, on for every reader who hasn't switched it off.
 *
 * There is no banner asking first. The switch lives in two places instead -
 * a line in the homepage footer, and the ? panel - because the ? panel alone
 * is unreachable on a phone: its button is hidden below 640px and the key
 * needs a keyboard. Both write the same preference.
 *
 * The server snapshot is "off", so the script mounts after hydration -
 * which is when @next/third-parties loads it regardless - and a reader who
 * has switched it off is never overruled by what the server guessed.
 */
export default function Analytics({ id }: { id: string | null }) {
  const on = useSyncExternalStore(analyticsPref.subscribe, analyticsPref.read, () => false);

  /* Null off production and until there is a real ID. */
  if (!id || !on) return null;
  return <GoogleAnalytics gaId={id} />;
}
