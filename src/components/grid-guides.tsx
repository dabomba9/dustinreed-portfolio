/**
 * The layout, made visible.
 *
 * Every line in here is a real one. This site has no twelve column grid to
 * reveal - the layouts are `1fr 20rem`, `1fr 1.05fr`, two columns at sm -
 * so drawing twelve evenly spaced stripes would be decoration wearing a
 * grid's clothes. What it does have are three constants that every page on
 * it is built against, and those are what get drawn:
 *
 *   container   max-w-5xl, 64rem, centred
 *   gutters     px-6 / md:px-10 / lg:px-14, so the inner pair moves at each
 *               breakpoint and you can watch it move
 *   measure     the 38rem reading column, dashed, because it is a maximum
 *               rather than an edge things sit on
 *
 * The lg:pl-[21rem] is not decoration either: the rail is fixed and the page
 * is offset behind it, so an overlay pinned to the viewport would sit 21rem
 * to the left of the thing it claims to be measuring. The reading progress
 * bar carries the same offset for the same reason.
 *
 * z-15 puts it over the page and under the chrome: guides should cross the
 * work, not the rail or the status bar. It never takes a pointer event.
 */
export default function GridGuides() {
  return (
    <div
      aria-hidden
      className="grid-guides pointer-events-none fixed inset-0 z-[15] lg:pl-[21rem]"
    >
      <div className="mx-auto h-full max-w-5xl border-x border-edge/30 px-6 md:px-10 lg:px-14">
        <div className="h-full border-x border-edge/20">
          <div className="mx-auto h-full max-w-[38rem] border-x border-dashed border-edge/25" />
        </div>
      </div>
    </div>
  );
}
