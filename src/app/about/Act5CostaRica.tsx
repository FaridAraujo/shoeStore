"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { gsap } from "@/lib/gsap";

// ─── Store data (mirrors Sucursales.tsx) ─────────────────────────────────────
const LOCATIONS = [
  {
    id:      "multiplaza-escazu",
    name:    "Multiplaza Escazú",
    short:   "Escazú",
    city:    "Escazú, San José",
    address: "Local 112, Nivel 1",
    hours:   "Lun – Dom  10:00 – 21:00",
    lat:     9.9443694,
    lng:     -84.1512101,
    image:   "/images/stores/multiplaza-escazu.webp",
  },
  {
    id:      "multiplaza-curridabat",
    name:    "Multiplaza Curridabat",
    short:   "Curridabat",
    city:    "Curridabat, San José",
    address: "Local 84, Planta Baja",
    hours:   "Lun – Dom  10:00 – 21:00",
    lat:     9.9174928,
    lng:     -84.0495251,
    image:   "/images/stores/multiplaza-curridabat.jpg",
  },
  {
    id:      "lincoln-plaza",
    name:    "Lincoln Plaza",
    short:   "Lincoln",
    city:    "Moravia, San José",
    address: "Local 32, Nivel 1",
    hours:   "Lun – Sáb  10:00 – 20:00  ·  Dom  11:00 – 19:00",
    lat:     9.9624241,
    lng:     -84.0559914,
    image:   "/images/stores/lincoln-plaza.jpg",
  },
  {
    id:      "city-mall-alajuela",
    name:    "City Mall Alajuela",
    short:   "Alajuela",
    city:    "Alajuela Centro",
    address: "Local 215, Nivel 2",
    hours:   "Lun – Dom  10:00 – 21:00",
    lat:     10.0041875,
    lng:     -84.2116875,
    image:   "/images/stores/city-mall-alajuela.jpg",
  },
  {
    id:      "mall-oxigeno",
    name:    "Mall Oxígeno",
    short:   "Oxígeno",
    city:    "La Aurora, Heredia",
    address: "Local 178, Nivel 1",
    hours:   "Lun – Dom  10:00 – 21:00",
    lat:     9.9934427,
    lng:     -84.1342624,
    image:   "/images/stores/mall-oxigeno.jpg",
  },
] as const;

type LocationId = (typeof LOCATIONS)[number]["id"];
type Location   = (typeof LOCATIONS)[number];

// ─── Map projection ───────────────────────────────────────────────────────────
const LNG_MIN = -85.9, LNG_RANGE = 3.4, VB_W = 280;
const LAT_MAX = 11.20, LAT_RANGE = 3.2, VB_H = 190;
function project(lat: number, lng: number) {
  return {
    x: ((lng - LNG_MIN) / LNG_RANGE) * VB_W,
    y: ((LAT_MAX - lat) / LAT_RANGE) * VB_H,
  };
}

// ─── Platform detection ───────────────────────────────────────────────────────
function usePlatform() {
  const [isApple,  setIsApple]  = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const ua = navigator.userAgent;
    setIsApple(/iPhone|iPad|iPod|Mac/i.test(ua));
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(ua));
  }, []);
  return { isApple, isMobile };
}

