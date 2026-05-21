"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { gsap } from "@/lib/gsap";

// ─── Store data ───────────────────────────────────────────────────────────────
/*
  Fotos: colocá las imágenes en /public/images/stores/{id}.webp (o .jpg)
  Mientras no existan se muestra el fallback con el nombre del local.
*/
const LOCATIONS = [
  {
    id:      "multiplaza-escazu",
    name:    "Multiplaza Escazú",
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

// ─── Map options builder ──────────────────────────────────────────────────────
function buildOptions(loc: Location, isApple: boolean, isMobile: boolean) {
  const { lat, lng, name } = loc;
  const dest  = `${lat},${lng}`;
  const label = encodeURIComponent(`SNEAX ${name}`);

  return [
    {
      id:    "google",
      label: "Google Maps",
      url:   `https://maps.google.com/maps?daddr=${dest}`,
      show:  true,
    },
    {
      id:    "waze",
      label: "Waze",
      url:   `https://waze.com/ul?ll=${dest}&navigate=yes`,
      show:  true,
    },
    {
      id:    "apple",
      label: "Apple Maps",
      url:   `https://maps.apple.com/?daddr=${dest}&dirflg=d`,
      show:  isApple,
    },
    {
      id:    "uber",
      label: "Uber",
      url:   `https://m.uber.com/ul/?action=setPickup&dropoff[latitude]=${lat}&dropoff[longitude]=${lng}&dropoff[nickname]=${label}`,
      show:  isMobile,
    },
    {
      id:    "didi",
      label: "DiDi",
      url:   `https://web.didiglobal.com/cr/passenger/?dest_lat=${lat}&dest_lng=${lng}&dest_name=${label}`,
      show:  isMobile,
    },
  ].filter((o) => o.show);
}

// ─── Cómo llegar — chooser button + floating menu ────────────────────────────
function MapChooser({ location }: { location: Location }) {
  const [open, setOpen]     = useState(false);
  const { isApple, isMobile } = usePlatform();
  const containerRef          = useRef<HTMLDivElement>(null);

  const options = buildOptions(location, isApple, isMobile);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    window.addEventListener("mousedown", handler);
    return () => window.removeEventListener("mousedown", handler);
  }, [open]);

  // Close on ESC
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  return (
    <div ref={containerRef} style={{ position: "relative", display: "inline-block" }}>

      {/* Floating menu — appears above the button */}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1   }}
          transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
          style={{
            position:    "absolute",
            bottom:      "calc(100% + 10px)",
            left:        0,
            minWidth:    172,
            background:  "rgba(14,12,10,0.96)",
            border:      "1px solid rgba(240,237,232,0.12)",
            overflow:    "hidden",
            zIndex:      10,
          }}
          role="menu"
        >
          {options.map((opt, i) => (
            <a
              key={opt.id}
              href={opt.url}
              target="_blank"
              rel="noopener noreferrer"
              role="menuitem"
              className="font-body"
              onClick={() => setOpen(false)}
              style={{
                display:        "flex",
                alignItems:     "center",
                justifyContent: "space-between",
                padding:        "11px 16px",
                fontSize:       12,
                letterSpacing:  "0.04em",
                color:          "rgba(240,237,232,0.82)",
                textDecoration: "none",
                borderTop:      i > 0 ? "1px solid rgba(240,237,232,0.07)" : "none",
                transition:     "background 120ms ease-out, color 120ms ease-out",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(242,191,26,0.12)";
                e.currentTarget.style.color      = "#F0EDE8";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color      = "rgba(240,237,232,0.82)";
              }}
            >
              {opt.label}
              <span style={{ opacity: 0.4, marginLeft: 12, fontSize: 11 }}>↗</span>
            </a>
          ))}
        </motion.div>
      )}

      {/* Trigger button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="font-body font-medium uppercase"
        aria-expanded={open}
        aria-haspopup="menu"
        style={{
          display:        "inline-flex",
          alignItems:     "center",
          gap:            "0.5rem",
          fontSize:       11,
          letterSpacing:  "0.16em",
          color:          "#0A0A0A",
          background:     open ? "rgba(242,191,26,0.85)" : "#F2BF1A",
          padding:        "10px 20px",
          border:         "none",
          cursor:         "pointer",
          transition:     "background 150ms ease-out, transform 100ms ease-out",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(242,191,26,0.85)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = open ? "rgba(242,191,26,0.85)" : "#F2BF1A")}
        onMouseDown={(e)  => (e.currentTarget.style.transform  = "scale(0.98)")}
        onMouseUp={(e)    => (e.currentTarget.style.transform   = "scale(1)")}
      >
        Cómo llegar
        <span style={{ transition: "transform 180ms ease-out", display: "inline-block", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}>
          ↑
        </span>
      </button>

    </div>
  );
}

// ─── Left: location list item ─────────────────────────────────────────────────
function LocationItem({
  location,
  isActive,
  onClick,
}: {
  location: Location;
  isActive: boolean;
  onClick:  () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.button
      data-location-item
      onClick={onClick}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={()  => setHovered(false)}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.08, ease: "easeOut" }}
      className="w-full text-left flex items-center justify-between"
      style={{
        padding:      "20px 8px 20px 20px",
        borderLeft:   `2px solid ${isActive ? "#F2BF1A" : "transparent"}`,
        borderBottom: "1px solid #B8B4AC",
        background:   "transparent",
        cursor:       "pointer",
        transition:   "border-left-color 200ms ease",
      }}
    >
      <div className="flex flex-col gap-0.5">
        <motion.span
          className="font-body font-bold"
          animate={{ color: isActive || hovered ? "#0A0A0A" : "#5A5850" }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          style={{ fontSize: 16, letterSpacing: "-0.01em", lineHeight: 1.3 }}
        >
          {location.name}
        </motion.span>
        <span
          className="font-body"
          style={{ fontSize: 12, color: "#B8B4AC", letterSpacing: "0.04em" }}
        >
          {location.city}
        </span>
      </div>

      <motion.span
        animate={{
          color: isActive || hovered ? "#F2BF1A" : "#B8B4AC",
          x:     hovered ? 4 : 0,
        }}
        transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
        style={{ fontSize: 18, lineHeight: 1, flexShrink: 0, marginLeft: 16, marginRight: 4 }}
        aria-hidden="true"
      >
        →
      </motion.span>
    </motion.button>
  );
}

// ─── Right: store photo panel ─────────────────────────────────────────────────
function StorePanel({ location }: { location: Location }) {
  const [imgError, setImgError] = useState(false);

  useEffect(() => { setImgError(false); }, [location.id]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", minHeight: "clamp(480px, 52vh, 580px)" }}>

      {/* Photo or fallback */}
      <motion.div
        key={location.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
        style={{ position: "absolute", inset: 0 }}
      >
        {imgError ? (
          <div
            style={{
              width:          "100%",
              height:         "100%",
              background:     "#D4D0C8",
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
            }}
          >
            <span
              className="font-display"
              style={{
                fontSize:      "clamp(2.5rem, 5vw, 4rem)",
                color:         "rgba(10,10,10,0.12)",
                letterSpacing: "-0.02em",
                textAlign:     "center",
                padding:       "0 2rem",
              }}
            >
              {location.name.toUpperCase()}
            </span>
          </div>
        ) : (
          <Image
            src={location.image}
            alt={`SNEAX ${location.name}`}
            fill
            className="object-cover"
            onError={() => setImgError(true)}
          />
        )}
      </motion.div>

      {/* Top fade — emerges from section background */}
      <div
        aria-hidden="true"
        style={{
          position:      "absolute",
          top:           0,
          left:          0,
          right:         0,
          height:        "22%",
          background:    "linear-gradient(to bottom, #E8E6E1 0%, transparent 100%)",
          pointerEvents: "none",
          zIndex:        2,
        }}
      />

      {/* Bottom gradient + info overlay */}
      <div
        style={{
          position:       "absolute",
          inset:          0,
          background:     "linear-gradient(to top, rgba(8,7,6,0.90) 0%, rgba(8,7,6,0.45) 45%, transparent 75%)",
          display:        "flex",
          flexDirection:  "column",
          justifyContent: "flex-end",
          padding:        "clamp(1.75rem, 3vw, 2.5rem)",
          zIndex:         3,
        }}
      >
        <motion.div
          key={location.id + "-info"}
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0,  opacity: 1 }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1], delay: 0.1 }}
        >
          <h3
            className="font-display"
            style={{
              fontSize:      "clamp(2rem, 3.5vw, 3rem)",
              lineHeight:    0.95,
              letterSpacing: "-0.01em",
              color:         "#F0EDE8",
              marginBottom:  "0.5rem",
            }}
          >
            {location.name.toUpperCase()}
          </h3>

          <p
            className="font-body"
            style={{
              fontSize:      12,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color:         "rgba(240,237,232,0.55)",
              marginBottom:  "1rem",
            }}
          >
            {location.city}
          </p>

          <div style={{ height: 1, background: "rgba(240,237,232,0.15)", marginBottom: "1rem" }} />

          <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem", marginBottom: "1.5rem" }}>
            <span className="font-body" style={{ fontSize: 13, color: "rgba(240,237,232,0.75)", letterSpacing: "0.02em" }}>
              {location.address}
            </span>
            <span className="font-body" style={{ fontSize: 12, color: "rgba(240,237,232,0.45)", letterSpacing: "0.04em" }}>
              {location.hours}
            </span>
          </div>

          <MapChooser location={location} />
        </motion.div>
      </div>
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────
export default function Sucursales() {
  const [activeId, setActiveId] = useState<LocationId>("multiplaza-escazu");
  const sectionRef  = useRef<HTMLElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);

  const active = LOCATIONS.find((l) => l.id === activeId) ?? LOCATIONS[0];

  // Pre-select a store when the hero sheet dispatches sneax:selectStore
  useEffect(() => {
    const handler = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      if (LOCATIONS.some((l) => l.id === id)) {
        setActiveId(id as LocationId);
      }
    };
    window.addEventListener("sneax:selectStore", handler);
    return () => window.removeEventListener("sneax:selectStore", handler);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!sectionRef.current) return;

      if (parallaxRef.current) {
        gsap.fromTo(
          parallaxRef.current,
          { y: 0 },
          {
            y:    -60,
            ease: "none",
            scrollTrigger: {
              trigger:             sectionRef.current,
              start:               "top bottom",
              end:                 "bottom top",
              scrub:               true,
              invalidateOnRefresh: true,
            },
          },
        );
      }

      gsap.from("[data-suc-header]", {
        y: 28, opacity: 0, duration: 0.7, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%", once: true },
      });

      gsap.from("[data-location-item]", {
        x: -28, opacity: 0, duration: 0.55, stagger: 0.07, ease: "power3.out",
        scrollTrigger: { trigger: "[data-location-list]", start: "top 78%", once: true },
      });

      gsap.from("[data-store-panel]", {
        opacity: 0, duration: 0.9, delay: 0.15, ease: "power3.out",
        scrollTrigger: { trigger: "[data-location-list]", start: "top 78%", once: true },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="sucursales"
      data-nav-theme="light"
      className="w-full"
      style={{
        background: "#E8E6E1",
        padding: "clamp(4rem, 8vw, 7rem) clamp(1.5rem, 5vw, 5rem)",
      }}
    >
      {/* Header */}
      <div ref={parallaxRef} style={{ marginBottom: "clamp(2rem, 3.5vw, 3rem)", willChange: "transform" }}>
        <div data-suc-header>
          <h2
            className="font-display"
            style={{
              fontSize: "clamp(3.5rem, 7vw, 5.5rem)", lineHeight: 0.92,
              letterSpacing: "-0.01em", color: "#0A0A0A", marginBottom: "0.75rem",
            }}
          >
            ENCONTRANOS
          </h2>
          <p className="font-body" style={{ fontSize: 13, letterSpacing: "0.16em", textTransform: "uppercase", color: "#B8B4AC" }}>
            5 tiendas en Costa Rica
          </p>
        </div>
      </div>

      {/* Two-column layout */}
      <div style={{ display: "flex", gap: "clamp(1.5rem, 3vw, 3rem)", alignItems: "flex-end" }}>

        {/* LEFT — list */}
        <div data-location-list style={{ width: "38%", flexShrink: 0 }}>
          <div style={{ borderTop: "1px solid #B8B4AC" }} />
          {LOCATIONS.map((loc) => (
            <LocationItem
              key={loc.id}
              location={loc}
              isActive={activeId === loc.id}
              onClick={() => setActiveId(loc.id)}
            />
          ))}
        </div>

        {/* RIGHT — store photo panel */}
        <div data-store-panel style={{ flex: 1, overflow: "hidden" }}>
          <StorePanel location={active} />
        </div>
      </div>
    </section>
  );
}
