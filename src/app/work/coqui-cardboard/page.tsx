import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import CaseHero, { CaseFooter } from "@/components/case-hero";
import Clip from "@/components/clip";
import { CardGrid, NumberedList } from "@/components/blocks";
import Band from "@/components/band";
import WrongBlock from "@/components/wrong-block";
import { Wrap, Column, H2, P, Lead, Pull, Figure } from "@/components/prose";

export const metadata: Metadata = pageMeta({
  title: "Coqui Cardboard — The one nobody asked me to build",
  description:
    "A catalog for 1990s basketball cards, twelve thousand of them, designed and built end to end. No client, no brief, no revenue.",
  path: "/work/coqui-cardboard",
  image: "/og-coqui.jpg",
});

export default function Coqui() {
  return (
    <>
      <CaseHero
        number="02"
        client="Coqui Cardboard"
        title="The one nobody asked me to build"
        dek="A catalog for 1990s basketball cards, twelve thousand of them, designed and built by me for a hobby I got pulled back into during the pandemic. No client. No brief. No revenue. That’s sort of the point."
        live={{ label: "coquicardboard.com", href: "https://www.coquicardboard.com" }}
        meta={[
          { label: "Role", value: "All of it" },
          { label: "Scope", value: "Brand, product, front end, data" },
          { label: "Stack", value: "Next.js" },
          { label: "Scale", value: "12,000+ cards catalogued" },
        ]}
      />

      <Wrap className="py-16 md:py-20">
        <Column>
          <H2>Let me be upfront about this one</H2>

          <Lead>
            Coqui Cardboard doesn’t make money. I’ve never posted about it anywhere. The
            people using it found it on their own, which is a generous way of saying there
            aren’t many of them.
          </Lead>

          <P>
            I’m showing it to you anyway, because it’s the only thing here that nobody
            hired me to make. No client, no founder, no business case, nobody to talk me
            out of anything. If you want to know what my taste actually looks like when it
            isn’t in service of somebody else’s problem, this is the one.
          </P>

          <H2>Why nineties cards</H2>

          <P>
            I collected as a kid, then quit the way everybody quits, and then the pandemic
            happened, the whole hobby went vertical, and I got dragged back in. What got me
            wasn’t really nostalgia. It was the printing.
          </P>

          <P>
            The nineties were when card companies stopped thinking of a card as a picture
            on cardboard and started treating it as a manufacturing problem. Refractors.
            Foil stamping. Die cuts. Holographic stock. Chromium. Embossing. They were
            competing on production technique, throwing everything at the wall to see what
            people would chase, and a lot of what they tried never got made again. Open a
            1993 insert set and you’re basically looking at a catalog of print finishes
            that stopped existing.
          </P>

          <P>
            Then go try to look one of those cards up. Almost every site that indexes them
            hands you a spreadsheet. Rows. Text. Maybe a thumbnail the size of a stamp.
          </P>

        </Column>
      </Wrap>

      <Band kicker="The whole premise">
        These things are gorgeous objects and we look at them in tables.
      </Band>

      <Wrap className="py-4">
        <Column>
          <P>So that was the whole premise. Build the place where they look like what they are.</P>

          <Figure tilt={-1}
            wide
            src="/media/coqui-vault.png"
            alt="The Jordan Vault: 1,998 cards with images, sorted by year"
            caption="The Vault, filtered to cards with scans. Nearly two thousand of them, ranked by nothing."
          />

          <H2>Four vaults, four reasons</H2>

          <P>The players aren’t a market decision. They’re just mine.</P>

          <CardGrid
            items={[
              {
                title: "Michael Jordan",
                stat: "12,000+ cards, every issue",
                body: "The reason I started collecting at all, and still the deepest catalog anyone has.",
              },
              {
                title: "Kobe Bryant",
                stat: "11,800+ cards, 1996 to now",
                body: "The other one. His rookie year alone runs 143 cards across 25 different brands, which tells you everything about how that decade operated.",
              },
              {
                title: "Roberto Clemente",
                stat: "256 cards, complete playing-era run",
                body: "Best Puerto Rican ballplayer who ever lived. My wife is Puerto Rican, and the coquí in the logo is as much hers as mine.",
              },
              {
                title: "Harmon Killebrew",
                stat: "252 cards, complete playing-era run",
                body: "From Payette, Idaho, which is where I’m from. He’s also a relative.",
              },
            ]}
          />

          <P>
            You can’t fake this kind of specificity with research. The Clemente and
            Killebrew vaults exist because of a marriage and a hometown, and they’re the
            two runs on the site catalogued completely, start to finish, because that’s
            what you do when you actually care about something.
          </P>

          <H2>Two ways in</H2>

          <P>
            There are two different structures sitting on the same cards, and they’re for
            two different moods.
          </P>

          <P>
            A <strong className="font-semibold text-type">Hierarchy</strong> is an opinion.
            The MJ Hierarchy is 378 cards sorted into four rarity tiers. The Mamba
            Hierarchy sorts 76 Kobe cards into grails, elite, and foundation. Somebody sat
            down and decided which cards matter and in what order. That somebody wasn’t me.
            The taxonomy comes from Cajun Cardboard, and they’re credited on the site. I
            didn’t write the canon. I built a good place to walk through it.
          </P>

          <P>
            A <strong className="font-semibold text-type">Vault</strong> is the opposite of
            an opinion. Every card that exists for a player, searchable, ranked by nothing.
            Twelve thousand Jordans just sitting there waiting for you to find the one
            you’re after.
          </P>

          <Pull>
            Somebody browsing to learn what’s significant and somebody hunting a specific
            parallel are in completely different headspaces.
          </Pull>

          <P>
            Putting both of those in one product was the actual design call. If you make
            either one use the other’s interface you’ve made the site worse for both of
            them. So the nav splits by player, and every player gives you both doors.
          </P>

          <Figure tilt={1.2}
            wide
            src="/media/coqui-hierarchy.png"
            alt="The MJ Hierarchy: 378 cards sorted into four rarity tiers"
            caption="The Hierarchy is an opinion — 378 cards, four tiers, Tier 1 first. The Vault above is the same cards with the opinion removed. Same data, two headspaces."
          />

          <H2>The look is the argument</H2>

          <P>
            If I’m going to claim these cards deserve better than a spreadsheet, the site
            has to actually be better, or I’m just complaining.
          </P>

          <P>
            So: near black background with a soft green glow, so scans read like objects
            under glass instead of thumbnails in a grid. Pixel type for the headings, clean
            sans for anything you have to read for more than a second. The mark is a pixel
            art coquí, the tree frog you hear all night in Puerto Rico. And there’s sound,
            which almost nothing on the web bothers with anymore, and which every card shop
            and arcade I ever stood in had running constantly.
          </P>

          <P>
            None of that is decoration. It’s an argument that this hobby has a specific
            look, that the look belongs to a specific decade, and that a catalog is allowed
            to have a point of view instead of being neutral about everything.
          </P>

          <P>
            Underneath the aesthetic there’s a real tool. You can track what you own and
            watch each tier’s completion percentage fill in. Log raw or graded copies with
            PSA, BGS and SGC cert numbers. See eBay sourced values over time instead of
            somebody’s guess. Build want lists for the cards you’re chasing. Share a public
            profile of your collection. There’s a command palette in the nav for people who
            come back often enough to already know what they’re looking for.
          </P>

          <Clip
            wide
            tilt={-0.7}
            src="/media/coqui-clip"
            poster="/media/coqui-clip-poster.jpg"
            label="Coqui Cardboard: the four legends on the home screen, then into the Jordan hierarchy"
            caption="For people who come back often enough to already know what they are looking for. Captured September 2026."
          />

          <H2>The parts that were hard</H2>

          <P>
            <strong className="font-semibold text-type">Getting the data.</strong> Nobody
            publishes a clean feed of twelve thousand Michael Jordan cards. I built a
            scraper to pull card information and images, and writing the scraper wasn’t the
            hard part. Doing it for an amount of money a personal project can absorb was
            the hard part, and that constraint ended up shaping more of the architecture
            than any design decision I made.
          </P>

          <P>
            <strong className="font-semibold text-type">Finding the look.</strong> I went
            through a pile of iterations before I landed on something I’d defend. The early
            ones were more conventionally modern and had no particular reason to exist. The
            nineties direction was not obvious at the start.
          </P>

          <WrongBlock
            label="What I’d do differently"
            claim="I designed the system wide before a single vault survived contact with real data."
          >
            <p>
              Build one vault all the way through before designing four of them.
              Clemente’s fifties run behaves nothing like Kobe’s twenty year sprawl, and I
              figured that out later than I should have.
            </p>
            <p>
              And the honest one. I’ve never promoted this. There are probably a few hundred
              users sitting there for the cost of one post in a collecting forum, and I
              haven’t made the post. It’s been enough that the thing exists and works, which
              is a real answer but probably not the right one.
            </p>
          </WrongBlock>

          <H2>What it was part of</H2>

          <P>
            Coqui was the last of four sites I designed and built in my spare time over a
            few months, while running my studio and doing the actual day job of designing
            CurbNTurf.
          </P>

          <NumberedList
            items={[
              { name: "The Tink Tank", body: "My studio. Brand and site." },
              { name: "StickyFlow", body: "Brand and site for an AI ops agency." },
              {
                name: "CurbNTurf v2",
                body: "Full product redesign. The most ambitious of the four.",
              },
              { name: "Coqui Cardboard", body: "This one." },
            ]}
          />

          <P>
            Four live sites, all my design, all my code. I bring it up because the useful
            fact isn’t any single one of them. It’s that a designer who builds doesn’t have
            to wait on anybody to find out whether an idea works.
          </P>
        </Column>
      </Wrap>

      <CaseFooter
        credits={[
          {
            name: "Dustin Reed",
            role: "Brand, product design, front end, data pipeline",
          },
          {
            name: "Cajun Cardboard",
            role: "The hierarchy taxonomy, credited on the site",
          },
        ]}
        next={{
          slug: "infocon-lrs",
          client: "InfoCon + LRS",
          title: "Why we didn’t merge them.",
        }}
      />
    </>
  );
}
