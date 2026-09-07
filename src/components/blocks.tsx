import type { ReactNode } from "react";

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
    <div className="my-12 overflow-x-auto rounded-sm border border-rule bg-ink p-7 md:p-9">
      <p className="label text-flame-lift">
        {title}
        {note ? <span className="ml-3 text-mute-lift">{note}</span> : null}
      </p>
      <dl className="mt-6 space-y-3.5">
        {rows.map((row) => (
          <div key={row.key} className="grid gap-1 sm:grid-cols-[11rem_1fr] sm:gap-4">
            <dt className="font-mono text-sm text-cream">{row.key}</dt>
            <dd className="font-mono text-sm leading-relaxed text-mute-lift">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/** Four small cards. Used for the Coqui vaults. */
export function CardGrid({
  items,
}: {
  items: { title: string; stat: string; body: string }[];
}) {
  return (
    <div className="my-12 grid gap-px overflow-hidden rounded-sm border border-rule bg-rule sm:grid-cols-2">
      {items.map((item) => (
        <div key={item.title} className="bg-paper p-7">
          <h3 className="font-display text-lg font-bold tracking-tight text-ink">
            {item.title}
          </h3>
          <p className="label mt-2 text-flame">{item.stat}</p>
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
        <div key={item.name} className="bg-paper p-7 md:p-8">
          <h3 className="font-display text-xl font-bold tracking-tight text-ink">
            {item.name}
          </h3>
          <p className="label mt-2 text-flame">{item.claim}</p>
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
          <span className="label text-flame">
            {String(i + 1).padStart(2, "0")}
          </span>
          <span className="font-display text-base font-bold tracking-tight text-ink">
            {item.name}
          </span>
          <span className="text-[0.95rem] leading-relaxed text-soft">{item.body}</span>
        </li>
      ))}
    </ol>
  );
}
