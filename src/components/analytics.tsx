"use client";

import { useSyncExternalStore } from "react";
import { GoogleAnalytics } from "@next/third-parties/google";
import { analyticsPref } from "@/lib/preference";
import { optIn } from "@/lib/analytics";

/**
 * Google Analytics, and the question that has to come before it.
 *
 * Nothing is loaded until the reader says yes. Not Google's "advanced"
 * consent mode, which loads the script regardless and sends cookieless
 * pings to be modelled - that modelling needs far more traffic than a
 * portfolio gets, and it would end the one thing this site could say about
 * itself until now: every request goes to dustinreed.co. For anyone who
 * has not agreed, that is still true.
 *
 * The answer is read through useSyncExternalStore, like the cursor switch.
 * The server snapshot is "answered, no": the server never renders the
 * banner, so a returning reader never sees it flash, and nothing on the
 * first paint can disagree with what hydration finds.
 */
export default function Analytics({ id }: { id: string | null }) {
  const granted = useSyncExternalStore(analyticsPref.subscribe, analyticsPref.read, () => false);
  const answered = useSyncExternalStore(analyticsPref.subscribe, analyticsPref.isSet, () => true);

  /* Null off production and until there is a real ID. No banner either -
     asking for consent to something that will never load is its own lie. */
  if (!id) return null;

  return (
    <>
      {granted ? <GoogleAnalytics gaId={id} /> : null}
      {!answered ? (
        <ConsentBanner
          onAnswer={(yes) => {
            if (yes) optIn(id);
            analyticsPref.write(yes);
          }}
        />
      ) : null}
    </>
  );
}

/**
 * The question itself.
 *
 * A labelled region, not a dialog: it blocks nothing, traps nothing, and a
 * reader can ignore it and read the whole site. It sits just above the
 * status bar (h-9 plus the 2px progress line) and clears the rail the same
 * way the status bar does.
 *
 * The two buttons are deliberately identical. Making "No thanks" the easy
 * one to miss is the move that makes consent banners worthless; declining
 * should cost exactly what accepting does.
 */
function ConsentBanner({ onAnswer }: { onAnswer: (yes: boolean) => void }) {
  const button =
    "label min-h-11 shrink-0 border border-edge px-4 text-type transition-colors hover:bg-ground";
  return (
    <section
      aria-label="Analytics consent"
      className="fixed inset-x-0 bottom-12 z-30 px-3 lg:left-[21rem]"
    >
      <div className="mx-auto flex max-w-2xl flex-col gap-3 border border-control bg-raised px-4 py-3 shadow-[0_18px_40px_-18px_rgba(0,0,0,0.6)] sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        {/* min-w-0 and shrink-0 between them decide who gives way in the row:
            the sentence wraps, the buttons keep their size. Without them the
            buttons were pushed out past the banner's own border. */}
        <p className="min-w-0 flex-1 text-[0.9rem] leading-snug text-soft">
          This site can use Google Analytics to see which work gets read. Nothing
          loads unless you allow it.
        </p>
        <div className="flex shrink-0 gap-2">
          <button type="button" onClick={() => onAnswer(false)} className={button}>
            No thanks
          </button>
          <button type="button" onClick={() => onAnswer(true)} className={button}>
            Allow
          </button>
        </div>
      </div>
    </section>
  );
}
