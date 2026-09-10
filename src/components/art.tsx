/**
 * A two-tone illustration, coloured by the page rather than by the file.
 *
 * Every drawing here is the same object - cream paper, dark green ink, cut
 * out - and that used to be baked into a PNG. Which made the drawings the
 * one part of the site that could not follow a theme: a green cap on a
 * magenta page.
 *
 * So each drawing ships as two alpha masks instead, and this paints them
 * with two variables. One pair of files covers all seventeen themes and any
 * future one for nothing. It also came out smaller than the colour PNGs it
 * replaces, because a mask of flat shapes compresses far better than a
 * quantised photograph of one.
 *
 * `<i>` for the layers rather than `<span>`: they are the only two inline
 * elements that can sit inside phrasing content without a display override,
 * and these appear mid-sentence inside InlineSticker.
 */
export default function Art({
  src,
  width,
  height,
  className = "",
}: {
  /** Base path with no suffix; `${src}-paper.png` and `-ink.png` must exist. */
  src: string;
  width: number;
  height: number;
  className?: string;
}) {
  const paper = `url("${src}-paper.png")`;
  const ink = `url("${src}-ink.png")`;
  return (
    <span
      aria-hidden
      className={`art ${className}`}
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      <i className="art-paper" style={{ WebkitMaskImage: paper, maskImage: paper }} />
      <i className="art-ink" style={{ WebkitMaskImage: ink, maskImage: ink }} />
    </span>
  );
}
