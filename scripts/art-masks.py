"""Split the two-tone illustrations into masks so CSS can colour them.

Every drawing on this site is the same object: cream paper, dark green ink,
cut out. That was baked into the PNG, which meant the drawings were the one
part of the page that could not follow a theme - a green cap on a magenta
page.

So the colour comes out of the file. Each illustration becomes two alpha
masks, paper and ink, and the page paints them with two CSS variables. One
pair of files serves all seventeen themes, and any future one for free.

Edges are kept soft on purpose. Ink coverage is measured as a ratio between
the two known tones rather than thresholded, so an antialiased outline stays
antialiased instead of going to stairsteps.

    python3 scripts/art-masks.py
"""

import os
import numpy as np
from PIL import Image

ART = [
    "mj-sticker", "kobe-sticker", "clemente-sticker", "killebrew-sticker",
    "mcm-house", "eames-elephant", "coqui-taino", "dustin-portrait-line",
]
MEDIA = os.path.join(os.path.dirname(__file__), "..", "public", "media")


def build(name):
    src = os.path.join(MEDIA, f"{name}.png")
    im = Image.open(src).convert("RGBA")
    a = np.asarray(im).astype(np.float64)
    alpha = a[..., 3] / 255.0
    lum = a[..., :3].mean(axis=2)

    # The two tones this drawing is made of, measured rather than assumed:
    # the darkest and lightest opaque pixels it actually contains.
    solid = alpha > 0.6
    ink_l = np.percentile(lum[solid], 2)
    paper_l = np.percentile(lum[solid], 98)
    spread = max(paper_l - ink_l, 1.0)

    # 1 where the pixel is ink, 0 where it is paper, fractional on an edge.
    #
    # The deadzone matters more than it looks. Without it, a flat sheet of
    # paper still reads a percent or two inky - quantisation noise from the
    # source - and forty five percent of the mask lands somewhere between 0
    # and 255. That is not detail, it is dither, and PNG cannot compress it:
    # the ink mask came out at 75K against a 45K original. Snapping the flat
    # regions to flat and keeping the ramp only where an edge really is
    # takes the same drawing to a third of that.
    inkness = np.clip((paper_l - lum) / spread, 0.0, 1.0)
    inkness = np.clip((inkness - 0.18) / 0.64, 0.0, 1.0)

    # Paper is the whole cut shape; the ink layer paints over it, so the paper
    # mask does not need holes punched in it and the two stay in register.
    # Sixteen levels of alpha, not 256. These are masks for flat colour, so
    # the only place a level between on and off does any work is the one
    # pixel wide ramp at an edge, and sixteen steps is more than that ramp
    # can show. It roughly halves the file.
    def quantise(x, levels=16):
        return (np.round(np.clip(x, 0, 1) * (levels - 1)) / (levels - 1) * 255).round().astype(np.uint8)

    paper = quantise(alpha)
    ink = quantise(alpha * inkness)

    out = []
    for suffix, chan in (("paper", paper), ("ink", ink)):
        # Black pixels carrying the shape in their alpha. Mask-mode is alpha,
        # so the colour underneath is irrelevant and compresses to nothing.
        img = Image.merge("LA", (Image.new("L", im.size, 0), Image.fromarray(chan)))
        path = os.path.join(MEDIA, f"{name}-{suffix}.png")
        img.save(path, optimize=True)
        out.append((f"{name}-{suffix}.png", os.path.getsize(path)))
    return os.path.getsize(src), out


if __name__ == "__main__":
    before = after = 0
    for name in ART:
        src_size, files = build(name)
        before += src_size
        after += sum(s for _, s in files)
        print(f"{name:24s} {src_size // 1024:3d}K ->", ", ".join(f"{n.split('-')[-1][:-4]} {s // 1024}K" for n, s in files))
    print(f"\n{before // 1024}K of baked-in colour became {after // 1024}K of masks")
