"use client";

import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export default function HeroAnimations() {
  useEffect(() => {
    let ctx: ReturnType<typeof gsap.context>;

    // Wait one frame so the DOM is committed before GSAP queries it
    const rafId = requestAnimationFrame(() => {
      ctx = gsap.context(() => {
        const hero = document.querySelector<HTMLElement>("[data-hero-section]");
        const track = document.querySelector<HTMLElement>("[data-hero-track]");
        const words = gsap.utils.toArray<HTMLElement>("[data-hero-word]");
        const outro = document.querySelector<HTMLElement>("[data-hero-outro]");

        if (!hero || !track || words.length < 3) return;

        // ── Initial state ──────────────────────────────────────────────────
        // Words start invisible and slightly below — no overflow-hidden needed,
        // so the magnetic character distortion has unclipped space to move in.
        gsap.set(words, { y: 48, opacity: 0 });

        // ── Three-act word reveal ──────────────────────────────────────────
        // The hero is held in place by CSS `position: sticky` (see Hero.tsx),
        // NOT by GSAP pin — so this ScrollTrigger only scrubs the timeline,
        // it never touches the DOM. Driven by the 240dvh [data-hero-track]:
        // start when the track top hits the viewport top, end when its
        // bottom hits the viewport bottom (= the 140dvh sticky travel).
        //
        // Each word occupies ~27% of that travel, with pauses between them
        // so the reader registers each word before the next rises.
        const pinTl = gsap.timeline({
          scrollTrigger: {
            trigger: track,
            start: "top top",
            end: "bottom bottom",
            scrub: 1.5,   // lag makes text feel heavy, like stone
          },
        });

        pinTl
          .to(words[0], { y: 0, opacity: 1, ease: "power3.out", duration: 0.25 }, 0.05)
          .to(words[1], { y: 0, opacity: 1, ease: "power3.out", duration: 0.25 }, 0.28)
          .to(words[2], { y: 0, opacity: 1, ease: "power3.out", duration: 0.25 }, 0.52);

        // ── Concrete materialisation ───────────────────────────────────────
        // THREE elements animate together on the same ScrollTrigger:
        //   • data-hero-section    — the section's own bg (kills the sub-pixel
        //                            seam between bottom-grad mask & section bg)
        //   • data-hero-bottom-grad — the masked fade at the hero's bottom edge
        //   • data-hero-outro       — the dark zone below the hero
        //
        // Adding the section itself is the real fix: even if the mask leaves
        // a 1px translucent row at the very bottom, the section bg behind it
        // is also lightening, so no dark line is ever exposed.
        const bottomGrad = document.querySelector<HTMLElement>("[data-hero-bottom-grad]");
        const bottomSolid = document.querySelector<HTMLElement>("[data-hero-bottom-solid]");
        const seamFix = document.querySelector<HTMLElement>("[data-hero-seam-fix]");

        const concreteTargets = [
          hero,
          bottomGrad,
          bottomSolid,
          seamFix,
          outro,
        ].filter(Boolean) as HTMLElement[];

        if (concreteTargets.length) {
          gsap.to(concreteTargets, {
            backgroundColor: "#E8E6E1",
            ease: "none",
            scrollTrigger: {
              trigger: outro,
              start: "top 80%",
              end: "bottom 30%",
              scrub: 4,
            },
          });
        }

        // ── Layout refresh ─────────────────────────────────────────────────
        // Fonts and images can shift layout after first paint, corrupting
        // pin calculations. Refresh once after things settle.
        const refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 300);
        return () => clearTimeout(refreshTimer);
      });
    });

    return () => {
      cancelAnimationFrame(rafId);
      ctx?.revert();
    };
  }, []);

  return null;
}
