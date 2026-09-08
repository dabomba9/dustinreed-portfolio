export type CaseStudy = {
  slug: string;
  number: string;
  client: string;
  title: string;
  blurb: string;
  facts: string[];
  live?: { label: string; href: string };
  /* Drop a file in /public/media and set this to e.g. "/media/curbnturf-card.png" */
  image?: string;
  /* Optional upgrade. Base path with no extension; .webm and .mp4 must both
     exist beside it, and `image` is the poster while it is paused. */
  clip?: string;
  imageAlt: string;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "curbnturf",
    number: "01",
    client: "CurbNTurf",
    title: "Onboarding a farmer without a salesperson.",
    blurb:
      "A two sided RV marketplace built from no brand and no product, and the bet that landowners would sign themselves up.",
    facts: [
      "Founding designer",
      "Brand, product, web, native",
      "2018 to now",
      "500+ hosts with published listings",
    ],
    live: { label: "curbnturf.com", href: "https://www.curbnturf.com" },
    image: "/media/curbnturf-index-poster.jpg",
    clip: "/media/curbnturf-index",
    imageAlt: "CurbNTurf marketplace, host onboarding and listing pages",
  },
  {
    slug: "coqui-cardboard",
    number: "02",
    client: "Coqui Cardboard",
    title: "The one nobody asked me to build.",
    blurb:
      "Twelve thousand basketball cards, catalogued and designed the way the objects deserve. No client, no brief, no revenue. Designed and built end to end in Next.js.",
    facts: ["Sole designer and developer", "12,000+ cards", "Command palette search"],
    live: { label: "coquicardboard.com", href: "https://www.coquicardboard.com" },
    image: "/media/coqui-clip-poster.jpg",
    clip: "/media/coqui-clip",
    imageAlt: "Coqui Cardboard catalog and command palette search",
  },
  {
    slug: "infocon-lrs",
    number: "03",
    client: "InfoCon + LRS",
    title: "Why we didn’t merge them.",
    blurb:
      "One owner bought a competitor selling large print books to the same readers. Everyone would tell you to consolidate. I built two identities and two checkouts instead.",
    facts: [
      "Logo and identity, twice",
      "Custom quoting and checkout",
      "Readers losing their sight",
    ],
    live: { label: "largeprintbooks.com", href: "https://www.largeprintbooks.com" },
    image: "/media/infocon-hero.jpg",
    imageAlt: "The InfoCon homepage: a yellow ground, a serif headline and a hexagon photo crop",
  },
];

export type SelectedWork = {
  name: string;
  href: string;
  line: string;
};

export const selectedWork: SelectedWork[] = [
  {
    name: "StickyFlow",
    href: "https://www.stickyflow.com",
    line: "Brand and site for an AI operations agency. Next.js, GSAP, terminal inspired UI, live telemetry in the header.",
  },
  {
    name: "New Smile Dentures",
    href: "https://www.newsmiledentures.com",
    line: "Logo, identity and site for a family denture practice in Idaho. Three generations, two clinics, an in house lab, and patients who show up embarrassed.",
  },
  {
    name: "The Tink Tank",
    href: "https://thetinktank.com",
    line: "My studio. Brand, product and front end for clients across SaaS, healthcare and commerce.",
  },
];
