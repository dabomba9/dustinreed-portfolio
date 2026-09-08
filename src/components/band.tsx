import type { ReactNode } from "react";

/**
 * A full-bleed inversion. Rendered as a SIBLING of <Wrap>, never inside it —
 * that is what lets it span the content pane instead of the centred column.
 * The ink ground is the visual interruption an image would otherwise provide,
 * which is why this layout survives having no screenshots yet.
 */
export default function Band({
  kicker,
  children,
  size = "lg",
  facts,
}: {
  kicker: string;
  children: ReactNode;
  size?: "lg" | "md";
  facts?: { label: string; value: string }[];
}) {
  return (
    <section className="plate my-14 bg-ground px-6 py-16 md:my-16 md:px-10 md:py-20 lg:px-14">
      <div className="mx-auto max-w-5xl">
        <p className="label text-accent">{kicker}</p>
        <p
          className={`display mt-6 text-type ${
            size === "lg"
              ? "max-w-[24ch] text-[2.5rem] md:text-[4.5rem]"
              : "max-w-[30ch] text-[2rem] md:text-[3.5rem]"
          }`}
        >
          {children}
        </p>

        {facts ? (
          <dl className="mt-12 grid max-w-3xl grid-cols-1 gap-8 border-t border-rule pt-6 sm:grid-cols-3">
            {facts.map((f) => (
              <div key={f.label}>
                <dt className="label text-mute">{f.label}</dt>
                <dd className="mt-2 text-[0.95rem] leading-snug text-type">{f.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </div>
    </section>
  );
}
