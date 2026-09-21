import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Every screenshot on this site is a 1459px wide capture. The default
    // ladder tops out at 3840, so a retina desktop was asking for a 1920px
    // render of a 1459px source and Next was upscaling it - paying for
    // pixels that carry no detail. Capping the ladder below the sources
    // means the largest render is always a downscale.
    deviceSizes: [640, 750, 828, 1080, 1200, 1440],
    // Next 16 only serves the quality values listed here. 75 is the default
    // every image uses. 55 exists for the one 2018 screenshot that is
    // photographic enough to cost 875KB at 75.
    qualities: [55, 75],
  },

  /**
   * Keep the résumé out of search results.
   *
   * The PDF is public and stays public - a recruiter who wants it should get
   * it in one click, and the link is unchanged. It just should not be the
   * thing Google ranks for my name. A flat file competing with the case
   * studies wins sometimes, and then the first impression of a portfolio
   * about shipping product is a two page PDF.
   *
   * noindex keeps it out of the index; noimageindex stops the page images
   * inside it being surfaced on their own. Headers are matched before the
   * filesystem, so this reaches a file in public/ that no route serves.
   */
  headers() {
    return [
      {
        source: "/dustin-reed-resume.pdf",
        headers: [{ key: "X-Robots-Tag", value: "noindex, noimageindex" }],
      },
    ];
  },
};

export default nextConfig;
