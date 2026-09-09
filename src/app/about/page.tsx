import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import { Wrap, Column, P, Lead, Pull } from "@/components/prose";
import CopyEmail from "@/components/copy-email";
import InlineSticker from "@/components/inline-sticker";

export const metadata: Metadata = pageMeta({
  title: "About",
  description:
    "Founding designer. Brand, product and front end. Seven years on the same product, now working into the backend.",
  path: "/about",
});

export default function About() {
  return (
    <>
      <section className="border-b border-rule">
        <Wrap className="py-20 md:py-28">
          <p className="label text-accent">About</p>
          <h1 className="display mt-7 max-w-4xl text-[3.25rem] sm:text-7xl md:text-[5.5rem]">
            Most designers never find out what their decisions cost.
          </h1>
        </Wrap>
      </section>

      <Wrap className="py-20 md:py-24">
        <Column>
          <Lead>
            Founding designer. I build the brand, design the product, and write the front
            end that ships it.
          </Lead>

          <P>
            In December 2018 I joined CurbNTurf as one of three people. A founder, a
            developer, and me. There was a platform that barely worked and no visual
            identity at all. I built the brand, the product, the website, and two native
            apps. Today it&rsquo;s 500+ hosts with published listings and a 4.8 host
            rating, and I&rsquo;m still designing it seven years later, now working into
            the backend.
          </P>

          <Pull>
            I&rsquo;ve had to keep using my own decisions, and rebuild the ones that turned
            out wrong.
          </Pull>

          <P>
            That&rsquo;s the part I&rsquo;d point at. Seven years living inside my own work,
            watching which calls held up and which ones quietly made someone else&rsquo;s
            job harder. It changes what you reach for.
          </P>

          <P>
            I design and I build. Early on I moved our work into Webflow so developers got
            working code instead of a mockup and a conversation. These days it is Figma to
            design, production Next.js and React to ship, with design systems, iOS and
            Android along the way. That keeps the distance between &ldquo;this should
            change&rdquo; and &ldquo;it&rsquo;s live&rdquo; short, which is most of what a
            small team actually needs. AI tooling is part of the working day now, not a
            novelty I am trying out.
          </P>

          <P>
            The Tink Tank is my studio. It has run since 2018, alongside the day job, for
            clients across SaaS, healthcare, retail and commerce, from Fortune 500
            companies down to two person startups. The one I would show you first is a
            large print book manufacturer: two brand identities, and a quoting and
            checkout system that sells into school districts and state contracts. Growth
            has doubled since it launched.
          </P>

          <Pull>
            There&rsquo;s a thread through most of it. Large, messy catalogs, and the person
            who has to find one thing inside them.
          </Pull>

          <P>
            Five hundred pieces of private land. Twelve thousand sports cards. A
            publisher&rsquo;s full catalog, browsed by a librarian who knows exactly what her
            collection is missing. Search, taxonomy, hierarchy, and the difference between
            browsing and already knowing what you want. I didn&rsquo;t plan that. I noticed
            it after the fact, which is usually how the real ones show up.
          </P>

          <Pull>
            The first design I ever paid attention to was printed on cardboard and sold
            in a foil pack.
          </Pull>

          <P>
            I collected{" "}
            <InlineSticker
              src="/media/mj-sticker.png"
              width={516}
              height={900}
              size="7rem"
              tilt={4}
            >
              Michael Jordan
            </InlineSticker>{" "}
            in the nineties, which is when the card companies
            got strange. Foil, die cuts, printing on plastic, techniques nobody needed for
            a photograph of a basketball player. I did not have the word design yet. I
            knew some of them were better than the others and I wanted to know why. Coqui
            Cardboard is that question again, with a build pipeline.
          </P>

          <P>
            Architecture was the second one. I studied architecture, then civil
            engineering, and took longer than I should have to notice that the part I
            liked was the same part in both.{" "}
            <InlineSticker
              src="/media/mcm-house.png"
              width={1000}
              height={260}
              size="15rem"
              tilt={-2.5}
            >
              Mid century houses
            </InlineSticker>{" "}
            are still my favorite thing to look at, and the same period pulled me toward
            its designers. Paul Rand,
            Charles and Ray Eames, Saul Bass, Massimo Vignelli, Milton Glaser. There
            are{" "}
            <InlineSticker
              src="/media/eames-elephant.png"
              width={880}
              height={662}
            >
              Eames pieces
            </InlineSticker>{" "}
            in my office I probably should not have bought.
          </P>

          <P>
            I live in San Juan because my wife Lorena is Boricua and her parents are
            getting older. We wanted to be close enough to help, and we are looking for a
            house here while we settle in.
          </P>

          <P>
            <InlineSticker
              src="/media/coqui-taino.png"
              width={760}
              height={797}
              size="8rem"
              tilt={-3}
            >
              Puerto Rico
            </InlineSticker> is a US territory, so there is no visa or sponsorship
            question. I
            am bilingual in English and Spanish, I have worked remotely for years, and I
            am looking for fully remote roles with US companies.
          </P>

          <P>
            Away from a screen: basketball, the mountains, drawing. Lately I want to make
            physical things again, objects rather than interfaces. Same instinct as the
            cards, probably. Something you can hold, that somebody had to decide every
            part of.
          </P>

          <P>
            Product design, design leadership, design engineering. Any size company. If
            you need one person who can take something from brand all the way through to
            shipped code, or someone who can step into a team and raise the bar, I would
            like to talk.
          </P>

          <footer className="mt-16 border-t border-rule pt-10">
            <p className="label text-mute">Get in touch</p>
            <CopyEmail className="mt-4 inline-block font-display text-2xl font-extrabold tracking-tight text-accent underline decoration-edge/30 decoration-2 underline-offset-[6px] transition-colors hover:decoration-edge md:text-3xl" />
          </footer>
        </Column>
      </Wrap>
    </>
  );
}
