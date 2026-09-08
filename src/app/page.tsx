import WorkIndex from "@/components/work-index";
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
          <p className="label text-accent">
            Founding designer &middot; 7 years on one product
          </p>

          <h1 className="display mt-8 text-[3.5rem] sm:text-7xl md:text-[5.75rem] lg:text-[6.75rem]">
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

          {/* Keyboard only. On a phone this is the third thing a visitor reads
              and it describes something they cannot do. */}
          <p className="label mt-10 hidden text-mute md:block">
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

          {/* This used to be three lines of 18px text under a section that
              carries a playing video, which made it read as the work I had
              not got around to writing up. The names now carry the same
              weight as a case study title, and what I did on each one is
              structured instead of buried in the sentence. */}
          <ul>
            {selectedWork.map((item) => (
              <li key={item.name} className="border-b border-rule">
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group grid gap-x-10 gap-y-4 py-9 no-underline md:grid-cols-[1fr_1.05fr] md:py-11"
                >
                  <span className="min-w-0">
                    <span className="display block text-[2rem] text-type transition-colors group-hover:text-accent md:text-[2.75rem]">
                      {item.name}
                    </span>
                    <span className="label mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-mute">
                      <span className="text-type">{item.when}</span>
                      {item.role.map((r) => (
                        <span key={r} className="flex items-center gap-2">
                          <span aria-hidden className="text-rule">
                            /
                          </span>
                          {r}
                        </span>
                      ))}
                    </span>
                    <span className="label mt-5 flex items-center gap-2 text-type transition-colors group-hover:text-accent">
                      <span className="draw-link">{item.domain}</span>
                      <span
                        aria-hidden
                        className="transition-transform group-hover:translate-x-0.5"
                      >
                        &#8599;
                      </span>
                    </span>
                  </span>

                  <span className="max-w-xl text-[1.0625rem] leading-relaxed text-soft">
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
      <footer className="mt-28">
        <Wrap>
          <div className="border-t border-type pt-14">
            <p className="label text-accent">What I&rsquo;m looking for</p>
            <p className="display mt-6 max-w-3xl text-[2.25rem] md:text-[4rem]">
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
                className="draw-link label inline-flex items-center py-3 -my-3 text-soft no-underline transition-colors hover:text-accent"
              >
                LinkedIn &#8599;
              </a>
              <a
                href="https://thetinktank.com"
                target="_blank"
                rel="noreferrer"
                className="draw-link label inline-flex items-center py-3 -my-3 text-soft no-underline transition-colors hover:text-accent"
              >
                The Tink Tank &#8599;
              </a>
            </div>

            <p className="label mt-16 text-mute">
              This site is hand built in Next.js. So is everything above.
            </p>
          </div>
        </Wrap>
      </footer>
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
