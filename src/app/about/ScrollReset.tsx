"use client";

import { useEffect, useLayoutEffect } from "react";

/**
 * Forces the page to start at the top.
 *
 * useLayoutEffect  → fires synchronously before the browser paints (beats
 *                    Next.js scroll-restoration which runs after effects).
 * history.scrollRestoration = "manual" → tells the browser NOT to restore
 *                    the previous scroll position for this URL.
 * setTimeout 0     → catches any layout-shift from dynamic-import chunks
 *                    that resolve right after first paint.
 */
export default function ScrollReset() {
  useLayoutEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    const t = setTimeout(() => window.scrollTo(0, 0), 80);
    return () => clearTimeout(t);
  }, []);

  return null;
}
