import { PROFILES } from "@/lib/site";

/**
 * The three places to find me that are not email.
 *
 * One component because these belong together and were drifting: the home
 * page had all three, the about page had none, and the only thing tying them
 * was that I remembered to paste the same anchor twice.
 *
 * They are a row and they stay a row. On a phone the home page used to run
 * the email and LinkedIn across one line and drop GitHub and The Tink Tank
 * onto the next, which read as two unrelated pairs rather than one set of
 * links. Here the group wraps as a unit, and the gap tightens below sm so the
 * three of them clear 360px without breaking.
 */
const LINKS = [
  /* First, because it is the thing a recruiter came for. */
  { label: "Résumé", href: "/dustin-reed-resume.pdf" },
  { label: "LinkedIn", href: PROFILES.linkedin },
  { label: "GitHub", href: PROFILES.github },
  { label: "The Tink Tank", href: "https://thetinktank.com" },
];

export default function ProfileLinks({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex flex-wrap items-center gap-x-5 gap-y-3 sm:gap-x-8 ${className}`}
    >
      {LINKS.map((link) => (
        <a
          key={link.href}
          href={link.href}
          target="_blank"
          rel="noreferrer"
          /* py-3 -my-3 buys a 44px target without moving the row. */
          className="draw-link label inline-flex items-center py-3 -my-3 whitespace-nowrap text-soft no-underline transition-colors hover:text-accent"
        >
          {link.label} &#8599;
        </a>
      ))}
    </div>
  );
}
