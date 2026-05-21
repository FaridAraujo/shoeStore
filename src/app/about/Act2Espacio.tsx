"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

// Headline split into words with line groupings
const LINES = [
  ["ENTRE", "LO", "COMÚN"],
  ["Y", "LO", "ASPIRACIONAL"],
  ["EXISTE", "SNEAX"],
] as const;

const SUBTEXT =
  "No somos una tienda deportiva. No somos una boutique inalcanzable. Somos el punto medio que Costa Rica necesitaba.";

export default function Act2Espacio() {
  const trackRef   = useRef<HTMLDivElement>(null);
  const wordsRef   = useRef<HTMLSpanElement[]>([]);
  const subtextRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!trackRef.current) return;

    const ctx = gsap.context(() => {
      // Set initial state — words hidden below
      gsap.set(wordsRef.current, { opacity: 0, y: 36 });
      gsap.set(subtextRef.current, { opacity: 0, y: 16 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: trackRef.current,
          start:   "top top",
          end:     "bottom bottom",
          scrub:   1.5,
        },
      });

      // Words stagger in across 0–70% of scroll progress
      tl.to(
        wordsRef.current,
        {
          opacity:  1,
          y:        0,
          stagger:  0.055,
          ease:     "power3.out",
          duration: 0.5,
        },
        0,
      );

      // Subtext fades in at 72 %
      tl.to(
        subtextRef.current,
        { opacity: 1, y: 0, ease: "power2.out", duration: 0.25 },
        0.72,
      );
    }, trackRef);

    return () => ctx.revert();
  }, []);

  let wordIndex = 0;

  return (
    <div ref={trackRef} style={{ height: "200dvh" }}>
      <section
        data-nav-theme="light"
        style={{
          position:       "sticky",
          top:            0,
          height:         "100dvh",
          background:     "#E8E6E1",
          display:        "flex",
          flexDirection:  "column",
          alignItems:     "center",
          justifyContent: "center",
          overflow:       "hidden",
          padding:        "0 clamp(1.5rem, 5vw, 5rem)",
        }}
      >
        {/* X tile pattern — repeated across the entire background */}
        <div
          aria-hidden="true"
          style={{
            position:         "absolute",
            inset:            0,
            backgroundImage:  "url('/images/x-sneax.svg')",
            backgroundRepeat: "repeat",
            backgroundSize:   "clamp(90px, 13vw, 160px) clamp(90px, 13vw, 160px)",
            opacity:          0.055,
            pointerEvents:    "none",
          }}
        />

        {/* Headline */}
        <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
          {/* Thin accent rule above headline */}
          <div style={{
            width:        "clamp(3rem, 8vw, 6rem)",
            height:       1,
            background:   "#0A0A0A",
            margin:       "0 auto clamp(1.5rem, 3vw, 2.5rem)",
            opacity:      0.25,
          }} />
          {LINES.map((line, li) => (
            <div
              key={li}
              style={{
                display:        "flex",
                justifyContent: "center",
                gap:            "clamp(0.6rem, 1.8vw, 1.6rem)",
                marginBottom:   li < LINES.length - 1 ? "clamp(0.4rem, 1.2vw, 1.1rem)" : 0,
              }}
            >
              {line.map((word) => {
                const i = wordIndex++;
                return (
                  <span
                    key={word + i}
                    ref={(el) => { if (el) wordsRef.current[i] = el; }}
                    className="font-display"
                    style={{
                      fontSize:      "clamp(3rem, 8.5vw, 7.5rem)",
                      letterSpacing: "-0.01em",
                      color:         "#0A0A0A",
                      display:       "inline-block",
                    }}
                  >
                    {word}
                  </span>
                );
              })}
            </div>
          ))}

          {/* Subtext */}
          <p
            ref={subtextRef}
            className="font-body"
            style={{
              fontSize:    16,
              lineHeight:  1.65,
              color:       "#5A5850",
              maxWidth:    480,
              textAlign:   "center",
              margin:      "clamp(1.5rem, 3vw, 2.5rem) auto 0",
              opacity:     0,
            }}
          >
            {SUBTEXT}
          </p>
        </div>
      </section>
    </div>
  );
}
