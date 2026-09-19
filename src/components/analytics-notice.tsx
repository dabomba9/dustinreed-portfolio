"use client";

import { useSyncExternalStore } from "react";
import { analyticsPref } from "@/lib/preference";
import { setAnalytics } from "@/lib/analytics";

/**
 * The homepage footer's line about analytics, and the switch for it.
 *
 * With no banner, this has to be more than a sentence. The ? panel has the
 * same switch, but it is out of reach on a phone - its button is hidden
 * below 640px and the key needs a keyboard - so for a phone reader this
 * button is the only way to turn it off. It gets the same tap target as the
 * footer links above it for that reason.
 *
 * Reads the same preference as the ? switch, so turning it off in one shows
 * as off in the other without a reload.
 */
export default function AnalyticsNotice({ id }: { id: string }) {
  const on = useSyncExternalStore(analyticsPref.subscribe, analyticsPref.read, () => true);

  return (
    <p className="label mt-3 text-mute">
      {on ? "It uses Google Analytics. " : "Google Analytics is off. "}
      <button
        type="button"
        onClick={() => setAnalytics(id, !on)}
        aria-label={on ? "Turn off Google Analytics" : "Turn Google Analytics back on"}
        className="draw-link label -my-3 inline-flex items-center py-3 text-soft transition-colors hover:text-accent"
      >
        {on ? "Turn it off" : "Turn it back on"}
      </button>
    </p>
  );
}
