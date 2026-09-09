/**
 * A remembered on/off choice the reader made about the interface.
 *
 * Kept outside React because localStorage is not reactive, and an effect
 * that calls setState to catch up is both a lint error and a flash of the
 * wrong state on first paint. `useSyncExternalStore` reads it during render
 * instead, with a server snapshot that never disagrees with itself.
 *
 * Both preferences that use this exist for the same reason: the interface
 * does something clever that a reader may need to switch off. Single-key
 * shortcuts collide with speech input; the drawn cursor overrides the
 * pointer settings someone set at the OS level. Neither is detectable, so
 * both have to be askable.
 */
export type Preference = {
  subscribe: (cb: () => void) => () => void;
  read: () => boolean;
  write: (on: boolean) => void;
};

export function createPreference(key: string, defaultOn = true): Preference {
  /* Local listeners cover this tab; `storage` covers the others, which only
     fires in tabs that did not make the change. */
  let listeners: Array<() => void> = [];

  return {
    subscribe(cb) {
      listeners.push(cb);
      window.addEventListener("storage", cb);
      return () => {
        listeners = listeners.filter((l) => l !== cb);
        window.removeEventListener("storage", cb);
      };
    },

    read() {
      try {
        const v = localStorage.getItem(key);
        if (v === null) return defaultOn;
        return v !== "off";
      } catch {
        /* Private mode and blocked storage both throw on access, not just
           on write. Fall back to the default rather than to off. */
        return defaultOn;
      }
    },

    write(on) {
      try {
        localStorage.setItem(key, on ? "on" : "off");
      } catch {
        /* Nothing to remember it with; the session still honours the flip. */
      }
      listeners.forEach((l) => l());
    },
  };
}

/**
 * The two of them, declared here rather than beside the components that
 * own them, so the `?` panel can offer both switches without importing the
 * cursor component and dragging four inline SVGs into the shell bundle.
 *
 * shortcuts  single characters with no modifier collide with speech input
 *            and with NVDA and JAWS quick-navigation keys. WCAG 2.1.4 asks
 *            for an off switch, remapping, or focus scoping; this is the
 *            off switch.
 * cursor     drawing the pointer overrides whatever the reader set at the
 *            OS level - an enlarged pointer, a high-contrast one,
 *            shake-to-locate. Those are assistive settings and none of
 *            them are readable from the page, so the only honest answer is
 *            to let the reader take the drawing away.
 *
 * Both default on: they are what the site is, and a reader who wants
 * neither only has to say so once.
 */
export const shortcutsPref = createPreference("shortcuts");
export const cursorPref = createPreference("cursor");
