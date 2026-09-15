import Image from "next/image";

/* ------------------------------------------------------------------
   The brand system pieces, for the CurbNTurf case study.

   The mark and the palette sit on a fixed light surface rather than on
   the page's own ground, because both were chosen against cream and
   showing a swatch against a colour it was never tested on is not a
   swatch, it is a decoration.

   The rig icons are the exception. They are single colour line work,
   so they are drawn as CSS masks over `currentColor` and take whatever
   ink the theme is using. One file, both themes, 56KB for all eight.
   ------------------------------------------------------------------ */

const PAPER = "#f1efe3";
const INK = "#0d2117";
const LIME = "#566f00";
const SLATE = "#5c625a";

/** The eight rig types, in the order the picker lists them. */
const RIGS: { slug: string; name: string; note: string }[] = [
  { slug: "class-a", name: "Class A", note: "Coach" },
  { slug: "class-b", name: "Class B", note: "Camper van" },
  { slug: "class-c", name: "Class C", note: "Cab over" },
  { slug: "fifth-wheel", name: "Fifth Wheel", note: "Gooseneck" },
  { slug: "travel-trailer", name: "Travel Trailer", note: "Bumper pull" },
  { slug: "truck-camper", name: "Truck Camper", note: "Bed mounted" },
  { slug: "teardrop", name: "Teardrop", note: "Compact tow" },
  { slug: "popup-camper", name: "Popup Camper", note: "Folding" },
];

export function RigTypes() {
  return (
    <figure className="my-14">
      <ul className="grid grid-cols-2 gap-px rounded-sm border border-rule bg-rule sm:grid-cols-4">
        {RIGS.map((rig) => (
          <li key={rig.slug} className="bg-raised px-4 py-6 text-center">
            <span
              role="img"
              aria-label={`${rig.name} icon`}
              className="mx-auto block h-11 w-full bg-type"
              style={{
                WebkitMaskImage: `url(/media/curbnturf-rv/${rig.slug}.svg)`,
                maskImage: `url(/media/curbnturf-rv/${rig.slug}.svg)`,
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                WebkitMaskPosition: "center",
                maskPosition: "center",
                WebkitMaskSize: "contain",
                maskSize: "contain",
              }}
            />
            <p className="label mt-3 text-type">{rig.name}</p>
            <p className="mt-1 text-[0.72rem] leading-snug text-mute">{rig.note}</p>
          </li>
        ))}
      </ul>

      <figcaption className="mt-3 text-sm leading-relaxed text-mute">
        A rig type is the most consequential fact in the product. It decides
        whether a site fits, whether the approach is drivable, and whether a
        listing should appear in a search at all. It was never going to survive
        as a dropdown label, so the set is drawn: eight rigs at one stroke
        weight, on one baseline, at true relative length, so a Class A reads as
        the largest thing here without anyone saying so. Single colour on
        purpose. The same eight files are a filter, a badge on a listing card,
        a step in onboarding and a row in a traveler&rsquo;s garage, and in half
        of those places they sit on a photograph.
      </figcaption>
    </figure>
  );
}

/** The mark, in the two lockups that actually get used. */
export function Marks() {
  return (
    <figure className="my-14">
      <div className="grid gap-px overflow-hidden rounded-sm border border-rule bg-rule sm:grid-cols-2">
        <div
          className="flex items-center justify-center p-12"
          style={{ backgroundColor: PAPER }}
        >
          <Image
            src="/media/curbnturf-system/logo/CNT_Logo_V_Orange.svg"
            alt="The CurbNTurf monogram in orange: CURB, N and TURF stacked into a square"
            width={100}
            height={128}
            className="h-28 w-auto"
          />
        </div>
        <div
          className="flex items-center justify-center p-12"
          style={{ backgroundColor: "#465d50" }}
        >
          <Image
            src="/media/curbnturf-system/logo/CNT_Logo_V_White.svg"
            alt="The same monogram reversed to white on the brand green"
            width={100}
            height={128}
            className="h-28 w-auto"
          />
        </div>
      </div>

      <figcaption className="mt-3 text-sm leading-relaxed text-mute">
        The wordmark is the name and nothing else, cut so the three words stack
        into a square. That constraint was the point: the same artwork has to
        work as an app icon at 60 pixels, as a map pin on a phone, and across a
        trailer decal, and a name that fills a square survives all three where a
        horizontal logotype with a little tent next to it does not.
      </figcaption>
    </figure>
  );
}

const SWATCHES: { hex: string; name: string; role: string; dark?: boolean }[] = [
  { hex: "#e3530d", name: "Primary", role: "Actions, price, the brand", dark: true },
  { hex: "#465d50", name: "Green", role: "Surfaces, host side", dark: true },
  { hex: "#9cb29f", name: "Green light", role: "Amenity chips, map pins" },
  { hex: "#212722", name: "Secondary 900", role: "Type on cream", dark: true },
  { hex: "#d8d6d6", name: "Light", role: "Rules, disabled" },
  { hex: "#f6f8f9", name: "Gray 100", role: "Page beneath cards" },
];

export function Palette() {
  return (
    <figure className="my-14">
      <div
        className="rounded-sm border border-rule p-6 md:p-8"
        style={{ backgroundColor: PAPER }}
      >
        <p className="label" style={{ color: LIME }}>
          Core palette &middot; Familjen Grotesk
        </p>

        <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {SWATCHES.map((s) => (
            <li key={s.hex}>
              <div
                className="flex h-20 items-end rounded-sm border p-2"
                style={{
                  backgroundColor: s.hex,
                  borderColor: "rgba(13,33,23,0.14)",
                }}
              >
                <span
                  className="font-mono text-[0.7rem] tracking-tight"
                  style={{ color: s.dark ? "#ffffff" : INK }}
                >
                  {s.hex}
                </span>
              </div>
              <p
                className="mt-1.5 text-[0.8rem] font-semibold leading-tight"
                style={{ color: INK }}
              >
                {s.name}
              </p>
              <p className="text-[0.75rem] leading-snug" style={{ color: SLATE }}>
                {s.role}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <figcaption className="mt-3 text-sm leading-relaxed text-mute">
        Six colours carry the whole product across three platforms. The orange
        is the only thing that ever means act, which is why the reserve button
        and the price are the two loudest objects on a listing card and nothing
        else is allowed to compete with them. The palette also had to survive
        being a frame around host photography of wildly uneven quality, so the
        greens sit muted enough to hold a bad phone photo of a field without
        arguing with it.
      </figcaption>
    </figure>
  );
}
