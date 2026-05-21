"use client";

import { useEffect } from "react";
import { gsap } from "@/lib/gsap";

/*
  Per-character magnetic distortion.

  Each letter in MOVE / BEYOND / LIMITS is split into its own <span>
  and attracted toward the cursor independently based on its own distance.
  Because letters close to the cursor move more than letters far away,
  the word appears to stretch and bend rather than translate as a block.

  [data-hero-word-magnetic] spans are split on mount; the original text
  content is restored on cleanup so SSR markup stays consistent.
*/

const RADIUS   = 200; // px — attraction field per character
const MAX_MOVE = 20;  // px — max displacement per character

export default function HeroMagnetic() {
  useEffect(() => {
    const hero    = document.querySelector<HTMLElement>("[data-hero-section]");
    const magnets = Array.from(
      document.querySelectorAll<HTMLElement>("[data-hero-word-magnetic]")
    );

    if (!hero || magnets.length === 0) return;

    // Split each word into per-character units.
    // If the magnet already has child elements (e.g. PRÓXIMO with logo X),
    // use those directly. Otherwise split textContent into char spans.
    const originalHTML = magnets.map((m) => m.innerHTML);

    magnets.forEach((magnet) => {
      if (magnet.children.length > 0) {
        // Pre-split by Hero.tsx — ensure inline-block on each child
        Array.from(magnet.children).forEach((el) => {
          (el as HTMLElement).style.display = "inline-block";
        });
      } else {
        const text = magnet.textContent ?? "";
        magnet.innerHTML = text
          .split("")
          .map((ch) => `<span style="display:inline-block">${ch}</span>`)
          .join("");
      }
    });

    // Collect magnetic units — direct children of each magnet
    const charEls = magnets.map((m) =>
      Array.from(m.children) as HTMLElement[]
    );

    const xTo = charEls.map((chars) =>
      chars.map((el) => gsap.quickTo(el, "x", { duration: 0.55, ease: "power3.out" }))
    );
    const yTo = charEls.map((chars) =>
      chars.map((el) => gsap.quickTo(el, "y", { duration: 0.55, ease: "power3.out" }))
    );

    function isRevealed(magnet: HTMLElement): boolean {
      const parent = magnet.closest<HTMLElement>("[data-hero-word]");
      if (!parent) return false;
      // Word is revealed when GSAP has animated it to opacity > 0.5
      return parseFloat(getComputedStyle(parent).opacity) > 0.5;
    }

    function onMouseMove(e: MouseEvent) {
      magnets.forEach((magnet, wi) => {
        if (!isRevealed(magnet)) return;

        charEls[wi].forEach((char, ci) => {
          const rect    = char.getBoundingClientRect();
          const centerX = rect.left + rect.width  / 2;
          const centerY = rect.top  + rect.height / 2;
          const dx      = e.clientX - centerX;
          const dy      = e.clientY - centerY;
          const dist    = Math.sqrt(dx * dx + dy * dy);

          if (dist < RADIUS && dist > 0) {
            const strength = 1 - dist / RADIUS;
            xTo[wi][ci]((dx / dist) * strength * MAX_MOVE);
            yTo[wi][ci]((dy / dist) * strength * MAX_MOVE);
          } else {
            xTo[wi][ci](0);
            yTo[wi][ci](0);
          }
        });
      });
    }

    function onMouseLeave() {
      charEls.forEach((chars) => {
        chars.forEach((el) => {
          gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: "power2.out" });
        });
      });
    }

    hero.addEventListener("mousemove", onMouseMove);
    hero.addEventListener("mouseleave", onMouseLeave);

    return () => {
      hero.removeEventListener("mousemove", onMouseMove);
      hero.removeEventListener("mouseleave", onMouseLeave);
      // Restore original markup
      magnets.forEach((m, i) => {
        m.innerHTML = originalHTML[i];
      });
    };
  }, []);

  return null;
}
