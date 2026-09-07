/**
 * The canonical origin, resolved in the order the deploy actually knows it.
 *
 * 1. NEXT_PUBLIC_SITE_URL - set this once a real domain is pointed at the
 *    site. It wins over everything.
 * 2. VERCEL_PROJECT_PRODUCTION_URL - Vercel injects this at build time, so
 *    the very first deploy already has correct canonical URLs, Open Graph
 *    tags, sitemap and robots without anyone setting a variable by hand.
 * 3. localhost, for development.
 */
function resolve(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;

  return "http://localhost:3000";
}

export const SITE_URL = resolve();
