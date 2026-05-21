"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";

export default function Act3ParaTodxs() {
  const sectionRef  = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const subtextRef  = useRef<HTMLParagraphElement>(null);
  const imgPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const trigger = { trigger: sectionRef.current, start: "top 65%", once: true };

      gsap.from(headlineRef.current, {
        opacity: 0, x: -36, duration: 0.9, ease: "power3.out",
        scrollTrigger: trigger,
      });
      gsap.from(subtextRef.current, {
        opacity: 0, x: -20, duration: 0.7, ease: "power3.out", delay: 0.20,
        scrollTrigger: trigger,
      });
      gsap.from(imgPanelRef.current, {
        opacity: 0, x: 50, duration: 1.1, ease: "power3.out", delay: 0.08,
        scrollTrigger: trigger,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      data-nav-theme="dark"
      // On mobile: stacked column. md+: two equal columns.
      className="flex flex-col md:grid md:grid-cols-2"
      style={{
        background: "#0F0F0F",
        minHeight:  "100dvh",
        overflow:   "hidden",
        position:   "relative",
      }}
    >
      {/* ── Left: Text ─────────────────────────────────────────────────────── */}
      <div
        style={{
          display:        "flex",
          flexDirection:  "column",
          justifyContent: "center",
          padding:        "clamp(5rem, 10vw, 8rem) clamp(2rem, 6vw, 6rem)",
          position:       "relative",
          zIndex:         1,
        }}
      >
        {/* Eyebrow */}
        <p
          className="font-body font-medium uppercase"
          style={{
            fontSize:      9,
            letterSpacing: "0.28em",
            color:         "#8A8680",
            marginBottom:  "clamp(1.5rem, 3vw, 2.5rem)",
          }}
        >
          Para quién es SNEAX
        </p>

        {/* Headline */}
        <div ref={headlineRef} style={{ lineHeight: 0.9 }}>
          <div
            className="font-display"
            style={{
              fontSize:      "clamp(5rem, 11vw, 10rem)",
              letterSpacing: "-0.01em",
              color:         "#F0EDE8",
              display:       "block",
            }}
          >
            PARA
          </div>
          <div
            className="font-display"
            style={{
              fontSize:      "clamp(5rem, 11vw, 10rem)",
              letterSpacing: "-0.01em",
              color:         "#F0EDE8",
              display:       "block",
            }}
          >
            TOD<span style={{ color: "#F2BF1A" }}>X</span>S
          </div>
        </div>

        {/* Subtext */}
        <p
          ref={subtextRef}
          className="font-body"
          style={{
            fontSize:   16,
            lineHeight: 1.65,
            color:      "#8A8680",
            maxWidth:   400,
            marginTop:  "clamp(2rem, 4vw, 3rem)",
          }}
        >
          Sneakers de calidad, sin filtros de tribu ni billetera.
        </p>
      </div>

      {/* ── Right: Sneaker image ────────────────────────────────────────────── */}
      <div
        ref={imgPanelRef}
        style={{
          position:  "relative",
          overflow:  "hidden",
          minHeight: "40dvh",
        }}
      >
        {/* Gradient — blends left edge into dark background */}
        <div
          aria-hidden="true"
          style={{
            position:      "absolute",
            inset:         0,
            background:    "linear-gradient(90deg, #0F0F0F 0%, transparent 35%)",
            zIndex:        1,
            pointerEvents: "none",
          }}
        />
        <Image
          src="/images/products/asicsFeatured.png"
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
      </div>
    </section>
  );
}
