"use client";

import { useRef, useState } from "react";
import { gsap, EASE, dur } from "@/lib/motion";

/**
 * A mailto is a dead end for anyone without a mail client configured, which
 * on desktop is most people. Click copies instead; the label confirms it and
 * reverts. The href stays a real mailto so middle-click, right-click and
 * keyboard "open link" all still behave.
 */
export default function CopyEmail({
  email = "dr33d9@gmail.com",
  className = "",
}: {
  email?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const labelRef = useRef<HTMLSpanElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function handle(e: React.MouseEvent<HTMLAnchorElement>) {
    if (!navigator.clipboard) return; // let the mailto happen instead
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      return; // clipboard blocked: fall through, the href still works
    }
    setCopied(true);
    if (labelRef.current) {
      gsap.fromTo(
        labelRef.current,
        { opacity: 0, y: 6 },
        { opacity: 1, y: 0, duration: dur(0.22), ease: EASE.out }
      );
    }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2000);
  }

  return (
    <a href={`mailto:${email}`} onClick={handle} className={className}>
      <span ref={labelRef} className="inline-block">
        {copied ? "Copied to clipboard" : email}
      </span>
      <span className="sr-only" role="status" aria-live="polite">
        {copied ? "Email address copied to clipboard" : ""}
      </span>
    </a>
  );
}
