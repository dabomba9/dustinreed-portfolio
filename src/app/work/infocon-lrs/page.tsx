import type { Metadata } from "next";
import CaseHero, { CaseFooter } from "@/components/case-hero";
import { SpecBlock, Compare } from "@/components/blocks";
import Band from "@/components/band";
import WrongBlock from "@/components/wrong-block";
import { Wrap, Column, H2, P, Lead, Pull, Figure, Bullets } from "@/components/prose";

export const metadata: Metadata = {
  title: "InfoCon + LRS — Why we didn’t merge them",
  description:
    "Two large print brands, one owner, the same customers. Everyone would tell you to consolidate. We built two of everything instead.",
};

export default function LargePrintBooks() {
  return (
    <>
      <CaseHero
        number="03"
        client="InfoCon + LRS"
        title="Why we didn’t merge them"
        dek="Two large print brands, one owner, the same customers. Everyone would tell you to consolidate. We built two of everything instead, and I can tell you exactly why."
        live={{ label: "largeprintbooks.com", href: "https://www.largeprintbooks.com" }}
        meta={[
          { label: "Role", value: "Brand, design, front end" },
          { label: "Scope", value: "2 identities, 2 sites, quoting and checkout" },
          { label: "Team", value: "Me and one developer" },
          { label: "Status", value: "Both live" },
        ]}
      />

      <Wrap className="py-16 md:py-20">
        <Column>
          <H2>A website from 2003 and an owner who knew exactly what he was doing</H2>

          <Lead>
            Latiker manufactured large print books. The website looked like it belonged in
            the early 2000s and there was no recognizable branding of any kind.
          </Lead>

          <P>
            The business underneath was in good shape, because the owner had been doing
            this for decades, but nothing about the way it presented itself said so.
          </P>

          <P>
            Convincing him to rebuild wasn’t hard. The case was simple. A real brand makes
            you memorable, and a real website can carry articles and content that bring in
            leads instead of just sitting there being a phone number. I built the logo, the
            identity and the site, and Latiker became InfoCon — still trading on
            largeprintbooks.com, because the domain says what it sells better than the
            company name does.
          </P>

          <P>
            Then he bought LRS. Library Reproduction Service, a competitor selling into the
            same market.
          </P>

          <H2>The reader is almost never the buyer</H2>

          <P>
            Here’s the thing you have to understand about this category before anything
            else makes sense. The person placing the order is usually not the person who
            will read the book.
          </P>

          <Bullets
            items={[
              "State education systems and state government contracts",
              "Private schools, and schools for the blind and for gifted students",
              "School librarians who have visually impaired students in the district",
              "Care facilities",
              "Parents, ordering for their own kid",
            ]}
          />

          <P>
            Most of the volume is contract work. So the person on the site is a purchasing
            agent, a librarian, or a parent. Sighted, working off a requisition, buying
            against a budget cycle. The accessibility burden lives in the product, not in
            the interface.
          </P>

        </Column>
      </Wrap>

      <Band kicker="The distinction that shaped everything" size="md">
        The books have to be readable. The website has to be orderable.
      </Band>

      <Wrap className="py-4">
        <Column>

          <P>
            That one distinction shaped everything downstream. It’s why both sites lead
            with search and quoting and purchase orders instead of an accessibility widget,
            and it’s why the actual accessibility work shows up as a manufacturing spec.
          </P>

          <H2>What large print means when you’re the one making it</H2>

          <P>
            Every order gets configured per student. These aren’t presentation options,
            they’re production decisions.
          </P>

          <SpecBlock
            title="Made to order"
            note="per visually impaired student"
            rows={[
              { key: "Type size", value: "scaled relative to the original" },
              { key: "Binding", value: "hardcover, softcover, or spiral" },
              { key: "Format", value: "split page (calendar) or full page" },
              { key: "Paper", value: "white or ivory" },
            ]}
          />

          <P>
            Ivory paper cuts glare, which matters a lot for low vision. Spiral binding lets
            a book lie flat so somebody using a magnifier isn’t fighting the spine with one
            hand. Split page format exists because when you enlarge a textbook page past a
            certain point it stops fitting on one sheet and you have to decide what to do
            about that.
          </P>

          <P>
            None of it is a flourish. It’s a set of manufacturing choices that exist
            because of how people with vision loss actually read, and my job was making it
            possible for a librarian to specify all four without needing training.
          </P>

          <Figure tilt={-1}
            wide
            src="/media/lpb-made-to-order.png"
            alt="The Made to Order section: type size, binding, format and paper"
            caption="Four production decisions, made per student. This is the accessibility work — it lives in the manufacturing spec, not in an interface widget."
          />

          <H2>The decision: two brands, on purpose</H2>

          <P>
            When a company buys a competitor in the same category selling to the same
            customers, the default move is consolidation. Absorb the acquired brand, kill
            the second site, run one storefront, save the overhead. That’s what most people
            do.
          </P>

          <P>
            We talked through the benefits and drawbacks together. It was his company and
            ultimately his call, and his decades in the market carried a lot more weight
            than my instincts about brand efficiency. We landed on keeping both, and the
            reasoning holds up.
          </P>

          <Bullets
            items={[
              "Both brands had history worth keeping. LRS had customer relationships and name recognition that predated the acquisition. Absorbing it would have thrown all of that away to save a domain renewal.",
              "Two brands means two ways into the same market. A second identity is a second revenue channel, another door into the same procurement conversation, not a copy of the first one.",
              "They could argue different things. This is the part that made it work instead of just tolerable.",
            ]}
          />

          <Compare
            items={[
              {
                name: "InfoCon",
                claim: "Sells speed",
                body: (
                  <>
                    <p>
                      “Quality Large Print. Without the Long Wait.” Saturated yellow, black
                      high contrast serif at display scale, hexagon photo masks, editorial
                      pacing. Names a benefit and a pain point in six words.
                    </p>
                    <p>
                      Hero image is a kid in a classroom. It says K-12 before you’ve read
                      anything.
                    </p>
                  </>
                ),
              },
              {
                name: "LRS",
                claim: "Sells the system",
                body: (
                  <>
                    <p>
                      “Check out what we are now doing.” White and utilitarian, bold
                      condensed caps, black label chips, yellow nav bar. Institutional
                      rather than editorial.
                    </p>
                    <p>
                      The homepage carousel is real curriculum. Reveal Math, Wonders,
                      Fundations. The catalog is the pitch.
                    </p>
                  </>
                ),
              },
            ]}
          />

          <P>
            A buyer who needs a rush job and a buyer who wants a standing account with saved
            specs are not the same buyer, even when they work for the same district. Keeping
            both brands let each one talk to its own.
          </P>

          <Figure tilt={1.2}
            wide
            src="/media/lpb-lrs-paired.png"
            alt="The two homepages side by side: InfoCon in yellow, LRS in white"
            caption="Same catalogue, same buyers, two postures. Yellow and serif sells speed; white and condensed sells the system. That difference is the reason we kept both."
          />

          <H2>The part that isn’t a website</H2>

          <P>
            Underneath both brands I set up a custom quoting and checkout system, because
            institutional buying doesn’t work like retail. Districts and state contracts buy
            on purchase orders, against quotes, with production specs that repeat order
            after order after order.
          </P>

          <SpecBlock
            title="The system"
            rows={[
              { key: "Quoting", value: "24/7 online quoting, no phone call, no rep" },
              { key: "Quote history", value: "log in, see everything you’ve asked for, order straight from an old quote" },
              { key: "Payment", value: "credit card or purchase order, PO upload any time" },
              { key: "Account", value: "order history, address book, preset production requirements reused every order" },
              { key: "Status", value: "initial sale, manufacturing, shipping, delivered" },
            ]}
          />

          <P>
            The order status pipeline is the one I’d point at. These books get made after
            you order them. There’s no warehouse shelf to pull from. So a librarian who
            ordered forty enlarged textbooks in July needs to know whether they’ll be there
            for the first day of school, and before this the only way to find out was to
            pick up the phone and ask somebody.
          </P>

          <Pull>
            Making manufacturing state visible turned the most common support question into
            something the customer could answer without us.
          </Pull>

          <H2>The argument I lost</H2>

          <P>
            The database was overly complicated and it made design harder than it needed to
            be. Every screen had to accommodate a data model carrying more structure than
            the task in front of the user actually required.
          </P>

          <P>
            I pushed to simplify it. My argument was that a cleaner model would make the
            backend easier to work with and smooth out friction the customer feels around
            the edges. The owner didn’t see that friction as a significant problem, and he
            had decades of evidence about what his customers actually complain about. So it
            stayed.
          </P>

          <WrongBlock
            label="What I’d say now"
            claim="Those aren’t the same quality of evidence, and mine was the weaker one."
          >
            <p>
              I still think I was right about the design cost. I’m a lot less sure I was
              right about the customer cost. I was reasoning from what looked awkward in the
              interface. He was reasoning from twenty years of support calls.
            </p>
            <p>
              What I’d do differently is show up with numbers instead of an opinion. Drop
              off on the steps I thought were painful, or time to complete a quote. I made a
              design argument to somebody who makes business decisions and I never
              translated it.
            </p>
          </WrongBlock>

          <H2>Where it stands</H2>

          <P>
            Both brands are live and running independently —{" "}
            <a href="https://www.largeprintbooks.com" target="_blank" rel="noreferrer" className="draw-link text-type">largeprintbooks.com</a>{" "}
            and{" "}
            <a href="https://www.lrsbooks.com" target="_blank" rel="noreferrer" className="draw-link text-type">lrsbooks.com</a>.
            Open both and the postural difference is the whole case study. Business has gone
            up every single year since, and 2026 is turning into the biggest year the company
            has had in production.
          </P>

          <P>
            I’m not going to claim I caused all of that. An owner with decades in the market
            and a good acquisition did most of the work. But the system I built is what the
            sales side runs on now. Quotes go out without anybody picking up a phone,
            purchase orders arrive uploaded instead of faxed, and customers check production
            status themselves instead of calling to ask.
          </P>
        </Column>
      </Wrap>

      <CaseFooter
        credits={[
          {
            name: "Dustin Reed",
            role: "Brand and identity for both, design, all front end",
          },
          {
            name: "Jed Smith",
            role: "Backend and integration — the same developer I build CurbNTurf with",
          },
          {
            name: "Owner",
            role: "Domain expertise, market knowledge, final call on brand architecture",
          },
        ]}
        next={{
          slug: "curbnturf",
          client: "CurbNTurf",
          title: "Onboarding a farmer without a salesperson.",
        }}
      />
    </>
  );
}
