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
