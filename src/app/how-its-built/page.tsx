import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import { SpecBlock } from "@/components/blocks";
import { Wrap, Column, H2, P, Lead, Pull, Bullets } from "@/components/prose";

const REPO = "https://github.com/dabomba9/dustinreed-portfolio";

export const metadata: Metadata = pageMeta({
  title: "How this site is built",
  description:
    "Seventeen color themes generated in OKLCH and checked against WCAG AA on every build, and a browser check that fails if a fixed bug comes back. The code is on GitHub.",
  path: "/how-its-built",
});

/* Measured, not typed in: scripts/themes.mjs run as it is today ("solved"),
   and again with its first approach restored, OKLCH lightness held fixed
   ("fixed"). The pair is dark mode, control on raised, the closest to its
   3:1 floor in most themes. Re-run both before changing a figure here. */
const CONTROL_ON_RAISED: { stop: string; fixed: string; solved: string }[] = [
  { stop: "0 Lime", fixed: "3.02", solved: "3.02" },
  { stop: "1 Fern", fixed: "3.03", solved: "3.03" },
  { stop: "2 Jade", fixed: "3.00", solved: "3.05" },
  { stop: "3 Teal", fixed: "3.00", solved: "3.05" },
  { stop: "4 Aqua", fixed: "2.98", solved: "3.07" },
  { stop: "5 Sky", fixed: "2.94", solved: "3.07" },
  { stop: "6 Azure", fixed: "2.91", solved: "3.04" },
  { stop: "7 Cobalt", fixed: "2.93", solved: "3.07" },
  { stop: "8 Indigo", fixed: "2.90", solved: "3.04" },
  { stop: "9 Violet", fixed: "2.91", solved: "3.05" },
  { stop: "10 Orchid", fixed: "2.89", solved: "3.03" },
  { stop: "11 Magenta", fixed: "2.92", solved: "3.05" },
  { stop: "12 Rose", fixed: "2.90", solved: "3.06" },
  { stop: "13 Crimson", fixed: "2.94", solved: "3.06" },
  { stop: "14 Rust", fixed: "2.96", solved: "3.05" },
  { stop: "15 Amber", fixed: "2.99", solved: "3.04" },
  { stop: "16 Olive", fixed: "2.99", solved: "3.03" },
];

