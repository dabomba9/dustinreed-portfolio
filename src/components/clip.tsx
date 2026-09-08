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
}: {
  /** Base path with no extension. Both .webm and .mp4 must exist beside it. */
  src: string;
  poster: string;
  caption?: string;
  /** What the reader is watching, for anyone who cannot see it. */
  label: string;
  wide?: boolean;
  tilt?: number;
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
          if (e.isIntersecting) {
            v.play().then(
              () => setPlaying(true),
              () => setPlaying(false),
            );
          } else {
            v.pause();
            setPlaying(false);
          }
        }
      },
      { threshold: 0.35 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  function toggle() {
    const v = ref.current;
    if (!v) return;
    if (v.paused) {
      v.play().then(
        () => setPlaying(true),
        () => setPlaying(false),
      );
    } else {
      v.pause();
      setPlaying(false);
    }
  }

  return (
    <figure className={`my-14 ${wide ? "md:-mx-24 lg:-mx-40" : ""}`}>
      <StickerFrame tilt={tilt} className="relative">
        <video
          ref={ref}
          poster={poster}
          muted
          loop
          playsInline
          preload="none"
          aria-label={label}
          className="h-auto w-full rounded-[4px]"
        >
          <source src={`${src}.webm`} type="video/webm" />
          <source src={`${src}.mp4`} type="video/mp4" />
        </video>

        <button
          type="button"
          onClick={toggle}
          aria-pressed={playing}
          className="label absolute bottom-6 right-6 min-h-11 rounded-full border border-ink/15 bg-ground/85 px-4 text-cream backdrop-blur-sm transition-colors hover:bg-ground md:bottom-9 md:right-9"
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
