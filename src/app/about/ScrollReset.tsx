"use client";

import { useEffect, useLayoutEffect } from "react";
import { ScrollTrigger } from "@/lib/gsap";

/**
 * Forces the page to start at the top AND keeps ScrollTrigger in sync.
 *
 * useLayoutEffect  → fires synchronously before the browser paints (beats
 *                    Next.js scroll-restoration which runs after effects).
 * history.scrollRestoration = "manual" → tells the browser NOT to restore
 *                    the previous scroll position for this URL.
 *
 * ScrollTrigger.refresh() → the Acts are lazy-loaded via `dynamic(ssr:false)`
 *                    with no height placeholder, so the page grows in bursts
 *                    as each chunk resolves AFTER first paint. Every scrubbed
 *                    ScrollTrigger caches its start/end in pixels at mount —
 *                    those go stale on each layout shift, desyncing scroll
 *                    from the parallax. Refreshing after the chunks settle
 *                    (and on full window load) recomputes every trigger.
 */
export default function ScrollReset() {
  useLayoutEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    const t0 = setTimeout(() => window.scrollTo(0, 0), 80);

    // ResizeObserver on body: fires every time the page height changes,
    // which happens whenever a lazy Act chunk resolves and adds its DOM.
    // This is more reliable than fixed timeouts — catches shifts whenever
    // they actually happen rather than guessing at millisecond windows.
    let debounce: ReturnType<typeof setTimeout> | null = null;
    const ro = new ResizeObserver(() => {
      if (debounce) clearTimeout(debounce);
      debounce = setTimeout(() => ScrollTrigger.refresh(), 60);
    });
    ro.observe(document.body);

    // Also catch the window load event (for WebGL/image assets in Act1)
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);

    return () => {
      clearTimeout(t0);
      if (debounce) clearTimeout(debounce);
      ro.disconnect();
      window.removeEventListener("load", onLoad);
    };
  }, []);

  return null;
}
