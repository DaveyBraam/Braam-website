"use client";

import Lenis from "lenis";
import { useEffect } from "react";

declare global {
  interface Window {
    __scrubUpdaters?: Array<() => void>;
    __lenis?: Lenis;
  }
}

/**
 * One clock for the whole page.
 *
 * Native scrolling runs on the compositor while a canvas repaints on the main
 * thread, so a sticky frame-sequence always lags the page by a frame or two and
 * reads as juddering. Lenis moves the page itself, which lets the scroll
 * position and every canvas redraw land in the same frame instead of racing.
 *
 * Anything that needs to redraw per frame pushes an updater into
 * window.__scrubUpdaters; this loop calls them right after Lenis has moved.
 */
export function SmoothScroll() {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) return;

    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    window.__lenis = lenis;
    window.__scrubUpdaters ??= [];

    let frame = window.requestAnimationFrame(function raf(time: number) {
      lenis.raf(time);
      const updaters = window.__scrubUpdaters;
      if (updaters) for (const update of updaters) update();
      frame = window.requestAnimationFrame(raf);
    });

    // Lenis owns the scroll position, so in-page anchors have to go through it
    // or the browser jumps while Lenis keeps animating to somewhere else.
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey) return;
      const anchor = (event.target as HTMLElement | null)?.closest?.("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || !href.startsWith("#") || href === "#") return;
      const target = document.querySelector(href);
      if (!target) return;
      event.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -90 });
    };
    document.addEventListener("click", onClick);

    // A page opened straight on a hash still needs Lenis to land on it.
    if (window.location.hash) {
      const target = document.querySelector(window.location.hash);
      if (target) {
        window.setTimeout(() => lenis.scrollTo(target as HTMLElement, { offset: -90, immediate: true }), 0);
      }
    }

    return () => {
      document.removeEventListener("click", onClick);
      window.cancelAnimationFrame(frame);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  return null;
}
