"use client";

import { useEffect, useRef, useState } from "react";
import StickerFrame from "@/components/sticker-frame";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * A product clip, in the same sticker frame the screenshots use.
 *
 * Not a GIF. The two captures this replaces were 10.8MB and 4.2MB; as WebM
 * they are 319KB and 144KB. A GIF also cannot be paused, has no poster, and
 * ignores every accessibility preference the reader has set.
 *
 * Rules this follows, in the order they matter:
 *
 *   reduced motion  never autoplays. The poster stands in, and the play
 *                   control is the only way it moves. This is a preference,
 *                   not a hint.
 *   off screen      pauses. A looping video in a tab nobody is looking at is
 *                   a battery bill someone else pays.
 *   always          muted, inline, and stoppable. Autoplaying sound is
 *                   indefensible and a loop with no off switch is worse.
 *
 * `preload="none"` means the bytes are not spent until the reader scrolls to
 * it, so a case study costs its text and its poster and nothing else.
 */
export default function Clip({
  src,
  poster,
  caption,
  label,
  wide = false,
  tilt = -1,
  phone = false,
}: {
  /** Base path with no extension. Both .webm and .mp4 must exist beside it. */
  src: string;
  poster: string;
  caption?: string;
  /** What the reader is watching, for anyone who cannot see it. */
  label: string;
  wide?: boolean;
  tilt?: number;
  /**
   * Portrait captures get a device frame instead of the sticker frame. A
   * phone recording shown edge to edge at full column width reads as a
   * tall website; the bezel is what tells the reader it is a phone, and
   * shrinking it to phone size is what makes the claim honest.
   */
  phone?: boolean;
}) {
  const ref = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;

    const wantsStill = prefersReducedMotion();
    setReduced(wantsStill);
    if (wantsStill) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) v.play().catch(() => {});
          else v.pause();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  /* The video is the source of truth for whether it is playing, not the
     call that asked it to. iOS Low Power Mode, a media policy or a decode
     failure can all stop it after play() has already resolved, and the
     button would go on claiming "Pause" over a still frame. */
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const on = () => setPlaying(true);
    const off = () => setPlaying(false);
    v.addEventListener("play", on);
    v.addEventListener("pause", off);
    v.addEventListener("ended", off);
    return () => {
      v.removeEventListener("play", on);
      v.removeEventListener("pause", off);
      v.removeEventListener("ended", off);
    };
  }, []);

  function toggle() {
    const v = ref.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  }

  const video = (
    <video
      ref={ref}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      role="img"
      aria-label={label}
      className={phone ? "block h-auto w-full" : "h-auto w-full rounded-[4px]"}
    >
      <source src={`${src}.webm`} type="video/webm" />
      <source src={`${src}.mp4`} type="video/mp4" />
    </video>
  );

  if (phone) {
    return (
      <figure className="my-14">
        {/* The phone sits on its own lit panel. A dark bezel against the dark
            theme's ground is a phone nobody can see; the panel is what makes
            it read as a device photographed on a surface rather than a tall
            screenshot with rounded corners. */}
        <div className="flex justify-center rounded-sm border border-rule bg-raised px-6 py-12 md:py-16">
          <div className="relative w-full max-w-[290px]">
            {/* Titanium rail. Two rings: a light outer edge catching the
                light and the black body inside it, which is the entire
                reason a real phone reads as an object and a rounded
                rectangle does not. */}
            <div className="relative rounded-[3rem] bg-gradient-to-b from-[#8e8e93] via-[#4a4a4f] to-[#6b6b70] p-[3px] shadow-[0_30px_60px_-24px_rgba(0,0,0,0.75),0_10px_20px_-12px_rgba(0,0,0,0.5)]">
              <div className="rounded-[2.85rem] bg-[#08080a] p-[11px]">
                <div className="overflow-hidden rounded-[2.1rem] bg-black">{video}</div>
              </div>

              {/* Hardware. Volume pair and the action button on the left,
                  the longer side button opposite. */}
              <span className="pointer-events-none absolute -left-[5px] top-[84px] h-7 w-[5px] rounded-l-sm bg-gradient-to-r from-[#5f5f65] to-[#3a3a3f]" />
              <span className="pointer-events-none absolute -left-[5px] top-[126px] h-12 w-[5px] rounded-l-sm bg-gradient-to-r from-[#5f5f65] to-[#3a3a3f]" />
              <span className="pointer-events-none absolute -left-[5px] top-[188px] h-12 w-[5px] rounded-l-sm bg-gradient-to-r from-[#5f5f65] to-[#3a3a3f]" />
              <span className="pointer-events-none absolute -right-[5px] top-[150px] h-20 w-[5px] rounded-r-sm bg-gradient-to-l from-[#5f5f65] to-[#3a3a3f]" />
            </div>

            <button
              type="button"
              onClick={toggle}
              className="label mx-auto mt-7 block min-h-11 rounded-full border border-control bg-ground/85 px-4 text-type transition-colors hover:bg-ground"
            >
              {playing ? "Pause" : reduced ? "Play clip" : "Play"}
            </button>
          </div>
        </div>

        {caption ? (
          <figcaption className="mt-3 text-sm leading-relaxed text-mute">
            {caption}
          </figcaption>
        ) : null}
      </figure>
    );
  }

  return (
    <figure className={`my-14 ${wide ? "md:-mx-24 lg:-mx-40" : ""}`}>
      <StickerFrame tilt={tilt} className="relative">
        {/* A <video> with no controls is exposed inconsistently, and in
            several engines an aria-label on it is never announced at all -
            so a reader is not told a clip is here. role="img" forces the
            name into the tree, which is the right shape anyway: these are
            silent, looping, video-only content. */}
        {video}

        <button
          type="button"
          onClick={toggle}
          /* No aria-pressed. A toggle takes either a static name plus that
             attribute or a changing name without it; with both, NVDA reads
             "Pause, toggle button, pressed" - which says the pause is
             applied, the opposite of what is happening. */
          className="label absolute bottom-6 right-6 min-h-11 rounded-full border border-control bg-ground/85 px-4 text-type backdrop-blur-sm transition-colors hover:bg-ground md:bottom-9 md:right-9"
        >
          {playing ? "Pause" : reduced ? "Play clip" : "Play"}
        </button>
      </StickerFrame>

      {caption ? (
        <figcaption className="mt-3 text-sm leading-relaxed text-mute">{caption}</figcaption>
      ) : null}
    </figure>
  );
}
