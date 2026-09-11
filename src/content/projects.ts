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
      "Twenty four thousand sports cards, catalogued and designed the way the objects deserve. No client, no brief, no revenue. Designed and built end to end in Next.js.",
    facts: ["Sole designer and developer", "24,000+ cards", "Command palette search"],
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
    image: "/media/infocon-clip-poster.jpg",
    clip: "/media/infocon-clip",
    imageAlt: "The InfoCon storefront scrolled: the yellow ground, the serif headline and the hexagon photo crops",
  },
];

export type SelectedWork = {
  name: string;
  href: string;
  /** When the work ran. Leads the meta line, because these span seven years. */
  when: string;
  /** What I did, as separate pieces rather than a sentence. */
  role: string[];
  /** Shown as the link. Deriving it from href would be fragile with www. */
  domain: string;
  line: string;
  /* A capture of the live site, revealed on hover. Base path with no
     extension; .webm and .mp4 must both exist beside it. Optional, and the
     row renders exactly as it always did without one. */
  clip?: string;
  /* The still, held while the clip is paused. Paired explicitly rather than
     derived from `clip`, the way a case study pairs `image` with `clip`. */
  poster?: string;
  clipAlt?: string;
};

export const selectedWork: SelectedWork[] = [
  {
    name: "StickyFlow",
    href: "https://www.stickyflow.com",
    when: "2026",
    role: ["Founder", "Brand", "Site", "Front end"],
    domain: "stickyflow.com",
    line: "My own agency, launched early spring 2026. It sells AI workflow automation on a flat monthly subscription instead of an agency retainer, and the whole pitch is that a founder owns the automation outright rather than renting it, so the site could not look like a brochure. It is built as machinery: terminal typography, live telemetry ticking in the header, Next.js and GSAP underneath. Behind the brand, the builds themselves are RAG chatbots, LLM API integrations and agent workflows in custom code, deployed into the client's own accounts and keys.",
    clip: "/media/stickyflow-clip",
    poster: "/media/stickyflow-clip-poster.jpg",
    clipAlt: "The StickyFlow homepage scrolled: terminal typography on a dark ground, telemetry counting in the header",
  },
  {
    name: "New Smile Dentures",
    href: "https://www.newsmiledentures.com",
    when: "2023 to 2025",
    role: ["Brand", "Site", "SEO", "Google Ads"],
    domain: "newsmiledentures.com",
    line: "A family denture practice in Idaho: three generations, two clinics, an in house lab, and patients who arrive embarrassed. The identity and the site were built for a business that had outgrown both. I rebuilt them in spring 2023 and then ran the brand for nearly three years, SEO and Google Ads included. Buying the traffic yourself is how you find out whether the rebrand actually worked.",
    clip: "/media/newsmiledentures-clip",
    poster: "/media/newsmiledentures-clip-poster.jpg",
    clipAlt: "The New Smile Dentures homepage scrolled: the clinic photography, the treatment cards and the booking path",
  },
  {
    name: "The Tink Tank",
    href: "https://thetinktank.com",
    when: "Since 2018",
    role: ["Brand", "Product", "Front end"],
    domain: "thetinktank.com",
    line: "Started in Idaho in May 2018, because almost nobody there was doing this kind of work. Brand, product and front end for clients across SaaS, healthcare, retail and commerce, usually all three phases: name it, design it, ship it. The studio is older than its own website, which went up in spring 2026.",
    clip: "/media/tinktank-clip",
    poster: "/media/tinktank-clip-poster.jpg",
    clipAlt: "The Tink Tank homepage scrolled: the studio wordmark, the client work grid and the three phase pitch",
  },
];
