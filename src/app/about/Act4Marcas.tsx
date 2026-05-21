"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

const BRANDS = [
  "NIKE", "ADIDAS", "ASICS", "NEW BALANCE",
  "CONVERSE", "VEJA", "PUMA", "GOLA",
] as const;

// Three copies → seamless at -33.33% (one full set width)
const LOOP = [...BRANDS, ...BRANDS, ...BRANDS];

// Row config: speed in px/frame (+ = left, – = right), opacity
const ROWS = [
  { speed:  0.50, opacity: 1.00 },
  { speed: -0.32, opacity: 0.28 },
] as const;

export default function Act4Marcas() {
  const sectionRef  = useRef<HTMLElement>(null);
  const eyebrowRef  = useRef<HTMLParagraphElement>(null);
  const subtextRef  = useRef<HTMLParagraphElement>(null);

  // One ref per track div
  const t0 = useRef<HTMLDivElement>(null);
  const t1 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tracks = [t0.current, t1.current];
    if (tracks.some((t) => !t)) return;

    // Measure one set width (track has 3 copies → divide by 3)
    const setW = tracks.map((t) => t!.scrollWidth / 3);

    // Current x position per row (px, always positive, wraps at setW)
    const pos = [0, 0, 0];

    // Drag / momentum state
    const drag = { active: false, lastX: 0, vx: 0 };

    let raf = 0;

    function tick() {
      // Decay momentum after release
      if (!drag.active) drag.vx *= 0.90;

      ROWS.forEach((row, i) => {
        // auto-scroll + shared drag momentum
        pos[i] += row.speed - drag.vx;
        // wrap within [0, setW)
        pos[i] = ((pos[i] % setW[i]) + setW[i]) % setW[i];
        tracks[i]!.style.transform = `translateX(-${pos[i]}px)`;
      });

      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);

    // ── Pointer events (mouse + touch via pointer API) ──────────────────
    const el = sectionRef.current!;

    function onDown(e: PointerEvent) {
      drag.active = true;
      drag.lastX  = e.clientX;
      drag.vx     = 0;
      el.setPointerCapture(e.pointerId);
      el.style.cursor = "grabbing";
    }

    function onMove(e: PointerEvent) {
      if (!drag.active) return;
      const dx = e.clientX - drag.lastX;
      drag.vx   = -dx * 0.6;     // invert: drag right → rows move right
      drag.lastX = e.clientX;
    }

    function onUp() {
      drag.active      = false;
      el.style.cursor  = "grab";
      // momentum carries on via the decay in tick()
    }

    el.addEventListener("pointerdown",   onDown);
    el.addEventListener("pointermove",   onMove);
    el.addEventListener("pointerup",     onUp);
    el.addEventListener("pointercancel", onUp);

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointerdown",   onDown);
      el.removeEventListener("pointermove",   onMove);
      el.removeEventListener("pointerup",     onUp);
      el.removeEventListener("pointercancel", onUp);
    };
  }, []);

  // Eyebrow + subtext fade-in on scroll
  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      const trigger = { trigger: sectionRef.current, start: "top 70%", once: true };
      gsap.from(eyebrowRef.current,  { opacity: 0, y: 16, duration: 0.7, ease: "power3.out",              scrollTrigger: trigger });
      gsap.from(subtextRef.current,  { opacity: 0, y: 16, duration: 0.7, ease: "power3.out", delay: 0.2,  scrollTrigger: trigger });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      data-nav-theme="light"
      style={{
        background:    "#E8E6E1",
        padding:       "clamp(4rem, 8vw, 7rem) 0",
        display:       "flex",
        flexDirection: "column",
        alignItems:    "center",
        justifyContent:"center",
        overflow:      "hidden",
        gap:           "clamp(1.2rem, 2.5vw, 2rem)",
        cursor:        "grab",
        userSelect:    "none",
      }}
    >
      {/* Eyebrow */}
      <p
        ref={eyebrowRef}
        className="font-body font-medium uppercase"
        style={{ fontSize: 9, letterSpacing: "0.28em", color: "#B8B4AC" }}
      >
        Marcas disponibles
      </p>

      {/* Framed marquee block */}
      <div
        style={{
          width:         "100%",
          borderTop:     "1px solid rgba(10,10,10,0.12)",
          borderBottom:  "1px solid rgba(10,10,10,0.12)",
          padding:       "clamp(0.9rem, 2vw, 1.8rem) 0",
          display:       "flex",
          flexDirection: "column",
          gap:           "clamp(0.5rem, 1.2vw, 1rem)",
          overflow:      "hidden",
        }}
      >
        {/* Row 0 — full opacity, fastest, left */}
        <div style={{ overflow: "hidden" }}>
          <div ref={t0} style={{ display: "flex", width: "max-content", gap: "clamp(2rem, 5vw, 5rem)", willChange: "transform" }}>
            {LOOP.map((brand, i) => (
              <span key={i} className="font-display" style={{ fontSize: "clamp(2.4rem, 5.5vw, 5rem)", letterSpacing: "0.02em", color: "#0A0A0A", whiteSpace: "nowrap" }}>
                {brand}
              </span>
            ))}
          </div>
        </div>

        {/* Row 1 — medium opacity, slower, right */}
        <div style={{ overflow: "hidden" }}>
          <div ref={t1} style={{ display: "flex", width: "max-content", gap: "clamp(2rem, 5vw, 5rem)", opacity: 0.28, willChange: "transform" }}>
            {LOOP.map((brand, i) => (
              <span key={i} className="font-display" style={{ fontSize: "clamp(2.4rem, 5.5vw, 5rem)", letterSpacing: "0.02em", color: "#0A0A0A", whiteSpace: "nowrap" }}>
                {brand}
              </span>
            ))}
          </div>
        </div>

      </div>

      {/* Subtext */}
      <p ref={subtextRef} className="font-body" style={{ fontSize: 16, color: "#8A8680" }}>
        Curados. Sin prisa.
      </p>
    </section>
  );
}
