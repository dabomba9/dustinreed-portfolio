"use client";

import { useRef, useState } from "react";
import { gsap, EASE, dur } from "@/lib/motion";
import { track } from "@/lib/analytics";

/**
 * A mailto is a dead end for anyone without a mail client configured, which
 * on desktop is most people. A mouse click copies instead; the label confirms
 * it and reverts. The href stays a real mailto so middle-click and
 * right-click still behave.
 *
 * Keyboard and assistive-tech activation follow the link. This control is
 * announced as a link to the address, and pressing Enter on a link that then
 * silently copies to the clipboard is a control that does something other
 * than what it said. Those activations arrive as a click with `detail` 0 -
 * no pointer was pressed - so they are let through to the mailto.
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
    /* Someone reaching for the address is the one thing on this site that
       most wants counting, and the only one GA cannot see by itself: a copy
       navigates nowhere. `from` is the page, since this sits on two. */
    const from = location.pathname;
    if (e.detail === 0) {
      track("email_contact", { method: "mailto", from });
      return; // keyboard or AT: the link does what it says
    }
    if (!navigator.clipboard) {
      track("email_contact", { method: "mailto", from });
      return; // let the mailto happen instead
    }
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      return; // clipboard blocked: fall through, the href still works
    }
    setCopied(true);
    track("email_contact", { method: "copy", from });
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