// ─── Cómo llegar chooser ──────────────────────────────────────────────────────
function MapChooser({ location }: { location: Location }) {
  const [open, setOpen]         = useState(false);
  const { isApple, isMobile }   = usePlatform();
  const containerRef            = useRef<HTMLDivElement>(null);

  const options = [
    { id: "google", label: "Google Maps", url: `https://maps.google.com/maps?daddr=${location.lat},${location.lng}`, show: true },
    { id: "waze",   label: "Waze",        url: `https://waze.com/ul?ll=${location.lat},${location.lng}&navigate=yes`, show: true },
    { id: "apple",  label: "Apple Maps",  url: `https://maps.apple.com/?daddr=${location.lat},${location.lng}&dirflg=d`, show: isApple },
    { id: "uber",   label: "Uber",        url: `https://m.uber.com/ul/?action=setPickup&dropoff[latitude]=${location.lat}&dropoff[longitude]=${location.lng}&dropoff[nickname]=${encodeURIComponent(`SNEAX ${location.name}`)}`, show: isMobile },
    { id: "didi",   label: "DiDi",        url: `https://web.didiglobal.com/cr/passenger/?dest_lat=${location.lat}&dest_lng=${location.lng}&dest_name=${encodeURIComponent(`SNEAX ${location.name}`)}`, show: isMobile },
  ].filter((o) => o.show);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => { if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false); };
    window.addEventListener("mousedown", close);
    return () => window.removeEventListener("mousedown", close);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open]);

  return (
    <div ref={containerRef} style={{ position: "relative", display: "inline-block" }}>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
          style={{ position: "absolute", bottom: "calc(100% + 10px)", left: 0, minWidth: 172, background: "rgba(14,12,10,0.96)", border: "1px solid rgba(240,237,232,0.12)", overflow: "hidden", zIndex: 10 }}
          role="menu"
        >
          {options.map((opt, i) => (
            <a key={opt.id} href={opt.url} target="_blank" rel="noopener noreferrer" role="menuitem"
              className="font-body" onClick={() => setOpen(false)}
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 16px", fontSize: 12, letterSpacing: "0.04em", color: "rgba(240,237,232,0.82)", textDecoration: "none", borderTop: i > 0 ? "1px solid rgba(240,237,232,0.07)" : "none", transition: "background 120ms ease-out, color 120ms ease-out" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(242,191,26,0.12)"; e.currentTarget.style.color = "#F0EDE8"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(240,237,232,0.82)"; }}
            >
              {opt.label}
              <span style={{ opacity: 0.4, marginLeft: 12, fontSize: 11 }}>↗</span>
            </a>
          ))}
        </motion.div>
      )}
      <button onClick={() => setOpen((v) => !v)} className="font-body font-medium uppercase"
        aria-expanded={open} aria-haspopup="menu"
        style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontSize: 11, letterSpacing: "0.16em", color: "#0A0A0A", background: "#F2BF1A", padding: "10px 20px", border: "none", cursor: "pointer", transition: "background 150ms ease-out, transform 100ms ease-out" }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(242,191,26,0.85)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "#F2BF1A")}
        onMouseDown={(e)  => (e.currentTarget.style.transform  = "scale(0.98)")}
        onMouseUp={(e)    => (e.currentTarget.style.transform  = "scale(1)")}
      >
        Cómo llegar
        <span style={{ transition: "transform 180ms ease-out", display: "inline-block", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}>↑</span>
      </button>
    </div>
  );
}

