import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import CaseHero, { CaseFooter } from "@/components/case-hero";
import Clip from "@/components/clip";
import { SpecBlock } from "@/components/blocks";
import Band from "@/components/band";
import WrongBlock from "@/components/wrong-block";
import { Wrap, Column, H2, P, Lead, Pull, Figure, Bullets, Results } from "@/components/prose";

export const metadata: Metadata = pageMeta({
  title: "Dominó Caribe — The model had to ask",
  description:
    "A web game of Caribbean dominoes, built in about two weeks with Claude Code. A written rules spec was the source of truth, and the agent was told to ask instead of inventing a rule.",
  path: "/work/domino-caribe",
  image: "/og-domino.jpg",
});

export default function DominoCaribe() {
  return (
    <>
      <CaseHero
        number="04"
        client="Dominó Caribe"
        title="The model had to ask"
        dek="A web game of Caribbean dominoes, built in about two weeks with Claude Code. The code came mostly from the model. The rules came from the people who actually play, and the model was told, in writing, not to make any up. It’s live, playable, and still a work in progress."
        live={{ label: "dominoes-zeta.vercel.app", href: "https://dominoes-zeta.vercel.app" }}
        meta={[
          { label: "Role", value: "All of it" },
          { label: "Built with", value: "Claude Code" },
          { label: "Stack", value: "TypeScript, Vite, Vitest, Colyseus" },
          { label: "Status", value: "Work in progress" },
        ]}
      />

      <Wrap className="py-16 md:py-20">
        <Column>
          <H2>Why dominoes</H2>

          <Lead>
            I lived in the Dominican Republic for two years, and in that time I played a
            lot of dominoes with my father-in-law. Dominoes there isn’t a board game you get
            out on holidays. It’s just what the table is for.
          </Lead>

          <P>
            I also wanted a real project to push Claude Code on. Not a to-do app. Something
            with enough rules, edge cases and arguments in it that a model left alone would
            confidently get things wrong, so I could find out what it takes to keep it from
            doing that.
          </P>

          <P>
            Dominoes is perfect for that, because there is no single game. Dominican tables
            play to 200 in teams and pay bonuses for a capicúa. Puerto Rican tables call it
            capicú, and some play to 500. Cuban tables use the double-nine set and ten tiles
            each. Every family has a house rule or two that it will defend as the official
            one. A model trained on the internet has read all of those, mixed together, and
            will hand you an average of them with a straight face.
          </P>
        </Column>
      </Wrap>

      <Band kicker="The instruction">
        If a rule is unclear, ask me. Do not invent rules.
      </Band>

      <Wrap className="py-4">
        <Column>
          <H2>The rules lived in a file, not in the model</H2>

          <P>
            The first commit, before any game code, had a document in it:{" "}
            <code className="font-mono text-[0.9em] text-type">docs/RULES.md</code>,
            the full rules written out in plain language, one section per part of the game,
            with every variant named. The project guide the agent reads first says that file
            is the source of truth, and says what to do when it runs out.
          </P>

          <SpecBlock
            title="AGENTS.md"
            note="the guide the agent reads before it codes"
            rows={[
              { key: "Source of truth", value: "docs/RULES.md" },
              { key: "Unclear rule", value: "Ask me. Do not invent rules." },
              { key: "Every rule", value: "Needs a test" },
              { key: "Randomness", value: "Seeded. No Math.random() in the engine." },
              { key: "Hidden tiles", value: "Bots and screens only see one player’s view" },
            ]}
          />

          <P>
            That one line did most of the work. When the agent hit something the spec
            didn’t cover, it stopped and asked, and the answer went into the file, marked{" "}
            <em>user decision</em>, usually with the month it was decided. RULES.md has
            seventeen of those marks now. They’re the most useful thing in it, because
            they’re exactly the places where the sources disagree.
          </P>

          <P>Two of them came from me and my father-in-law.</P>

          <Bullets
            items={[
              <>
                <strong className="font-semibold text-type">Doubles never count as a
                capicú.</strong> Going out with a tile that fits either open end earns the
                bonus. A 5-5 on ends of 5 and 5 technically fits both. At our table it’s not
                a capicú, in any style, and now it isn’t in the game either.
              </>,
              <>
                <strong className="font-semibold text-type">A chuchazo never stacks with a
                capicú.</strong> Going out with the double blank is its own bonus. Going out
                with it on two blank ends could be read as both. It counts once, as a
                chuchazo. Some Puerto Rican tables don’t count that case at all, which is the
                whole point: somebody had to decide, and it shouldn’t have been the model.
              </>,
            ]}
          />

          <Figure tilt={-1}
            src="/media/domino-capicua.jpg"
            alt="Two winning plays, each with an arrow from the last tile to both open ends and the words ¡Por los dos lados!"
            caption="From a design pass on the celebrations: the table points at both open ends when a hand goes out on a capicúa. The rule underneath is the one decided at a real table."
          />

          <P>
            The spec gets corrected too, in the open. The Puerto Rican preset first played
            clockwise. A rules check later found no source for that, every source said
            counterclockwise, so I changed it, and the file says what changed, when and why.
            Clockwise is still there as a house rule for anyone whose family plays it that
            way.
          </P>

          <Pull>
            The model was very good at writing the game. It was never the authority on how
            the game is played.
          </Pull>

          <P>
            Where no rulebook covers a case at all, like a tied tranque when bonuses have
            pushed both teams past the target, the file says that too, and says what we
            picked. That’s the difference between a spec and a prompt. A prompt is forgotten
            at the end of the session. The spec is still there for the next one, and for the
            tests.
          </P>

          <H2>What’s under the table</H2>

          <P>
            The engine is pure: no screen, no network, no clock. You give it a game and a
            move, it gives you back the next game. Randomness comes from a seed, so the same
            seed deals the same tiles every time, which means any game, including the strange
            one a tester reports, can be replayed exactly.
          </P>

          <P>
            Every style is just settings on that engine. Dominican, Dominican one-on-one,
            Puerto Rican 200, Puerto Rican 500 and Cuban double-nine are presets, and{" "}
            <em>Mi mesa</em>, “my table,” lets you start from any of them and change the
            rules your family argues about. Nothing about a style is written into the game
            itself.
          </P>

          <P>
            The bots come in three levels. Fácil plays its heaviest tile. Normal keeps track
            of what has been played and who has passed on what, and wins about 85% of games
            against Fácil. Difícil guesses where the hidden tiles are and plays the hand out
            many times before it moves, and wins about 73% of team games against Normal. None
            of them can cheat, because none of them can see anything a person in that seat
            couldn’t: their own tiles, how many everyone else holds, the table, the score.
          </P>

          <Results
            items={[
              { value: "589", label: "automated tests, across 61 test files" },
              { value: "5", label: "rule presets, plus Mi mesa for house rules" },
              { value: "3", label: "bot levels, all limited to one player’s view" },
              { value: "186", label: "commits, 177 of them co-written with Claude" },
            ]}
          />

          <P>
            The spec says every rule needs a test, and that’s why there are 589 of them.
            GitHub runs them on every change, and a change doesn’t go into the live game
            until they pass.
          </P>

          <H2>A table you can hold in one hand</H2>

          <P>
            I wanted it to look like a real table, not a casino: a wooden top with felt,
            tiles that sit on it like objects, the score on a strip of paper. You can look
            straight down at it or tilt it into 3D.
          </P>

          <Figure tilt={1.1}
            wide
            src="/media/domino-table.png"
            alt="A two versus two Dominican game on a laptop: a wooden table, the line of tiles turning a corner, open ends marked 0 and 3, and a bot partner thinking"
            caption="Two versus two on a laptop, captured November 2026. The line turns the corner instead of running off the table, doubles always sit crosswise, and the circled numbers are the two open ends. The red notes under a name are what everyone at the table already knows, like which number a player has shown he doesn’t have."
          />

          <P>
            The line of tiles is the hard part. It has to snake around the corners of
            whatever screen it’s on without ever leaving the table, and it has to do that on
            a phone held upright, which is how most people will play it. Every word on
            screen comes in Spanish and English, switched from the start screen.
          </P>

          <Clip
            wide
            tilt={-0.7}
            src="/media/domino-clip"
            poster="/media/domino-clip-poster.jpg"
            label="A two versus two game on the live site: the hands are dealt, my partner opens with the double six, the next player passes for a pase de salida, and the line of tiles grows and turns two corners as the bots take their turns"
            caption="A real game on the live site, recorded November 2026 and played back at one and a half times speed, which mostly shortens the bots’ thinking. My partner opens with the double six, the next player can’t follow it, and that’s a pase de salida: 25 points to us before anyone else has played a tile."
          />

          <Figure tilt={0.9}
            src="/media/domino-phones.png"
            alt="Two phone screens side by side: a two versus two game and a one-on-one game with the boneyard showing"
            caption="Phone first. Two versus two with a bot partner, and one-on-one with the boneyard (el pozo) face down, both fitting one screen with nothing to scroll."
          />

          <P>
            A game is saved as you play, so a refresh doesn’t lose it.
            It installs to the home screen and plays offline against the bots. Sounds are off
            until you turn them on.
          </P>

          <Clip
            phone
            src="/media/domino-phone"
            poster="/media/domino-phone-poster.jpg"
            label="The same game on a phone: three bots take their turns, and on my turn the hand grows, the playable tiles are marked and the game asks which end to play on, while the line of tiles folds back and forth to stay on the narrow table"
            caption="The same live game on a phone, recorded November 2026 at one and a half times speed. On my turn the rack grows, marks what I can play and asks which end it goes on, and the line folds back on itself rather than run off a table this narrow. Like the rest of the game, still a work in progress."
          />

          <Figure tilt={-0.8}
            src="/media/domino-chuchazo.jpg"
            alt="A celebration burst around the double blank, with a banner reading Chuchazo +100 — Nosotros"
            caption="Another frame from the celebrations design pass. The value on the banner depends on the style: the Dominican preset scores a chuchazo at zero, Puerto Rican 500 scores it at 100."
          />

          <H2>Proving nobody cheated</H2>

          <P>
            When I read through what players complain about in other domino apps, one of
            the complaints was that the shuffle is rigged. You can’t argue someone out of
            that. You can let them check.
          </P>

          <P>
            So before the first move, the game shows a short code, the fingerprint of the
            shuffle. It’s made from the seed with a one-way function, so it gives nothing
            away during the game. When the game ends, the seed is revealed and a{" "}
            <em>Comprobar</em> button checks two things: that the seed really produces the
            code you were shown at the start, and that it really deals the tiles you got. The
            screen explaining it, <em>Juego limpio</em>, says this in plain words, because
            the people most suspicious of the shuffle are not the people who want to read
            about hashes.
          </P>

          <P>
            Online play runs through a Colyseus server hosted on Render. The server holds the
            only real copy of the game, and each phone is sent only its own view of it, so a
            curious cousin with the browser’s developer tools open sees their own tiles and
            nothing else. You open a table, share the link, and friends join from their
            phones with no account. Empty seats get bots. If someone drops, a bot plays for
            them and the seat waits a minute for them to come back.
          </P>

          <WrongBlock
            label="What it doesn’t do yet"
            claim="Online, you still have to take the server’s word for the shuffle."
          >
            <p>
              Juego limpio works in games against the bots. At an online table the server
              shuffles with secure randomness, but it doesn’t show its fingerprint yet, so
              the one place a player can’t see the shuffle happen is the one place it isn’t
              provable. That’s the next thing on the list, not a footnote.
            </p>
            <p>
              The rest are limits I chose. The server is on Render’s free plan, which sleeps
              after about fifteen minutes without players, so the first table of the night
              can take up to a minute to wake. It caps at 200 tables and twelve seats per
              internet address. Once a game starts, nobody new can join, so a stranger with
              the link can’t sit down halfway through.
            </p>
          </WrongBlock>

          <H2>What I’d do next</H2>

          <P>
            The roadmap is written the same way as the rules, from what players of other
            domino apps actually complain about.
          </P>

          <Bullets
            items={[
              "Friend tables that finish, every time: your own seat back after a drop, and “play again with the same people” that remembers who they were.",
              "The fingerprint at online tables, so Juego limpio means the same thing everywhere.",
              "A partner bot that plays like a partner: doesn’t block you, and holds back a double so you can go out.",
              "Easy for abuela: arrive from a WhatsApp link, in Spanish, with big tiles, no account and no timers.",
              "Android and iOS apps, wrapped from the same web game.",
            ]}
          />

          <P>
            The roadmap also has a short list of things it will never do: real-money prizes,
            betting, loot boxes, ads that grow over time, or notifications that guilt you
            into opening it. More games are on the list after that, on the same engine, and
            each one starts the same way: its rules written into the spec before any code.
          </P>
        </Column>
      </Wrap>

      <CaseFooter
        credits={[
          {
            name: "Dustin Reed",
            role: "Rules spec, game design, front end, direction",
          },
          {
            name: "Claude Code",
            role: "Most of the code, written against the spec",
          },
          {
            name: "My father-in-law",
            role: "The table rules, and the final word on them",
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
