/**
 * The canonical origin.
 *
 * Everything that has to name the site by its full URL reads this: the
 * canonical tags, the Open Graph and Twitter cards, the sitemap and
 * robots.txt. Getting it wrong is quiet - the pages still render, the
 * share cards just point at the wrong place.
 *
 * Resolved in the order the deploy actually knows it:
 *
 * 1. NEXT_PUBLIC_SITE_URL, if it is ever set. An escape hatch, so the
 *    origin can be changed without a code change.
 * 2. The real domain, on Vercel production builds only.
 * 3. The deployment's own URL, on Vercel preview builds, so a preview
 *    never claims to be the live site and never asks Google to index
 *    itself under the production domain.
 * 4. localhost, for development.
 */
function resolve(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");

  if (process.env.VERCEL_ENV === "production") {
    return "https://www.dustinreed.co";
  }

  const deployment =
    process.env.VERCEL_BRANCH_URL || process.env.VERCEL_URL;
  if (deployment) return `https://${deployment}`;

  return "http://localhost:3000";
}

export const SITE_URL = resolve();

/**
 * The one place these live.
 *
 * Both profile URLs were hardcoded in three files - the footer, the command
 * palette, and now the Person schema - and a fourth copy is how a portfolio
 * ends up linking a LinkedIn account it no longer uses.
 */
export const PROFILES = {
  linkedin: "https://www.linkedin.com/in/dreeddesign/",
  github: "https://github.com/dabomba9",
} as const;

export const EMAIL = "dr33d9@gmail.com";

/**
 * The Google Analytics measurement ID. Not a secret - it is in the page
 * source of every site that runs GA - so it lives here with the other
 * identity constants. Setting it to null switches analytics off everywhere,
 * footer line and ? switch included - never a placeholder, which would load
 * Google for real visitors on behalf of an ID that goes nowhere.
 */
const GA_MEASUREMENT_ID: string | null = "G-WJF9NR27PV";

/**
 * Whether analytics exists on this build, and under which ID.
 *
 * Production only. Previews, dev and CI never load it, so the numbers are
 * visitors rather than me clicking around a branch. NEXT_PUBLIC_GA_ID wins
 * over the constant, the same escape hatch NEXT_PUBLIC_SITE_URL is above -
 * which is also how a local production build gets tested with a dummy ID.
 *
 * Resolved here, on the server, and handed down as a prop. VERCEL_ENV is not
 * exposed to client bundles, so a client component asking for itself would
 * always get undefined and quietly turn analytics off everywhere.
 */
export const ANALYTICS_ID: string | null =
  process.env.VERCEL_ENV === "production"
    ? process.env.NEXT_PUBLIC_GA_ID || GA_MEASUREMENT_ID
    : null;

/**
 * Shared so the homepage description cannot drift between the three places
 * that state it - metadata, Open Graph and the X card each had their own
 * copy, and the X one had already lost a clause.
 */
export const HOME_DESCRIPTION =
  "Founding designer at CurbNTurf since 2018. Brand, product, web and native apps, and the production front end. I build the LLM and RAG systems underneath too.";
