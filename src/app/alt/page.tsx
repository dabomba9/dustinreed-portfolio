import WorkIndex from "@/components/work-index";
import HeroEditorial from "@/components/hero-editorial";
import CopyEmail from "@/components/copy-email";
import { Wrap } from "@/components/prose";
import { caseStudies, selectedWork } from "@/content/projects";

export default function AltHome() {
  return (
    <>
      <HeroEditorial />


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
          <div className="flex items-baseline justify-between gap-6 border-b border-ink pb-5">
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
                    <span className="draw-link font-display text-lg font-bold tracking-tight text-ink transition-colors group-hover:text-accent">
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
          <div className="border-t border-ink pt-14">
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

