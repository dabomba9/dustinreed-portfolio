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
};

export default nextConfig;
