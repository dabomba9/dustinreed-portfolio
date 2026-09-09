import type { ReactNode } from "react";

import InlineSticker from "@/components/inline-sticker";

/** Monospace spec panel. Used where the content really is a spec. */
export function SpecBlock({
  title,
  note,
  rows,
}: {
  title: string;
  note?: string;
  rows: { key: string; value: string }[];
}) {
  return (
    <div className="plate my-12 overflow-x-auto rounded-sm border border-rule bg-ground p-7 md:p-9">
      <p className="label text-accent">
        {title}
        {note ? <span className="ml-3 text-mute">{note}</span> : null}
      </p>
      <dl className="mt-6 space-y-3.5">
        {rows.map((row) => (
          <div key={row.key} className="grid gap-1 sm:grid-cols-[11rem_1fr] sm:gap-4">
            <dt className="font-mono text-sm text-type">{row.key}</dt>
            <dd className="font-mono text-sm leading-relaxed text-mute">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/**
 * Four small cards. Used for the Coqui vaults.
 *
 * A card can carry a sticker, which pops out of its title on hover the same
 * way the ones on the About page do. Note the grid does NOT clip: the sticker
 * sits above the card it belongs to and would be cut in half by the
 * overflow-hidden that used to round these corners. The 2px radius is now
 * carried by the border alone, which nobody will ever notice, and the sticker
 * gets to leave the box.
 */
export function CardGrid({
  items,
}: {
  items: {
    title: string;
    stat: string;
    body: string;
    sticker?: { src: string; width: number; height: number; size?: string; tilt?: number };
  }[];
}) {
  return (
    <div className="my-12 grid gap-px rounded-sm border border-rule bg-rule sm:grid-cols-2">
      {items.map((item) => (
        <div key={item.title} className="bg-raised p-7">
          <h3 className="font-display text-lg font-bold tracking-tight text-type">
            {item.sticker ? (
              <InlineSticker {...item.sticker}>{item.title}</InlineSticker>
            ) : (
              item.title
            )}
          </h3>
          <p className="label mt-2 text-accent">{item.stat}</p>
          <p className="mt-3 text-[0.95rem] leading-relaxed text-soft">{item.body}</p>
        </div>
      ))}
    </div>
  );
}

/** Two things placed side by side so the difference is the point. */
export function Compare({
  items,
}: {
  items: { name: string; claim: string; body: ReactNode }[];
}) {
  return (
    <div className="my-12 grid gap-px overflow-hidden rounded-sm border border-rule bg-rule md:grid-cols-2">
      {items.map((item) => (
        <div key={item.name} className="bg-raised p-7 md:p-8">
          <h3 className="font-display text-xl font-bold tracking-tight text-type">
            {item.name}
          </h3>
          <p className="label mt-2 text-accent">{item.claim}</p>
          <div className="mt-4 space-y-3 text-[0.95rem] leading-relaxed text-soft">
            {item.body}
          </div>
        </div>
      ))}
    </div>
  );
}

/** Numbered strip. Used for the four sites Coqui was part of. */
export function NumberedList({
  items,
}: {
  items: { name: string; body: string }[];
}) {
  return (
    <ol className="my-12 space-y-0">
      {items.map((item, i) => (
        <li
          key={item.name}
          className="grid gap-1 border-t border-rule py-5 sm:grid-cols-[3rem_12rem_1fr] sm:gap-6 last:border-b"
        >
          <span className="label text-accent">
            {String(i + 1).padStart(2, "0")}
          </span>
          <span className="font-display text-base font-bold tracking-tight text-type">
            {item.name}
          </span>
          <span className="text-[0.95rem] leading-relaxed text-soft">{item.body}</span>
        </li>
      ))}
    </ol>
  );
}
