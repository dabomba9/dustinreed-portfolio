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


if __name__ == "__main__":
    main()
