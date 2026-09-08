#!/usr/bin/env python3
"""Regenerate the app icons from the portrait illustration.

The illustration is drawn in the two theme colours - #f1efe3 and #0d2117 -
so compositing it onto a cream square is seamless: the cream sticker outline
around the head dissolves into the ground and the dark green linework is left
to carry the shape by itself. A dark ground would not work; the cap is the
same #0d2117 and would vanish into it.

The source fills its own canvas edge to edge (alpha bbox 598x632 inside
606x640), so the margin here is added rather than inherited - the head is
scaled to FILL of the square's height and centred.
"""
from PIL import Image

SRC = "public/media/dustin-portrait-line.png"
GROUND = (241, 239, 227)  # #f1efe3, --color-type

# Head height as a fraction of the square. 0.82 everywhere it is seen at any
# real size; 16px is the exception. There the margin is what kills it - at
# 0.82 the face collapses into a grey blob, and pushing it to 0.92 is the
# difference between reading the eyes and the mouth and not. Past that the
# cap starts to crowd the edges.
FILL = 0.82
FILL_16 = 0.92

# Each size is rendered at its final dimensions rather than letting the
# browser downscale one large file: 16 and 32 are the tab at 1x and 2x,
# 180 is what iOS asks for by name, 192 covers Android and bookmark tiles.
OUTPUTS = [
    ("src/app/icon.png", 16),
    ("src/app/icon1.png", 32),
    ("src/app/icon2.png", 192),
    ("src/app/apple-icon.png", 180),
]

# The .ico is a separate ask from the PNGs, and not a redundant one. Next
# only emits the icon files it finds, so without this there is nothing at
# /favicon.ico - and that root path is what the Vercel dashboard, Google
# and the link unfurlers in Slack and iMessage reach for before they parse
# a single <link> tag. A 404 there is a generic globe no matter how many
# PNGs the markup offers. 48 joins 16 and 32 because Windows asks for it.
ICO = "src/app/favicon.ico"
ICO_SIZES = (16, 32, 48)


def render(head, size):
    h = round(size * (FILL_16 if size <= 16 else FILL))
    w = round(head.width * h / head.height)
    scaled = head.resize((w, h), Image.LANCZOS)

    square = Image.new("RGB", (size, size), GROUND)
    square.paste(scaled, ((size - w) // 2, (size - h) // 2), scaled)
    return square


def main():
    head = Image.open(SRC).convert("RGBA")
    head = head.crop(head.getbbox())

    for path, size in OUTPUTS:
        render(head, size).save(path, optimize=True)
        print(f"{path}  {size}x{size}")

    # Render every .ico frame at its own size rather than letting Pillow
    # shrink one. It reuses a supplied frame whose size matches exactly and
    # only downscales when none does, so handing it all three is what keeps
    # the 16px crop that FILL_16 exists for. The largest is the base image
    # because Pillow skips any requested size larger than it.
    # RGBA rather than the RGB the PNGs use: Next decodes the .ico at build
    # time and rejects a PNG frame that is not RGBA. The ground is opaque,
    # so the added channel is a full alpha and changes nothing on screen.
    frames = [render(head, size).convert("RGBA") for size in ICO_SIZES]
    frames[-1].save(ICO, sizes=[(s, s) for s in ICO_SIZES], append_images=frames[:-1])
    print(f"{ICO}  {' '.join(f'{s}x{s}' for s in ICO_SIZES)}")


if __name__ == "__main__":
    main()
