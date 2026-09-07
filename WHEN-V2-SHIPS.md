# When CurbNTurf v2 goes live

Everything time-sensitive about v2 lives in one file:
`src/app/work/curbnturf/page.tsx`. There are five things to change, and
they should take about ten minutes.

The images are all dated captures, so they do not go wrong when v2
ships — they become the "before". That is deliberate. Do not delete the
v1 screenshot; a case study that argues v1 → v2 needs the v1.

1. **Metadata, line ~27.** `Status: "Live, v2 in progress"` →
   `"Live — v2 shipped <month year>"`.

2. **The v1 figure caption.** Currently "V1, captured September 2026."
   Add "since replaced" so a reader is not confused about what is live.

3. **The v1-beside-v2 figure.** Recapture the right-hand side from the
   production site rather than the Vercel preview, and say so in the
   caption. Keep the same left-hand v1 image.

4. **Present tense in "Version two".** Two sentences read as future:
   - "We're extending it now with AI that gathers information local to
     the host while he signs up..."
   - "Whether that moves five out of twenty five is the open question.
     I'll know soon."
   Once it has shipped, the second one has an answer. Put the number in.
   A designer who published a prediction and then reported the result is
   doing something almost nobody else on a portfolio does — that is worth
   more than the prediction was.

5. **The scoreboard.** `<Scoreboard lit={5} total={25} ... />` on the
   numbers section. If the onboarding rate moved, change `lit` and the
   labels. If it moved a lot, consider showing both — the old rate and
   the new one — because the delta is the strongest version of this
   whole case study.

Nothing else on the site references v2.
