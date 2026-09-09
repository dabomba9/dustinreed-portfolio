import type { Metadata } from "next";
import Link from "next/link";
import { Wrap } from "@/components/prose";
import { caseStudies } from "@/content/projects";

/**
 * Without this file the 404 inherited the root layout's metadata, including
 * `alternates: { canonical: "/" }` - so every dead URL on the domain, and
 * every mistyped one, told a crawler it was the homepage rather than that it
 * was gone. `/work` is the case that made it obvious: the most guessable URL
 * on a portfolio, 404ing while claiming to be the index.
 *
 * `robots` here is the other half. A 404 should not be indexed on its own
 * account, and stating that is cheaper than hoping the status code is read.
 */
export const metadata: Metadata = {
  title: "Not found",
  description: "That page does not exist.",
  alternates: { canonical: undefined },
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section>
      <Wrap className="py-24 md:py-32">
        <p className="label text-accent">404</p>
        <h1 className="display mt-6 max-w-3xl text-[2.5rem] leading-[1.05] md:text-[4rem]">
          That page isn&rsquo;t here.
        </h1>
        <p className="mt-8 max-w-xl text-[1.0625rem] leading-relaxed text-soft">
          It may have been renamed. The case studies below are all of it, and
          the command palette will find anything else &mdash; press{" "}
          <kbd className="mx-0.5 border border-rule bg-raised px-1.5 py-0.5 text-type">
            &#8984;K
          </kbd>
          .
        </p>

        <ul className="mt-12 border-t border-type">
          {caseStudies.map((study) => (
            <li key={study.slug} className="border-b border-rule">
              <Link
                href={`/work/${study.slug}`}
                className="group grid grid-cols-[3rem_1fr] items-baseline gap-x-6 py-6 no-underline"
              >
                <span className="label text-mute">{study.number}</span>
                <span>
                  <span className="label block text-mute">{study.client}</span>
                  <span className="mt-1.5 block font-display text-xl font-bold tracking-tight text-type transition-colors group-hover:text-accent">
                    {study.title}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-12">
          <Link href="/" className="draw-link label text-type no-underline">
            Back to the index
          </Link>
        </p>
      </Wrap>
    </section>
  );
}
