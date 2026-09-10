import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import CaseHero, { CaseFooter } from "@/components/case-hero";
import Scoreboard from "@/components/scoreboard";
import Band from "@/components/band";
import Clip from "@/components/clip";
import WrongBlock from "@/components/wrong-block";
import { Wrap, Column, H2, H3, P, Lead, Figure, Results } from "@/components/prose";

export const metadata: Metadata = pageMeta({
  title: "CurbNTurf — Onboarding a farmer without a salesperson",
  description:
    "Building a two sided RV marketplace out of nothing, and living with the one decision that made the whole thing possible.",
  path: "/work/curbnturf",
  image: "/og-curbnturf.jpg",
});

export default function CurbNTurf() {
  return (
    <>
      <CaseHero
        number="01"
        client="CurbNTurf"
        title="Onboarding a farmer without a salesperson"
        dek="Building a two sided RV marketplace out of nothing, and then living with the one decision that made the whole thing possible."
        live={{ label: "curbnturf.com", href: "https://www.curbnturf.com" }}
        meta={[
          { label: "Role", value: "Founding Designer" },
          { label: "Scope", value: "Brand, product, web, native" },
          { label: "Started", value: "December 2018" },
          { label: "Status", value: "Live, v2 in progress" },
        ]}
      />

      <Wrap className="py-16 md:py-20">
        <Column>
          <H2>Three people and a platform that was barely working</H2>

          <Lead>
            I joined CurbNTurf in December 2018 as one of three. Aaron Rawlins was starting
            the company, Jed Smith was building it, and I was designing it.
          </Lead>

          <P>
            There was a product of a sort, limping along, and there was an idea worth
            chasing: connect RV travelers with private landowners. Farms, vineyards,
            ranches, driveways. There was no brand. No visual language. No coherent product
            experience. I built all of it.
          </P>

          <P>
            The idea itself sits on two problems that happen to cancel each other out.
            There are way more RVers than there are places to put them, and the good
            campgrounds book out months ahead. Meanwhile landowners and agribusinesses have
            space they aren’t using and margins they’d like to be better. Airbnb had
            already proven people will let strangers onto their property for money. Nobody
            had built it properly for rigs.
          </P>

          <P>
            So the market was never the question. Getting both sides to show up was, with
            three people and no plan to hire a sales floor.
          </P>

          {/* A full bleed photographic screenshot from 2018, shown to make a
              before and after point. At the default quality it lands at 875KB,
              six times any other image on the site, so it carries its own. */}
          <Figure tilt={-1}
            wide
            quality={55}
            src="/media/curbnturf-v1-home.png"
            alt="CurbNTurf v1 homepage: a headline and an empty search box"
            caption="V1, captured September 2026. A headline, an empty box, and several paragraphs explaining what a two sided marketplace is."
          />

          <H2>One decision shaped every screen after it</H2>

          <P>
            Our closest competitor, Harvest Hosts, ran on a membership subscription.
            Travelers paid a yearly fee to get access to the network. I went through them
            and everything adjacent, every onboarding flow and host dashboard I could get
            into, and we went the other way.
          </P>

          <P>
            No membership fees. Sounds like pricing. It was really a design constraint.
          </P>

          <P>
            Subscription revenue pays for humans. You can afford somebody to call a
            vineyard owner and walk him through listing his back field, because there’s
            recurring money behind the call. Take the subscription away and you can’t.
            Which means every landowner has to sign himself up, alone, with nobody on the
            phone.
          </P>

          <P>
            That’s harder than it sounds, because this isn’t a SaaS buyer who lives in
            software all day. It’s a farmer or a rancher who has never listed anything
            online, doesn’t know what his land is worth to an RVer, doesn’t know what an
            RVer even needs, and has real questions about liability and strangers parking
            on his property.
          </P>

          <P>
            The onboarding has to do the entire job a salesperson would have done. Build
            trust. Explain the model. Pull out details the host doesn’t know are relevant.
            Get to a published listing before he gives up and goes back to whatever he was
            doing.
          </P>

          <Clip
            wide
            tilt={-0.9}
            src="/media/curbnturf-host"
            poster="/media/curbnturf-host-poster.jpg"
            label="The CurbNTurf host landing page scrolled end to end: the earnings headline, the land types that qualify shown as tags, an earnings calculator, the three step explainer, the community map, the host protection panel and the FAQ"
            caption="The host landing page, captured September 2026. Every block on it answers something a salesperson used to answer on a phone call. What kind of land counts, listed out so a rancher can find his own in it. What it pays, as a calculator rather than a promise. And near the bottom, what happens if a guest damages something, which is a question a landowner has before he has any of the others. This page has to finish the pitch before the onboarding can start the paperwork."
          />

          <Figure tilt={1.2}
            wide
            src="/media/curbnturf-onboarding.png"
            alt="Four steps of the host onboarding flow: the phase overview, the property type grid, the address step with a map pin, and the amenities picker"
            caption="Onboarding, captured September 2026. The flow is cut into three phases and named in plain language, so a landowner always knows how much is left. Property type does the teaching. Winery, orchard, ranch, woodlands: the fastest way to explain what CurbNTurf wants is to show a landowner his own land in the list. Amenities ships with presets, since a rancher does not know that “potable water” and “dump station” are the two things an RVer searches on."
          />
        </Column>
      </Wrap>

      <Band
        kicker="The bet the business sat on"
        facts={[
          { label: "No subscription", value: "so no sales floor to pay for" },
          { label: "Which means", value: "every landowner signs himself up" },
          { label: "Alone", value: "with nobody on the phone" },
        ]}
      >
        Self serve onboarding, or no business.
      </Band>

      <Wrap className="py-4">
        <Column>
          <H2>Designing inside the thing we shipped</H2>

          <P>
            I started the way most designers start. Screens in Figma, hand them to Jed,
            wait. It worked and it was slow, and things got lost in the gap between the
            file and the build.
          </P>

          <P>
            So we moved to Webflow and I started designing in it, which meant handing over
            usable code instead of a mockup and a conversation. Marketing site and app
            surfaces both.
          </P>

          <P>
            That sounds like a tooling preference. It changed how fast a three person
            company could move. The distance between “this should change” and “it’s live”
            basically collapsed, and that’s the difference between a small team that can
            turn on a dime and one that spends its runway in handoff meetings.
          </P>

          <H2>What I got wrong</H2>

          <P>
            I built the first version on Airbnb’s mental model, because it was proven and
            it mapped cleanly. A listing is a place. A host has a place. You book the
            place.
          </P>

          <P>
            Land doesn’t work like that. A ranch isn’t a house. It’s five or six distinct
            spots with different sizes, hookups, access and prices. One host, many sites. I
            had modeled one host, one site.
          </P>

          <WrongBlock
            label="What it cost"
            claim="I modeled one host, one site. A ranch is five or six."
          >
            <p>
              Here’s why it took a while to see: it never actually broke. Hosts could
              duplicate a listing and edit it, so a multi spot property was possible. It was
              just tedious, and in a product with no salespeople, tedious is the thing that
              kills you. Every extra step is one more rancher deciding this isn’t worth his
              afternoon.
            </p>
            <p>
              Borrowing a proven model and then finding exactly where it breaks is a better
              story than never having thought about it. Airbnb’s model was the right place to
              start. Land is not lodging, and the seam between those two things is a real
              insight that I paid for.
            </p>
          </WrongBlock>

          <P>
            We found it the way you find things when the team is small and honest. Support
            tickets, and our sales reps. They travel the country signing hosts up and
            staying at the properties, so they were running into it in person, standing on
            a ranch with five obvious spots next to a product that only wanted one.
          </P>

          <P>
            Fixing it took about a month. We built multisite on the app first, brought the
            changes across to the site, and migrated the existing hosts who needed it. The
            reps could use it too, which mattered more than we expected.
          </P>


          <Figure tilt={-0.7}
            wide
            src="/media/curbnturf-explore.png"
            alt="The explore page: filter chips across the top, listing cards carrying their own amenities and nightly price, and a map of the United States clustered by count and price"
            caption="A listing carries its own amenities and price range. The fix was letting one host hold several of these."
          />

          <H2>What the numbers actually say</H2>

          <P>
            This is the part I’d rather not publish, which is exactly why it’s here.
          </P>

        </Column>
      </Wrap>

      <Scoreboard
        lit={5}
        total={25}
        headline="landowners who start the process publish a listing that week"
        litLabel="Published, unaided"
        restLabel="Stalled somewhere, every one an interested landowner"
      />

      <Wrap className="py-4">
        <Column>
          <P>
            About twenty five hosts start the process every week. About five of them
            publish a listing inside that week. So the self serve bet is roughly one fifth
            true.
          </P>

          <P>
            Some hosts really do sign themselves up with zero help, which is the thing the
            whole model needs, and it’s why the business runs without thirty people on a
            sales floor. But four out of five stall somewhere, and every one of those was a
            landowner interested enough to start.
          </P>

          <P>
            That number is why we still have reps out in the field, and why I built them
            internal tools the host facing product never exposes. The escape hatch isn’t an
            admission the bet failed. It’s what you build when a bet is partly working and
            you want the accounts worth a phone call to actually get one.
          </P>

          <P>It’s also the number driving version two.</P>

          <H2>Version two</H2>

          <P>
            V2 exists for two honest reasons. The product had picked up a lot of capability
            over the years, more tools and feature sets for hosts and guests than v1 was
            ever built to hold. And v1 had aged. It looked its years.
          </P>

          <P>
            But the real shift is what the first screen is for. V1 explained the service.
            V2 lets you use it. The old homepage opened with a headline, an empty search
            box, and several paragraphs describing what a two sided marketplace is. The new
            one opens with a working query. Destination, dates, your rig. Plus three ways
            to start depending on how you’re thinking about it: you know where you’re
            going, you’re traveling between places, or you’re just looking at the map.
          </P>

          <Clip
            wide
            tilt={0.9}
            src="/media/curbnturf-scroll"
            poster="/media/curbnturf-scroll-poster.jpg"
            label="The CurbNTurf v2 homepage scrolled end to end: the search bar with destination, dates and rig, then the listings, the community map, the reviews and the footer"
            caption="V2 end to end, captured September 2026. Compare it to the v1 homepage at the top of this page: there, a headline and an empty box; here, a query you can actually run, and everything it leads to."
          />

          <P>
            The onboarding is substantially the same design I made in 2019, with the flow
            tightened rather than rebuilt. We’re extending it now with AI that gathers
            information local to the host while he signs up, so he has to supply less and
            the listing shows up more complete.
          </P>

          <P>
            Same bet, pushed harder. The less a host has to know, the more hosts you get.
            Whether that moves five out of twenty five is the open question. I’ll know
            soon.
          </P>

          <H2>The apps</H2>

          <P>
            iOS and Android both shipped, free to download and use. I designed the primary
            app experience, the core screens and flows. Jed handled the secondary and
            smaller scale decisions, which I reviewed and approved.
          </P>

          <P>
            The hard part wasn’t visual. It was designing inside the framework’s
            constraints, and the clearest example is navigation. The app’s menu system was
            built on React, which meant its structure didn’t map onto what we’d built for
            the web. Some layouts exist only in the app and have no web equivalent at all.
          </P>

          <P>
            The temptation there is to force parity. Make both platforms match so the brand
            feels consistent and nobody has to think about it twice. I didn’t. Fighting a
            framework to reproduce a web layout on a phone gets you something that feels
            wrong on both, so I let the app keep its own structures where the framework
            wanted them, and held consistency at the level of brand, language and behavior
            instead of layout.
          </P>

          <Figure tilt={-1.1}
            alt="CurbNTurf iOS and Android app screens"
            caption="Add: the app screens that have no web equivalent."
          />

          <H3>Where it stands</H3>
        </Column>

        <Results
          items={[
            { value: "500+", label: "Hosts with published listings, from farmland to urban driveways" },
            { value: "4.8", label: "Average host rating" },
            { value: "2", label: "Native apps shipped, iOS and Android, free to use" },
            { value: "7 yrs", label: "Designing and shipping the same product" },
          ]}
        />

        <Column>
          <P>
            Seven years on one product is the part I’d point at. Most designers hand
            something over and never find out what it cost. I’ve had to keep using every
            decision I made, and rebuild the ones that were wrong.
          </P>
        </Column>
      </Wrap>

      <CaseFooter
        credits={[
          { name: "Aaron Rawlins", role: "Founder" },
          { name: "Jed Smith", role: "Founding Developer. Platform, apps, secondary app design" },
          {
            name: "Dustin Reed",
            role: "Founding Designer. Brand, product, web, primary app design, front end",
          },
        ]}
        next={{
          slug: "coqui-cardboard",
          client: "Coqui Cardboard",
          title: "The one nobody asked me to build.",
        }}
      />
    </>
  );
}
