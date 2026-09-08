import Image from "next/image";
import WorkIndex from "@/components/work-index";
import PuertoRico from "@/components/puerto-rico";
import CopyEmail from "@/components/copy-email";
import { Mark, Wrap } from "@/components/prose";
import { caseStudies, selectedWork } from "@/content/projects";

export default function Home() {
  return (
    <>
      {/* ---------------------------------------------------------------
          The 30 second gate. Six words, then the proof.
          --------------------------------------------------------------- */}
      <section className="border-b border-rule">
        <Wrap className="py-20 md:py-32">
          {/* Identity sits on the eyebrow line, right aligned, so the headline
              below keeps the full measure. Putting the portrait in a column
              beside the h1 cost it 250px and broke the two line break. */}
          <div className="flex flex-col-reverse items-start justify-between gap-8 sm:flex-row sm:items-start">
            <p className="label text-accent sm:pt-2">
              Founding designer &middot; 7 years on one product
            </p>

            {/* The drawing is black ink on transparency, so the lime reads
                through the face as its own negative space. */}
            <figure className="flex shrink-0 flex-col items-start gap-3 sm:items-end">
              <div className="size-28 overflow-hidden rounded-full bg-solid sm:size-32 lg:size-36">
                <Image
                  src="/media/dustin-portrait.png"
                  alt="Illustrated portrait of Dustin Reed in a flat brim cap"
                  width={512}
                  height={512}
                  priority
                  className="size-full object-contain"
                />
              </div>
              <figcaption className="label flex items-center gap-2 text-mute">
                <PuertoRico className="h-6 w-auto shrink-0 text-accent" />
                San Juan, Puerto Rico
              </figcaption>
            </figure>
          </div>

          <h1 className="display mt-10 text-[3rem] leading-[0.92] sm:text-6xl md:text-[5rem] lg:text-[5.75rem]">
            I design products
            <br />
            and <Mark>ship the code.</Mark>
          </h1>

          <p className="mt-10 max-w-2xl text-lg leading-[1.65] text-soft md:text-xl">
            Founding designer at{" "}
            <a
              href="https://www.curbnturf.com"
              target="_blank"
              rel="noreferrer"
              className="text-type underline decoration-edge/40 decoration-2 transition-colors hover:decoration-edge"
            >
              CurbNTurf
            </a>
            . I built the brand, the product, the website and two native apps out of
            nothing in 2018, and seven years later I&rsquo;m still designing it, and now
            writing backend too.
          </p>

          <p className="label mt-10 text-mute">
            Press <Key>&#8984;K</Key> to search, <Key>j</Key> and <Key>k</Key> to move
            through the work
          </p>
        </Wrap>
      </section>

      {/* ---------------------------------------------------------------
          Work, as an index. Hover raises a preview.
          --------------------------------------------------------------- */}
      <section>
        <Wrap className="pt-20 md:pt-24">
          <div className="flex items-baseline justify-between gap-6 pb-5">
            <h2 className="display text-2xl md:text-3xl">Case studies</h2>
            <p className="label text-mute">{caseStudies.length} of them</p>
          </div>

          <WorkIndex studies={caseStudies} />
        </Wrap>
      </section>

      {/* ---------------------------------------------------------------
          Second tier. Range and volume, kept clearly separate.
          --------------------------------------------------------------- */}
      <section className="mt-24">
        <Wrap>
          <div className="flex items-baseline justify-between gap-6 border-b border-type pb-5">
            <h2 className="display text-2xl md:text-3xl">Selected work</h2>
            <p className="label text-mute">All live</p>
          </div>

          <ul>
            {selectedWork.map((item) => (
              <li key={item.name} className="border-b border-rule">
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group grid gap-2 py-7 no-underline md:grid-cols-[14rem_1fr] md:gap-10"
                >
                  <span className="flex items-center gap-2">
                    <span className="draw-link font-display text-lg font-bold tracking-tight text-type transition-colors group-hover:text-accent">
                      {item.name}
                    </span>
                    <span
                      aria-hidden
                      className="text-mute opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100"
                    >
                      &#8599;
                    </span>
                  </span>
                  <span className="max-w-2xl text-[1.0625rem] leading-relaxed text-soft">
                    {item.line}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </Wrap>
      </section>

      {/* ---------------------------------------------------------------
          Close. One ask, stated plainly.
          --------------------------------------------------------------- */}
      <section className="mt-28">
        <Wrap>
          <div className="border-t border-type pt-14">
            <p className="label text-accent">What I&rsquo;m looking for</p>
            <p className="display mt-6 max-w-3xl text-3xl md:text-[3.25rem]">
              A team that needs one person to take something from brand all the way
              through to shipped code.
            </p>
            <p className="mt-8 max-w-xl text-[1.0625rem] leading-relaxed text-soft">
              Product design, design leadership and design engineering roles, at any size
              company. Fully remote with US companies. I&rsquo;m in Puerto Rico, which is a
              US territory, so there&rsquo;s no visa or sponsorship involved.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
              <CopyEmail className="font-display text-2xl font-extrabold tracking-tight text-accent underline decoration-edge/30 decoration-2 underline-offset-[6px] transition-colors hover:decoration-edge md:text-4xl" />
              <a
                href="https://www.linkedin.com/in/dreeddesign/"
                target="_blank"
                rel="noreferrer"
                className="draw-link label text-soft no-underline transition-colors hover:text-accent"
              >
                LinkedIn &#8599;
              </a>
              <a
                href="https://thetinktank.com"
                target="_blank"
                rel="noreferrer"
                className="draw-link label text-soft no-underline transition-colors hover:text-accent"
              >
                The Tink Tank &#8599;
              </a>
            </div>

            <p className="label mt-16 text-mute">
              This site is hand built in Next.js. So is everything above.
            </p>
          </div>
        </Wrap>
      </section>
    </>
  );
}

function Key({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="mx-0.5 border border-rule bg-raised px-1.5 py-0.5 text-type">
      {children}
    </kbd>
  );
}