// ─── Tab strip — store selector with sliding indicator ───────────────────────
function StoreTabs({ activeId, onSelect }: { activeId: LocationId; onSelect: (id: LocationId) => void }) {
  const stripRef = useRef<HTMLDivElement>(null);

  // Keep the active tab in view on mobile (horizontal scroll)
  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    const el = strip.querySelector<HTMLButtonElement>(`[data-tab-id="${activeId}"]`);
    el?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [activeId]);

  return (
    <div
      ref={stripRef}
      role="tablist"
      style={{
        display:        "flex",
        gap:            "clamp(1.4rem, 3.5vw, 3rem)",
        overflowX:      "auto",
        borderBottom:   "1px solid rgba(10,10,10,0.14)",
        scrollbarWidth: "none",
      }}
    >
      {LOCATIONS.map((loc) => {
        const isActive = loc.id === activeId;
        return (
          <button
            key={loc.id}
            data-tab-id={loc.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelect(loc.id)}
            className="font-body font-medium uppercase"
            style={{
              position:      "relative",
              flexShrink:    0,
              padding:       "0 0 14px",
              background:    "none",
              border:        "none",
              cursor:        "pointer",
              fontSize:      "clamp(11px, 1.3vw, 13px)",
              letterSpacing: "0.14em",
              whiteSpace:    "nowrap",
              color:         isActive ? "#0A0A0A" : "#A8A49C",
              transition:    "color 160ms ease-out",
            }}
            onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.color = "#6A665E"; }}
            onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.color = "#A8A49C"; }}
          >
            {loc.short}
            {isActive && (
              <motion.div
                layoutId="act5-tab-indicator"
                transition={{ type: "spring", stiffness: 420, damping: 36 }}
                style={{ position: "absolute", left: 0, right: 0, bottom: -1, height: 3, background: "#F2BF1A" }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

// ─── Store detail panel ───────────────────────────────────────────────────────
function StorePanel({ location }: { location: Location }) {
  const [imgError, setImgError] = useState(false);
  useEffect(() => { setImgError(false); }, [location.id]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", minHeight: "clamp(380px, 45vh, 520px)", overflow: "hidden" }}>
      <motion.div key={location.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }} style={{ position: "absolute", inset: 0 }}>
        {imgError ? (
          <div style={{ width: "100%", height: "100%", background: "#D4D0C8", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span className="font-display" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "rgba(10,10,10,0.12)", letterSpacing: "-0.02em", textAlign: "center", padding: "0 2rem" }}>
              {location.name.toUpperCase()}
            </span>
          </div>
        ) : (
          <Image src={location.image} alt={`SNEAX ${location.name}`} fill className="object-cover" onError={() => setImgError(true)} />
        )}
      </motion.div>

      {/* Gradient + info overlay */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(8,7,6,0.92) 0%, rgba(8,7,6,0.4) 50%, transparent 80%)", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "clamp(1.5rem, 2.5vw, 2rem)", zIndex: 3 }}>
        <motion.div key={location.id + "-info"} initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1], delay: 0.1 }}>
          <h3 className="font-display" style={{ fontSize: "clamp(1.8rem, 3vw, 2.8rem)", lineHeight: 0.95, letterSpacing: "-0.01em", color: "#F0EDE8", marginBottom: "0.4rem" }}>
            {location.name.toUpperCase()}
          </h3>
          <p className="font-body" style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(240,237,232,0.5)", marginBottom: "0.9rem" }}>
            {location.city}
          </p>
          <div style={{ height: 1, background: "rgba(240,237,232,0.14)", marginBottom: "0.9rem" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", marginBottom: "1.25rem" }}>
            <span className="font-body" style={{ fontSize: 13, color: "rgba(240,237,232,0.78)" }}>{location.address}</span>
            <span className="font-body" style={{ fontSize: 11, color: "rgba(240,237,232,0.42)", letterSpacing: "0.03em" }}>{location.hours}</span>
          </div>
          <MapChooser location={location} />
        </motion.div>
      </div>
    </div>
  );
}

// ─── Decorative map — lights up the active store (not clickable) ─────────────
function StoreMap({ activeId }: { activeId: LocationId }) {
  return (
    <svg
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      style={{ width: "100%", maxWidth: 680, height: "auto", overflow: "visible" }}
      aria-hidden="true"
    >
      <image href="/images/crmapa.png" x="0" y="0" width={VB_W} height={VB_H} preserveAspectRatio="xMidYMid meet" />

      {LOCATIONS.map((store) => {
        const { x, y } = project(store.lat, store.lng);
        const isActive = store.id === activeId;

        return (
          <g key={store.id}>
            {/* Outer pulse ring — active only */}
            <circle cx={x} cy={y} r={isActive ? 11 : 0} fill="#F2BF1A" opacity={isActive ? 0.18 : 0} style={{ transition: "r 300ms ease, opacity 300ms ease" }} />
            {/* Middle ring — active only */}
            <circle cx={x} cy={y} r={isActive ? 6.5 : 0} fill="#F2BF1A" opacity={isActive ? 0.32 : 0} style={{ transition: "r 280ms ease, opacity 280ms ease" }} />
            {/* Core dot — always visible, faint when inactive */}
            <circle
              cx={x} cy={y}
              r={isActive ? 4.5 : 2.4}
              fill="#F2BF1A"
              opacity={isActive ? 1 : 0.4}
              stroke="#0A0A0A"
              strokeWidth={isActive ? 1.4 : 0.7}
              style={{ transition: "r 240ms ease, opacity 240ms ease, stroke-width 240ms ease" }}
            />
            {/* Label — active only */}
            <text
              x={x + 8} y={y + 3.5}
              fontSize={7}
              fontFamily="inherit"
              fill="#0A0A0A"
              opacity={isActive ? 0.8 : 0}
              style={{ transition: "opacity 240ms ease", pointerEvents: "none", userSelect: "none" }}
            >
              {store.short}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────
export default function Act5CostaRica() {
  const [activeId, setActiveId] = useState<LocationId>("multiplaza-escazu");
  const sectionRef = useRef<HTMLElement>(null);

  const active = LOCATIONS.find((l) => l.id === activeId) ?? LOCATIONS[0];

  // Receive store selection from homepage hero (same event as Sucursales)
  useEffect(() => {
    const handler = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      if (LOCATIONS.some((l) => l.id === id)) setActiveId(id as LocationId);
    };
    window.addEventListener("sneax:selectStore", handler);
    return () => window.removeEventListener("sneax:selectStore", handler);
  }, []);

  useEffect(() => {
    if (!sectionRef.current) return;

    const mm = gsap.matchMedia();

    // ── Desktop — entrada animada con scroll ─────────────────────────────────
    mm.add("(min-width: 769px)", () => {
      const ctx = gsap.context(() => {
        const trigger = { trigger: sectionRef.current, start: "top 65%", once: true };
        gsap.from("[data-act5-headline]", { opacity: 0, y: 32, duration: 0.7, ease: "power3.out", scrollTrigger: trigger });
        gsap.from("[data-act5-tabs]",     { opacity: 0, y: 20, duration: 0.7, ease: "power3.out", delay: 0.08, scrollTrigger: trigger });
        gsap.from("[data-act5-map]",      { opacity: 0, scale: 0.96, duration: 0.8, ease: "power3.out", delay: 0.16, transformOrigin: "center center", scrollTrigger: trigger });
        gsap.from("[data-act5-panel]",    { opacity: 0, x: 24, duration: 0.8, ease: "power3.out", delay: 0.2, scrollTrigger: trigger });
      }, sectionRef);
      return () => ctx.revert();
    });

    // ── Mobile — sin animaciones de entrada para que el contenido nunca quede
    //    en opacity:0. El gsap.from inicializa los elementos en invisible; si el
    //    trigger falla (cálculo de posición con sticky sections) quedan en blanco.

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="sucursales"
      data-nav-theme="light"
      style={{
        background: "#E8E6E1",
        borderTop:  "1px solid #B8B4AC",
        padding:    "clamp(5rem, 10vw, 8rem) clamp(1.5rem, 5vw, 5rem)",
      }}
    >
      {/* Headline */}
      <div data-act5-headline style={{ marginBottom: "clamp(2rem, 4vw, 3rem)" }}>
        <h2 className="font-display" style={{ fontSize: "clamp(4rem, 10vw, 8.5rem)", lineHeight: 0.88, letterSpacing: "-0.01em", color: "#0A0A0A", marginBottom: "0.5rem" }}>
          ENCONTRANOS.
        </h2>
        <p className="font-body" style={{ fontSize: 13, letterSpacing: "0.16em", textTransform: "uppercase", color: "#B8B4AC" }}>
          5 tiendas en Costa Rica — elegí una sucursal
        </p>
      </div>

      {/* Tab selector */}
      <div data-act5-tabs style={{ marginBottom: "clamp(2rem, 4vw, 3.5rem)" }}>
        <StoreTabs activeId={activeId} onSelect={setActiveId} />
      </div>

      {/* Two-column body */}
      <div className="flex flex-col md:grid md:grid-cols-2" style={{ gap: "clamp(2rem, 4vw, 4rem)", alignItems: "center" }}>

        {/* Left — map (lights up active store) */}
        <div data-act5-map style={{ display: "flex", justifyContent: "center" }}>
          <StoreMap activeId={activeId} />
        </div>

        {/* Right — store detail panel */}
        <div data-act5-panel>
          <StorePanel location={active} />
        </div>
      </div>
    </section>
  );
}
