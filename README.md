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
    ?             shortcuts panel
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

## Images

Put files in public/media, then give a `<Figure />` a `src`. See
public/media/README.md. Every Figure without a src renders a labelled
placeholder, so nothing looks broken while you gather them.

## Fonts

Self-hosted variable woff2 in src/fonts. No Google Fonts request at runtime.

## Deploy

    npx vercel

Nothing to set first. The canonical origin resolves itself in src/lib/site.ts:
the real domain on Vercel production, the deployment's own URL on previews,
localhost in development. Everything that names the site by its full URL reads
it — canonical tags, share cards, the sitemap, robots.txt.

To point at a different domain, set `NEXT_PUBLIC_SITE_URL` (see .env.example).
It wins over everything and needs no code change. The production domain itself
is the one constant in that file.
