"use client";

import type { ComponentProps } from "react";
import { track } from "@/lib/analytics";

/**
 * An anchor that counts itself.
 *
 * The pages that use this are server components, and an onClick needs a
 * client boundary somewhere. Putting the boundary on the link rather than on
 * the page keeps the page on the server and ships about a line of JavaScript.
 *
 * track() is already the gate: it returns early if this reader switched
 * analytics off, or if GA is not on the page at all - dev, previews, CI. So
 * nothing here needs to know whether analytics exists.
 *
 * Every link that uses this opens in a new tab, which matters: the current
 * page is not unloaded, so the event has time to leave before the browser
 * moves on. A same-tab navigation would need a beacon instead.
 */
export default function TrackedLink({
  event,
  params = {},
  children,
  ...rest
}: ComponentProps<"a"> & {
  event: string;
  params?: Record<string, string | number | boolean>;
}) {
  return (
    <a {...rest} onClick={() => track(event, params)}>
      {children}
    </a>
  );
}
