import Link from "next/link";
import { Wrap } from "@/components/prose";

/**
 * Direction C. The app chrome recedes here and returns inside case studies,
 * where a reader is already engaged. The argument for it: the rail and status
 * bar read as an IC craft signal, which helps for design-engineering roles and
 * works against a head-of-design read — and they spend ~300px of horizontal
 * space on navigation rather than on the work.
 */
export default function HeroEditorial() {
  return (
    <section className="flex min-h-[88vh] flex-col border-b border-rule">
      <div className="flex items-center justify-between border-b border-rule px-6 py-6 md:px-14">
        <span className="font-display text-base font-extrabold tracking-tight">Dustin Reed</span>
        <div className="flex items-center gap-7">
          <Link href="#work" className="draw-link label text-soft no-underline">
            Work
          </Link>
          <Link href="/about" className="draw-link label text-soft no-underline">
            About
          </Link>
          <a
            href="mailto:dr33d9@gmail.com"
            className="label border border-ink px-3 py-2 no-underline transition-colors hover:border-edge hover:text-accent"
          >
            Email
          </a>
        </div>
      </div>

      <Wrap className="flex flex-1 flex-col justify-center py-20">
        <p className="label text-accent">Founding designer &middot; San Juan, Puerto Rico</p>
        <h1 className="display mt-7 max-w-[13ch] text-[3.5rem] sm:text-7xl md:text-[7rem] lg:text-[7.75rem]">
          I design products and ship the code.
        </h1>
        <p className="mt-9 max-w-[52ch] text-lg leading-[1.65] text-soft md:text-xl">
          Founding designer at CurbNTurf. Brand, product, two native apps and the front end,
          built out of nothing in 2018 and still mine seven years later.
        </p>
      </Wrap>

      <Wrap className="flex flex-wrap items-baseline justify-between gap-4 pb-10">
        <span className="label text-mute">Three case studies below</span>
        <span className="label text-mute">500+ hosts &middot; 2 native apps &middot; 7 years</span>
      </Wrap>
    </section>
  );
}