export default function HowItsBuilt() {
  return (
    <>
      <section className="border-b border-rule">
        <Wrap className="py-20 md:py-28">
          <p className="label text-accent">How this site is built</p>
          <h1 className="display mt-7 max-w-4xl text-[3.25rem] sm:text-7xl md:text-[5.5rem]">
            Nobody picks 340 color pairs by hand.
          </h1>
        </Wrap>
      </section>

      <Wrap className="py-20 md:py-24">
        <Column>
          <Lead>
            Next.js, my own components, and two scripts that refuse to let me ship
            something broken. This page is about the two scripts.
          </Lead>

          <P>
            The color dial in the sidebar turns the whole site through seventeen hues. Each
            one has a dark page and light bands, and in every one of them the text, two
            lighter shades of text, the accent and the outlines on buttons have to stay readable on two
            different surfaces. That’s 340 pairs that each have to pass WCAG AA. I didn’t
            choose any of them.
          </P>

          <H2>Seventeen themes, none of them chosen</H2>

          <P>
            <code className="font-mono text-[0.9em] text-type">scripts/themes.mjs</code> starts from the two palettes the site already
            had, the dark page and the light bands, written out as hex. It converts every
            color to OKLCH, a color space where lightness, colorfulness and hue are separate
            dials, and turns the hue by a seventeenth of the wheel for each new theme.
          </P>

          <P>
            Then it solves for lightness, and this is the part that matters. Contrast in WCAG
            isn’t measured in OKLCH lightness. It’s measured in relative luminance, which
            counts green far more than blue, so a blue and a green at the same OKLCH
            lightness don’t have the same contrast against the same background. The script
            searches for the lightness at which each new color has the same relative
            luminance the original had, so its contrast comes back to where it started.
          </P>

          <P>
            Two things are allowed to give way, in this order. Colorfulness, when a hue
            can’t hold it inside the range a screen can show. Then a nudge of lightness
            away from the background, when rounding to eight-bit color eats the last of a
            pair’s headroom, until it clears its floor with a 0.03 margin. The default theme
            is the original palette, byte for byte.
          </P>

          <H2>The first version failed, and the build said so</H2>

          <P>
            My first attempt held OKLCH lightness fixed and only turned the hue. It’s the
            obvious move and it’s very nearly right. Here is what the check says about it,
            re-run with that approach put back:
          </P>

          <SpecBlock
            title="node scripts/themes.mjs --check"
            note="first approach, exit code 1"
            rows={[
              { key: "Result", value: "14 of 340 pairs fail" },
              { key: "Worst", value: "stop 10 Orchid dark control on raised = 2.89 (need 3)" },
              { key: "Also", value: "Aqua through Olive, every one the same pair" },
            ]}
          />

          <P>
            Every failure was the same pair: the outline on buttons and controls, against
            the raised surface in dark mode, which has a floor of 3:1. Fourteen of the
            seventeen themes drifted under it, and Teal is listed at 3.00 only because the
            report rounds to two places. Nobody would have seen it in a screenshot. Solving
            for luminance, with that small margin, put every one back over the line.
          </P>

          <SpecBlock
            title="Control on raised, dark mode"
            note="lightness fixed → luminance solved, need 3.00"
            rows={CONTROL_ON_RAISED.map((r) => ({
              key: r.stop,
              value: `${r.fixed} → ${r.solved}`,
            }))}
          />

          <P>
            The same script runs before every build. <code className="font-mono text-[0.9em] text-type">npm run build</code> is{" "}
            <code className="font-mono text-[0.9em] text-type">themes.mjs --check</code> and then <code className="font-mono text-[0.9em] text-type">next build</code>: it generates all
            seventeen themes again, checks every pair, and exits with an error if a single
            one is under WCAG AA, which stops the build before it starts. When everything
            passes, it prints one line:
          </P>

          <SpecBlock
            title="npm run build"
            note="every build"
            rows={[{ key: "themes", value: "17 themes, 340 pairs, all clear WCAG AA" }]}
          />

          <P>
            It checks three more things per theme that aren’t in the 340: the type sitting on
            the highlighter, and the paper and ink of the drawings, which change color with
            everything else.
          </P>

          <Pull>
            A check that only runs when I remember to run it is a check that doesn’t run.
          </Pull>

          <H2>A browser that remembers every bug</H2>

          <P>
            Lint and the build catch type errors and broken imports. They don’t catch a
            menu that traps your keyboard, because that compiles perfectly. So{" "}
            <code className="font-mono text-[0.9em] text-type">scripts/check-behavior.mjs</code> opens the site in a real Chrome, through
            Playwright, at laptop and phone sizes, and does what a person would: taps, tabs,
            presses Escape, turns JavaScript off.
          </P>

          <P>
            Every check in it is a bug that actually shipped and got fixed. If one comes
            back, the script fails. Anything that has never been seen to fail isn’t in
            there, and neither are speed numbers, which change with the network and would
            make it fail for no reason.
          </P>

          <Bullets
            items={[
              <>
                <strong className="font-semibold text-type">Stickers.</strong> On a phone, a
                tap used to latch a sticker open for good, and several could stack up over
                the text. Now a second tap closes it, and only one is ever open.
              </>,
              <>
                <strong className="font-semibold text-type">The ⌘K menu.</strong> Tab used to
                walk straight out of it onto the page behind, and Escape only worked from the
                search box. Now forty presses of Tab stay inside, and Escape closes it from
                anywhere.
              </>,
              <>
                <strong className="font-semibold text-type">The sidebar on a phone.</strong>{" "}
                Closed, it sat off-screen with nine links still reachable by keyboard and no
                visible focus. Now closed means unreachable.
              </>,
              <>
                <strong className="font-semibold text-type">The drawn cursor.</strong> The
                worst one. The stylesheet hid the normal pointer whether or not the drawn one
                had loaded, so with slow or blocked JavaScript a desktop visitor had no
                pointer at all. Now every rule that hides it depends on the drawn one being
                there, and the switch that turns it off has to work and stick.
              </>,
              <>
                <strong className="font-semibold text-type">Analytics.</strong> The off
                button in the footer has to actually stop Google Analytics and clear its
                cookies, not just change its label. This one only runs against a production
                build, and says so when it skips.
              </>,
            ]}
          />

          <SpecBlock
            title="npm run check"
            note="a local run, November 2026"
            rows={[
              { key: "Passed", value: "All 18 checks" },
              { key: "Skipped", value: "analytics: opt-out (analytics is not enabled on this build)" },
            ]}
          />

          <H2>Where they run</H2>

          <P>
            Locally whenever I run them, and on GitHub on every push and pull request:
            lint, then the build with its color check, then the browser check. I’ll be
            straight about the limit. The site deploys to Vercel whether or not that passes,
            so it’s a signal rather than a gate. What it buys is that a fixed bug coming back
            shows up as a red mark on the exact commit that brought it back, instead of
            waiting for someone to notice.
          </P>

          <P>
            All of it is public:{" "}
            <a href={REPO} target="_blank" rel="noreferrer" className="draw-link text-type">
              github.com/dabomba9/dustinreed-portfolio
            </a>
            . The color generator is{" "}
            <a
              href={`${REPO}/blob/main/scripts/themes.mjs`}
              target="_blank"
              rel="noreferrer"
              className="draw-link text-type"
            >
              scripts/themes.mjs
            </a>{" "}
            and the browser check is{" "}
            <a
              href={`${REPO}/blob/main/scripts/check-behavior.mjs`}
              target="_blank"
              rel="noreferrer"
              className="draw-link text-type"
            >
              scripts/check-behavior.mjs
            </a>
            . Both explain themselves at the top, in more detail than this page.
          </P>
        </Column>
      </Wrap>
    </>
  );
}
