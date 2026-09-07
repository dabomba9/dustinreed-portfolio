import type { ReactNode } from "react";

/**
 * The rarest content on the site given a type.
 *
 * Every case study already contains a section where the decision went badly
 * or the argument was lost — almost no portfolio has one at all. Giving it a
 * consistent treatment is the cheapest way to make the site look like nobody
 * else's, and it is differentiated by what it says rather than by decoration.
 */
export default function WrongBlock({
  label,
  claim,
  children,
}: {
  label: string;
  claim: string;
  children: ReactNode;
}) {
  return (
    <aside
      aria-label={label}
      className="my-14 border-t-4 border-edge pt-6"
    >
      <div className="grid gap-6 md:grid-cols-[10rem_1fr] md:gap-8">
        <p className="label leading-relaxed text-accent">{label}</p>
        <div>
          <p className="display max-w-[24ch] text-2xl leading-[1.15] md:text-[2rem]">
            {claim}
          </p>
          <div className="mt-6 space-y-4 text-[1.0625rem] leading-[1.7] text-soft">
            {children}
          </div>
        </div>
      </div>
    </aside>
  );
}
