# Dustin Reed — portfolio

Next.js 16, Tailwind v4, TypeScript. Static, no database, no CMS.

The site is built as an interface rather than a document: a persistent index
rail, a command palette, keyboard navigation, scroll tracking and a status bar.
That is the argument for the headline — a portfolio that behaves like a product
can only be built by someone who ships code.

## Run it

    npm install
    npm run dev

Then open http://localhost:3000

## Keyboard

    ⌘K / Ctrl+K   command palette (pages, sections, live sites, contact)
    /             same thing
    j / k         next / previous case study
    g             back to the index
    ?             shortcuts panel, and the switches for single-key
                  shortcuts and the drawn cursor
    esc           close

## Where things are

    src/app/page.tsx                          index
    src/app/about/page.tsx                    about
    src/app/work/curbnturf/page.tsx           case study 01
    src/app/work/coqui-cardboard/page.tsx     case study 02
    src/app/work/infocon-lrs/page.tsx         case study 03

    src/content/projects.ts     card copy, metrics and links
    src/content/nav.ts          the index the rail and palette read from
    src/components/app-shell.tsx  rail, status bar, keyboard
    src/components/command-palette.tsx
    src/components/work-index.tsx  the index + detail pane on the homepage
    src/components/prose.tsx       the blocks every case study is built from
    src/app/globals.css            colors, fonts, motion

## Editing text

Copy lives directly in the page files as plain text between tags. Change the
words, save, the browser reloads.

If you add, remove or reword an `<H2>` in a case study, regenerate the index so
the rail and palette match:

    npm run nav

## Images and clips

Put files in public/media and point at them from the page. A `<Figure />`
without a `src` renders nothing at all, so a missing image reads as a text
layout rather than a hole. Clips, illustrations and how to regenerate them are
in public/media/README.md.

## Résumé

scripts/resume/resume.html is the source; public/dustin-reed-resume.pdf is
printed from it with `npm run resume`, in the site's own fonts and light
palette. Edit the HTML, never the PDF.

It carries no phone number on purpose: the file is public at a guessable URL
and gets scraped. The PDF is also served `noindex` (see next.config.ts), so a
flat file does not outrank the case studies.

## Fonts

Self-hosted variable woff2 in src/fonts. No Google Fonts request at runtime.

## Checks

    npm run lint
    npm run build      also audits every theme colour pair against WCAG AA,
                       and fails the build if one drops below
    npm run check      drives the site in Chrome and fails if a fixed bug is back

`npm run check` covers the things lint and build cannot see: the sticker tap
toggle, focus staying inside the command palette, the closed mobile rail being
inert, and the drawn cursor never hiding the native pointer when JavaScript has
not run. It starts its own dev server if nothing is on port 3000, and needs
Google Chrome or Chromium installed. To run it against the live site:

    CHECK_ORIGIN=https://www.dustinreed.co npm run check

The analytics opt-out checks only run where analytics is on, which is
production builds with a measurement ID (see `ANALYTICS_ID` in
src/lib/site.ts). Everywhere else they report as skipped. To test them
locally, build and serve production with a dummy ID:

    VERCEL_ENV=production NEXT_PUBLIC_GA_ID=G-TEST000000 npm run build
    VERCEL_ENV=production NEXT_PUBLIC_GA_ID=G-TEST000000 npx next start -p 3100
    CHECK_ORIGIN=http://localhost:3100 npm run check

Those checks abort every request to Google, and every other check runs with
analytics switched off, so running the suite against the live site never counts
as a visit.

All three run in GitHub Actions on every push to main. A red X there means a
push broke one of them; it does not stop the deploy.

## Analytics

Google Analytics loads for every visitor, on production only, once there is a
measurement ID in src/lib/site.ts. There is no consent banner. Visitors can
switch it off in two places: the line at the bottom of the homepage, and the
`?` panel. The homepage one matters most, because the `?` panel can't be
reached on a phone. Switching off sets Google's opt-out flag and deletes the
`_ga` cookies, not just the remembered choice.

GA records page views and outbound links by itself. The site adds its own
events on top, named so each reads back without a filter:

    email_contact    the email address copied or clicked
    resume_open      the résumé opened
    profile_link     LinkedIn, GitHub or The Tink Tank, with which page
    case_live_link   a case study's live-site link
    work_open        a Selected work item opened

Each goes through `track()` in src/lib/analytics.ts, which does nothing when
a visitor has switched analytics off or it isn't on the page.

## Regenerating things

    npm run nav        after changing an <H2> in a case study
    npm run themes     after changing a colour in globals.css; rewrites
                       src/app/themes.css, refusing any theme that fails
    npm run icon       after changing public/media/dustin-portrait-line.png;
                       rewrites the favicons in src/app
    npm run resume     after editing scripts/resume/resume.html; prints it
                       to public/dustin-reed-resume.pdf through Chrome
    python3 scripts/art-masks.py
                       after changing a two-tone illustration; see
                       public/media/README.md

## Deploy

Push to main. Vercel builds and deploys it on its own, and GitHub Actions
runs the checks alongside.

Nothing to set first. The canonical origin resolves itself in src/lib/site.ts:
the real domain on Vercel production, the deployment's own URL on previews,
localhost in development. Everything that names the site by its full URL reads
it — canonical tags, share cards, the sitemap, robots.txt.

To point at a different domain, set `NEXT_PUBLIC_SITE_URL` (see .env.example).
It wins over everything and needs no code change. The production domain itself
is the one constant in that file.
