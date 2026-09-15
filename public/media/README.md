Everything the pages show lives here. There are three kinds of file, and
each is used differently.

No GIFs. A GIF can't be paused, has no poster frame, ignores reduced motion,
and costs ten times what the same clip costs as video.


SCREENSHOTS

PNG, JPG or WebP, pointed at from a <Figure /> in a case study:

  <Figure
    src="/media/curbnturf-search.webp"
    alt="What the screenshot argues, not only what it shows"
    caption="Optional."
    wide
  />

Figure goes through next/image, which converts and resizes on the way out, so
the file here can be a full-size capture. The size ladder in next.config.ts
tops out at 1440, so a capture much wider than that is wasted. A Figure with
no src renders nothing at all.


CLIPS

Three files that share a base name:

  name.webm           VP9
  name.mp4            H.264, the fallback
  name-poster.jpg     the first frame, shown until it plays

Point at the base name, with no extension, from a <Clip /> in a case study:

  <Clip
    src="/media/name"
    poster="/media/name-poster.jpg"
    label="What happens in the clip, for anyone who can't see it"
    caption="Optional."
  />

Add `phone` for a portrait phone recording, which puts it in a device frame
instead of the sticker frame.

A homepage card sets `clip` and `image` (the poster) in
src/content/projects.ts; a Selected work row sets `clip`, `poster` and
`clipAlt`.

Most of the landscape clips are 1200 wide at 30fps, and every webm here is
between about 150KB and 1.1MB. Lengths run from six to twenty-eight
seconds. The phone recording is 560x1222. None of them download until the
reader scrolls to one or hovers it, so a long page costs nothing extra until
someone looks.


ILLUSTRATIONS

The drawings (the portrait, the coqui, the stickers) are coloured by the
theme, not by the file. Each one is two alpha masks:

  name-paper.png
  name-ink.png

Don't draw these by hand. Draw the two-tone original as `name.png`, cream
paper and dark green ink, add `name` to the ART list at the top of
scripts/art-masks.py, and run

  python3 scripts/art-masks.py

That writes the pair. Point at the base name:

  <InlineSticker src="/media/name" width={…} height={…}>phrase</InlineSticker>

Keep the original `name.png`; it's the source the masks are rebuilt from.
The portrait original is also the source for the favicons, so after changing
dustin-portrait-line.png, run `npm run icon` as well.
