import Link from "next/link";
import { Wrap, MetaGrid } from "@/components/prose";

export default function CaseHero({
  number,
  client,
  title,
  dek,
  meta,
  live,
}: {
  number: string;
  client: string;
  title: string;
  dek: string;
  meta: { label: string; value: string }[];
  live?: { label: string; href: string };
}) {
  return (
    <section className="border-b border-rule">
      <Wrap className="py-16 md:py-24">
        <div className="flex items-baseline gap-4">
          <span className="label text-accent">{number}</span>
          <span className="label text-mute">{client}</span>
        </div>

        <h1 className="display mt-7 max-w-5xl text-[3rem] sm:text-7xl md:text-[5.5rem]">
          {title}
        </h1>

        <p className="mt-8 max-w-2xl text-lg leading-[1.65] text-soft md:text-xl">{dek}</p>

        {live ? (
          <a
            href={live.href}
            target="_blank"
            rel="noreferrer"
            className="label mt-8 inline-flex items-center gap-2 text-type no-underline transition-colors hover:text-accent"
          >
            {live.label}
            <span aria-hidden>&#8599;</span>
          </a>
        ) : null}

        <MetaGrid items={meta} />
      </Wrap>
    </section>
  );
}

export function CaseFooter({
  credits,
  next,
}: {
  credits: { name: string; role: string }[];
  next: { slug: string; client: string; title: string };
}) {
  return (
    <Wrap className="mt-24">
      <div className="border-t border-rule pt-10">
        <p className="label text-mute">Team</p>
        <ul className="mt-5 space-y-2.5">
          {credits.map((c) => (
            <li key={c.name} className="text-[1.0625rem] leading-relaxed text-soft">
              <span className="font-medium text-type">{c.name}</span> &mdash; {c.role}
            </li>
          ))}
        </ul>
      </div>

      <Link
        href={`/work/${next.slug}`}
        className="group mt-20 block border-t border-type pt-10 no-underline"
      >
        <p className="label text-mute">Next case study</p>
        <p className="label mt-4 text-accent">{next.client}</p>
        <p className="display mt-3 max-w-3xl text-[2.25rem] transition-colors group-hover:bg-mark md:text-[3.75rem]">
          {next.title}
        </p>
      </Link>
    </Wrap>
  );
}
