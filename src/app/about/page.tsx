import type { Metadata } from "next";
import { Wrap, Column, P, Lead, Pull } from "@/components/prose";
import CopyEmail from "@/components/copy-email";

export const metadata: Metadata = {
  title: "About",
  description:
    "Founding designer. Brand, product and front end. Seven years on the same product, now working into the backend.",
};

export default function About() {
  return (
    <>
      <section className="border-b border-rule">
        <Wrap className="py-20 md:py-28">
          <p className="label text-accent">About</p>
          <h1 className="display mt-7 max-w-4xl text-[2rem] sm:text-5xl md:text-[4rem]">
            Most designers never find out what their decisions cost.
          </h1>
        </Wrap>
      </section>

      <Wrap className="py-20 md:py-24">
        <Column>
          <Lead>
            I&rsquo;m a founding designer. I build the brand, design the product, and write
            the front end code.
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
            That&rsquo;s the part I&rsquo;d point at. Most designers hand something over and
            never learn what it cost. I&rsquo;ve spent seven years living inside my own
            work, watching which calls held up and which ones quietly made someone
            else&rsquo;s job harder. It changes what you reach for.
          </P>

          <P>
            I design and I build. Early on I moved our work into Webflow so developers got
            working code instead of a mockup and a conversation. These days I write
            production Next.js and React. It keeps the distance between &ldquo;this should
            change&rdquo; and &ldquo;it&rsquo;s live&rdquo; short, which is most of what a
            small team actually needs.
          </P>

          <P>
            I also run The Tink Tank, a studio where I do brand, product and front end for
            clients across SaaS, healthcare, retail and commerce, from Fortune 500
            companies down to two person startups. That work includes two separate brand
            identities and a custom quoting and checkout system for one of the largest
            independent large print book manufacturers in the country, selling into school
            districts and state contracts, where growth has doubled since launch.
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

          <P>
            I design in Figma and ship in Next.js and React. I&rsquo;ve worked in design
            systems, built with Webflow, shipped iOS and Android, and I use AI tooling
            daily as part of how I work rather than as a novelty.
          </P>

          <P>
            I live in San Juan, Puerto Rico, which is a US territory, so no visa or
            sponsorship is needed. Bilingual in English and Spanish. I&rsquo;ve worked
            remotely for years and I&rsquo;m looking for fully remote roles with US
            companies.
          </P>

          <P>
            I&rsquo;m open to product design, design leadership, and design engineering
            roles at any size company. If you need someone who can take something from
            brand all the way through to shipped code, or step into an existing team and
            raise the bar, I&rsquo;d like to talk.
          </P>

          <div className="mt-16 border-t border-rule pt-10">
            <p className="label text-mute">Get in touch</p>
            <CopyEmail className="mt-4 inline-block font-display text-2xl font-extrabold tracking-tight text-accent underline decoration-edge/30 decoration-2 underline-offset-[6px] transition-colors hover:decoration-edge md:text-3xl" />
          </div>
        </Column>
      </Wrap>
    </>
  );
}
