import type { ReactNode } from "react";
import Image from "next/image";

/* ---------------------------------------------------------------
   Shared building blocks. Every page on the site is assembled from
   these, so changing one here changes it everywhere.
   --------------------------------------------------------------- */

export function Wrap({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto max-w-5xl px-6 md:px-10 lg:px-14 ${className}`}>{children}</div>
  );
}

/** Narrow column for long-form reading. */
export function Column({ children }: { children: ReactNode }) {
  return <div className="mx-auto max-w-[38rem]">{children}</div>;
}

/** Turns a heading into a stable anchor. Must match scripts/nav slugs. */
export function slugify(text: string) {
  return text
    .replace(/[\u2018\u2019]/g, "")
    .replace(/[^a-zA-Z0-9\s-]/g, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .slice(0, 60);
}

/** A section heading that reads as an argument, not a phase name.
    Gets an id so the rail can track it and the palette can jump to it. */
export function H2({ children }: { children: ReactNode }) {
  const id = typeof children === "string" ? slugify(children) : undefined;
  return (
    <h2
      id={id}
      data-section={id}
      className="display mt-20 scroll-mt-28 text-2xl md:text-[2.25rem]"
    >
      {children}
    </h2>
  );
}

export function H3({ children }: { children: ReactNode }) {
  return (
    <h3 className="mt-12 font-display text-xl font-bold tracking-tight">
      {children}
    </h3>
  );
}

export function P({ children }: { children: ReactNode }) {
  return (
    <p className="mt-5 text-[1.0625rem] leading-[1.75] text-soft">{children}</p>
  );
}

/** Opening paragraph. Larger, darker, sets the stakes. */
export function Lead({ children }: { children: ReactNode }) {
  return (
    <p className="mt-8 text-xl leading-[1.6] text-type md:text-[1.375rem]">
      {children}
    </p>
  );
}

/** A highlighter swipe on a phrase that carries the point. */
export function Mark({ children }: { children: ReactNode }) {
  return <span className="mark">{children}</span>;
}

/** A line worth stopping on. Used sparingly, two or three per case study. */
export function Pull({ children }: { children: ReactNode }) {
  return (
    <blockquote className="my-14 border-l-4 border-edge pl-6">
      <p className="font-display text-2xl font-bold leading-[1.25] tracking-tight text-type md:text-[1.75rem]">
        {children}
      </p>
    </blockquote>
  );
}

export function Bullets({ items }: { items: ReactNode[] }) {
  return (
    <ul className="mt-6 space-y-3">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3.5 text-[1.0625rem] leading-[1.7] text-soft">
          <span aria-hidden className="mt-[0.55em] h-0.5 w-4 shrink-0 bg-edge" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** Image slot. Drop a file in /public/media and point at it. */
export function Figure({
  src,
  alt,
  caption,
  wide = false,
}: {
  src?: string;
  alt: string;
  caption?: string;
  wide?: boolean;
}) {
  // Until there is an image, the figure does not exist. A dashed "add image
  // here" box reads as unfinished; absence reads as a deliberate text layout.
  if (!src) return null;

  return (
    <figure className={`my-14 ${wide ? "md:-mx-24 lg:-mx-40" : ""}`}>
      <div className="rounded-sm border border-rule bg-raised p-2">
      <Image
        src={src}
        alt={alt}
        width={1600}
        height={1000}
        sizes="(min-width: 1024px) 900px, 100vw"
        className="h-auto w-full rounded-[2px]"
      />
      </div>
      {caption ? (
        <figcaption className="mt-3 text-sm leading-relaxed text-mute">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

/** The metadata block at the top of every case study. */
export function MetaGrid({
  items,
}: {
  items: { label: string; value: string }[];
}) {
  return (
    <dl className="mt-12 grid grid-cols-2 gap-x-8 gap-y-7 border-t border-rule pt-8 md:grid-cols-4">
      {items.map((item) => (
        <div key={item.label}>
          <dt className="label text-mute">{item.label}</dt>
          <dd className="mt-2 text-[0.95rem] leading-snug text-type">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Outcome numbers. Two tiers: what the business got, and how much was built. */
export function Results({
  items,
}: {
  items: { value: string; label: string }[];
}) {
  return (
    <div className="my-16 grid gap-px overflow-hidden rounded-sm border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="bg-raised px-6 py-8">
          <p className="font-display text-4xl font-extrabold tracking-tight text-accent">
            {item.value}
          </p>
          <p className="mt-2 text-sm leading-snug text-soft">{item.label}</p>
        </div>
      ))}
    </div>
  );
}

/** Section label used above headings, e.g. "The decision". */
export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="label mt-24 text-accent">{children}</p>;
}
