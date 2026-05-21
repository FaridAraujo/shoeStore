"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Schedule {
  days:  readonly number[]; // 0 = Dom … 6 = Sáb
  open:  number;            // hora 24 h (10 = 10:00)
  close: number;
}

// ─── Store data ───────────────────────────────────────────────────────────────
const STORES = [
  {
    id:       "multiplaza-escazu",
    name:     "Multiplaza Escazú",
    city:     "Escazú, San José",
    hours:    "Lun – Dom · 10:00 – 21:00",
    schedule: { days: [0,1,2,3,4,5,6] as const, open: 10, close: 21 },
    lat: 9.9443694,  lng: -84.1512101,
  },
  {
    id:       "multiplaza-curridabat",
    name:     "Multiplaza Curridabat",
    city:     "Curridabat, San José",
    hours:    "Lun – Dom · 10:00 – 21:00",
    schedule: { days: [0,1,2,3,4,5,6] as const, open: 10, close: 21 },
    lat: 9.9174928,  lng: -84.0495251,
  },
  {
    id:       "lincoln-plaza",
    name:     "Lincoln Plaza",
    city:     "Moravia, San José",
    hours:    "Lun – Sáb · 10:00 – 20:00",
    schedule: { days: [1,2,3,4,5,6] as const, open: 10, close: 20 },
    lat: 9.9624241,  lng: -84.0559914,
  },
  {
    id:       "city-mall-alajuela",
    name:     "City Mall Alajuela",
    city:     "Alajuela Centro",
    hours:    "Lun – Dom · 10:00 – 21:00",
    schedule: { days: [0,1,2,3,4,5,6] as const, open: 10, close: 21 },
    lat: 10.0041875, lng: -84.2116875,
  },
  {
    id:       "mall-oxigeno",
    name:     "Mall Oxígeno",
    city:     "La Aurora, Heredia",
    hours:    "Lun – Dom · 10:00 – 21:00",
    schedule: { days: [0,1,2,3,4,5,6] as const, open: 10, close: 21 },
    lat: 9.9934427,  lng: -84.1342624,
  },
] as const;

type Store = (typeof STORES)[number];
type UserPos = { lat: number; lng: number } | null;

// ─── Utilities ────────────────────────────────────────────────────────────────

/** Haversine distance in km */
function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R    = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLng = (lng2 - lng1) * (Math.PI / 180);
  const a    =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * (Math.PI / 180)) *
    Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.asin(Math.sqrt(a));
}

/** Live open/closed status, computed in Costa Rica time (UTC−6, no DST) */
function storeStatus(schedule: Schedule): { open: boolean; label: string } {
  const now  = new Date();
  const cr   = new Date(now.getTime() - 6 * 60 * 60 * 1000); // UTC−6
  const day  = cr.getUTCDay();
  const hour = cr.getUTCHours() + cr.getUTCMinutes() / 60;
  const isDay   = (schedule.days as readonly number[]).includes(day);
  const inHours = hour >= schedule.open && hour < schedule.close;

  if (isDay && inHours) {
    if (hour >= schedule.close - 1) {
      const mins = Math.round((schedule.close - hour) * 60);
      return { open: true, label: `Cierra en ${mins} min` };
    }
    return { open: true, label: `Abierto · cierra ${schedule.close}:00` };
  }
  return { open: false, label: "Cerrado" };
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

// ─── Geolocation hook — silent-fail, purely optional ─────────────────────────
function useUserLocation() {
  const [pos, setPos] = useState<UserPos>(null);
  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      p  => setPos({ lat: p.coords.latitude, lng: p.coords.longitude }),
      () => {}, // permission denied or unavailable → just hide distances
      { timeout: 6000, maximumAge: 60_000 },
    );
  }, []);
  return pos;
}

// ─── Map options — passes user origin when available so apps skip "from" step ─
function buildMapOptions(
  store:    Store,
  isApple:  boolean,
  isMobile: boolean,
  userPos:  UserPos,
) {
  const dest  = `${store.lat},${store.lng}`;
  const label = encodeURIComponent(`SNEAX ${store.name}`);
  const orig  = userPos ? `${userPos.lat},${userPos.lng}` : "";

  return [
    {
      id:    "google",
      label: "Google Maps",
      url:   orig
        ? `https://maps.google.com/maps?saddr=${orig}&daddr=${dest}`
        : `https://maps.google.com/maps?daddr=${dest}`,
      show: true,
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
      label: "Pedir Uber",
      url:   `https://m.uber.com/ul/?action=setPickup&dropoff[latitude]=${store.lat}&dropoff[longitude]=${store.lng}&dropoff[nickname]=${label}`,
      show:  isMobile,
    },
    {
      id:    "didi",
      label: "Pedir DiDi",
      url:   `https://web.didiglobal.com/cr/passenger/?dest_lat=${store.lat}&dest_lng=${store.lng}&dest_name=${label}`,
      show:  isMobile,
    },
  ].filter(o => o.show);
}

// ─── Nav app icons ─────────────────────────────────────────────────────────────
function NavIcon({ id }: { id: string }) {
  switch (id) {
    case "google": return (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
          stroke="currentColor" strokeWidth="1.6" fill="none"/>
        <circle cx="12" cy="9" r="2.4" stroke="currentColor" strokeWidth="1.6"/>
      </svg>
    );
    case "waze": return (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 3C7.03 3 3 7.03 3 12c0 2.3.82 4.4 2.18 6.04L5 22l4.04-.99A8.96 8.96 0 0 0 12 21c4.97 0 9-4.03 9-9s-4.03-9-9-9z"
          stroke="currentColor" strokeWidth="1.5" fill="none"/>
        <circle cx="9.5" cy="11" r="1" fill="currentColor"/>
        <circle cx="14.5" cy="11" r="1" fill="currentColor"/>
        <path d="M9.5 14.5s.83 1.5 2.5 1.5 2.5-1.5 2.5-1.5"
          stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    );
    case "apple": return (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M12 3v3M12 18v3M3 12h3M18 12h3"
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M12 8l-2 8 2-2 2 2-2-8z" fill="currentColor" opacity="0.75"/>
      </svg>
    );
    default: return ( // Uber / DiDi — car
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 13l.8-3.2A2 2 0 0 1 6.72 8h10.56a2 2 0 0 1 1.92 1.6L20 13v2.5a.5.5 0 0 1-.5.5H4.5a.5.5 0 0 1-.5-.5V13z"
          stroke="currentColor" strokeWidth="1.4" fill="none"/>
        <circle cx="7.5" cy="17.5" r="1.5" stroke="currentColor" strokeWidth="1.3"/>
        <circle cx="16.5" cy="17.5" r="1.5" stroke="currentColor" strokeWidth="1.3"/>
      </svg>
    );
  }
}

// ─── Variants ─────────────────────────────────────────────────────────────────
const SPRING = { type: "spring", stiffness: 340, damping: 34, mass: 1 } as const;

const sheetVariants = {
  hidden:  { y: "100%" },
  visible: { y: 0,      transition: SPRING },
  exit:    { y: "100%", transition: { duration: 0.24, ease: [0.32, 0, 0.67, 0] as const } },
};
const listVariants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.055, delayChildren: 0.14 } },
};
const rowVariants = {
  hidden:  { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.28, ease: [0.23, 1, 0.32, 1] as const } },
};

// ─── Store row ────────────────────────────────────────────────────────────────
function StoreRow({
  store, isLast, isApple, isMobile, userPos, onClose,
}: {
  store:    Store;
  isLast:   boolean;
  isApple:  boolean;
  isMobile: boolean;
  userPos:  UserPos;
  onClose:  () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const options  = buildMapOptions(store, isApple, isMobile, userPos);
  const status   = storeStatus(store.schedule);

  const distKm    = userPos ? haversineKm(userPos.lat, userPos.lng, store.lat, store.lng) : null;
  const distLabel = distKm !== null
    ? distKm < 1 ? `${Math.round(distKm * 1000)} m` : `${distKm.toFixed(1)} km`
    : null;

  return (
    <div style={{ borderBottom: isLast ? "none" : "1px solid rgba(240,237,232,0.05)" }}>

      {/* ── Row trigger ── */}
      <button
        onClick={() => setExpanded(v => !v)}
        className="w-full text-left font-body"
        style={{
          display:        "flex",
          alignItems:     "center",
          gap:            12,
          padding:        "17px 24px",
          background:     expanded ? "rgba(242,191,26,0.04)" : "transparent",
          border:         "none",
          borderLeft:     `2px solid ${expanded ? "#F2BF1A" : "transparent"}`,
          cursor:         "pointer",
          transition:     "background 130ms ease-out, border-left-color 130ms ease-out",
          width:          "100%",
        }}
        onMouseEnter={e => {
          if (!expanded) {
            e.currentTarget.style.background      = "rgba(242,191,26,0.04)";
            e.currentTarget.style.borderLeftColor = "#F2BF1A";
          }
        }}
        onMouseLeave={e => {
          if (!expanded) {
            e.currentTarget.style.background      = "transparent";
            e.currentTarget.style.borderLeftColor = "transparent";
          }
        }}
      >
        {/* Name + city + distance */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1, minWidth: 0 }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: "#F0EDE8", letterSpacing: "-0.01em", lineHeight: 1.2 }}>
            {store.name}
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, color: "rgba(240,237,232,0.3)", letterSpacing: "0.04em" }}>
              {store.city}
            </span>
            {distLabel && (
              <>
                <span style={{ color: "rgba(240,237,232,0.15)", fontSize: 8 }}>·</span>
                <span style={{ fontSize: 11, color: "rgba(242,191,26,0.65)", letterSpacing: "0.04em" }}>
                  {distLabel}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Status + toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{
              width: 5, height: 5, borderRadius: "50%", flexShrink: 0,
              background:  status.open ? "#4ADE80" : "rgba(240,237,232,0.18)",
              boxShadow:   status.open ? "0 0 6px rgba(74,222,128,0.5)" : "none",
              transition:  "background 300ms, box-shadow 300ms",
            }}/>
            <span className="font-body" style={{
              fontSize:      10,
              letterSpacing: "0.05em",
              color:         status.open ? "rgba(74,222,128,0.75)" : "rgba(240,237,232,0.22)",
            }}>
              {status.label}
            </span>
          </div>

          <span style={{
            fontSize:   18,
            color:      expanded ? "#F2BF1A" : "rgba(240,237,232,0.22)",
            display:    "inline-block",
            transform:  expanded ? "rotate(45deg)" : "rotate(0deg)",
            transition: "color 130ms ease-out, transform 200ms ease-out",
          }} aria-hidden="true">+</span>
        </div>
      </button>

      {/* ── Navigation options — list rows, not pills ── */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div style={{ paddingBottom: 6 }}>
              {options.map((opt, i) => (
                <a
                  key={opt.id}
                  href={opt.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={onClose}
                  className="font-body"
                  style={{
                    display:        "flex",
                    alignItems:     "center",
                    justifyContent: "space-between",
                    padding:        "11px 24px 11px 40px",
                    textDecoration: "none",
                    color:          "rgba(240,237,232,0.42)",
                    borderTop:      i === 0 ? "none" : "1px solid rgba(240,237,232,0.04)",
                    transition:     "background 110ms ease-out, color 110ms ease-out",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = "rgba(242,191,26,0.06)";
                    e.currentTarget.style.color      = "#F0EDE8";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color      = "rgba(240,237,232,0.42)";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <NavIcon id={opt.id} />
                    <span style={{ fontSize: 12, letterSpacing: "0.04em" }}>{opt.label}</span>
                  </div>
                  <span style={{ fontSize: 11, opacity: 0.28 }}>↗</span>
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────
export default function HeroLocationsSheet() {
  const [open, setOpen]       = useState(false);
  const [mounted, setMounted] = useState(false);
  const { isApple, isMobile } = usePlatform();
  const userPos               = useUserLocation();
  const sheetRef              = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const h = (e: PointerEvent) => {
      if (sheetRef.current && !sheetRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const t = setTimeout(() => document.addEventListener("pointerdown", h), 50);
    return () => { clearTimeout(t); document.removeEventListener("pointerdown", h); };
  }, [open]);

  function handleScrollToStores() {
    setOpen(false);
    setTimeout(() => {
      document.getElementById("sucursales")?.scrollIntoView({ behavior: "smooth" });
    }, 150);
  }

  return (
    <>
      {/* ── Trigger ───────────────────────────────────────────────────────── */}
      <button
        onClick={() => setOpen(true)}
        className="group font-body text-[10px] md:text-[11px] tracking-[0.3em] uppercase
                   flex items-center gap-[0.6em] bg-transparent border-0 cursor-pointer
                   transition-colors duration-500"
        style={{ color: "#F2BF1A", padding: "10px 6px", margin: "-10px -6px" }}
      >
        <span className="group-hover:text-white/60 transition-colors duration-500">
          5 tiendas en Costa Rica — Encontranos
        </span>
        <span
          className="inline-block transition-transform duration-300 group-hover:translate-y-[3px]"
          aria-hidden="true"
        >
          ↓
        </span>
      </button>

      {mounted && createPortal(
        <AnimatePresence>
        {open && (
          <>
            {/* ── Backdrop ──────────────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="fixed inset-0 z-[48]"
              style={{
                background:           "rgba(4,3,2,0.72)",
                backdropFilter:       "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
                pointerEvents:        "none",
              }}
            />

            {/* ── Sheet ─────────────────────────────────────────────────── */}
            <motion.div
              ref={sheetRef}
              variants={sheetVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              drag="y"
              dragConstraints={{ top: 0 }}
              dragElastic={{ top: 0, bottom: 0.3 }}
              onDragEnd={(_, info) => {
                if (info.offset.y > 90 || info.velocity.y > 350) setOpen(false);
              }}
              className="fixed left-0 right-0 bottom-0 z-[49] flex flex-col"
              style={{
                maxHeight:            "calc(100vh - 72px)",
                background:           "rgba(14,12,10,0.97)",
                backdropFilter:       "blur(32px)",
                WebkitBackdropFilter: "blur(32px)",
                borderRadius:         "14px 14px 0 0",
                borderTop:            "1px solid rgba(240,237,232,0.08)",
                userSelect:           "none",
              }}
            >
              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-1 flex-shrink-0 cursor-grab active:cursor-grabbing">
                <div style={{ width: 36, height: 4, borderRadius: 2, background: "rgba(240,237,232,0.16)" }} />
              </div>

              {/* Header */}
              <div
                style={{
                  display:        "flex",
                  alignItems:     "center",
                  justifyContent: "space-between",
                  padding:        "10px 24px 14px",
                  borderBottom:   "1px solid rgba(240,237,232,0.06)",
                  flexShrink:     0,
                }}
              >
                <button
                  onClick={handleScrollToStores}
                  className="font-body uppercase"
                  style={{
                    fontSize:      10,
                    letterSpacing: "0.28em",
                    color:         "rgba(240,237,232,0.3)",
                    background:    "transparent",
                    border:        "none",
                    cursor:        "pointer",
                    padding:       0,
                    display:       "flex",
                    alignItems:    "center",
                    gap:           "0.45em",
                    transition:    "color 150ms",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = "rgba(240,237,232,0.72)")}
                  onMouseLeave={e => (e.currentTarget.style.color = "rgba(240,237,232,0.3)")}
                >
                  Nuestras tiendas
                  <span style={{ fontSize: 11 }}>→</span>
                </button>

                <button
                  onClick={() => setOpen(false)}
                  aria-label="Cerrar"
                  style={{
                    display:         "flex",
                    alignItems:      "center",
                    justifyContent:  "center",
                    width:           28,
                    height:          28,
                    borderRadius:    "50%",
                    background:      "rgba(240,237,232,0.07)",
                    border:          "none",
                    cursor:          "pointer",
                    color:           "rgba(240,237,232,0.45)",
                    transition:      "background 130ms ease-out, color 130ms ease-out",
                    flexShrink:      0,
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = "rgba(240,237,232,0.13)";
                    e.currentTarget.style.color      = "rgba(240,237,232,0.85)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = "rgba(240,237,232,0.07)";
                    e.currentTarget.style.color      = "rgba(240,237,232,0.45)";
                  }}
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                    <line x1="1" y1="1" x2="9" y2="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <line x1="9" y1="1" x2="1" y2="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>

              {/* Scrollable store list */}
              <motion.div
                variants={listVariants}
                style={{ overflowY: "auto", flex: 1 }}
              >
                {STORES.map((store, i) => (
                  <motion.div key={store.id} variants={rowVariants}>
                    <StoreRow
                      store={store}
                      isLast={i === STORES.length - 1}
                      isApple={isApple}
                      isMobile={isMobile}
                      userPos={userPos}
                      onClose={() => setOpen(false)}
                    />
                  </motion.div>
                ))}
              </motion.div>

              {/* Footer — solo íconos sociales */}
              <div
                style={{
                  flexShrink:    0,
                  borderTop:     "1px solid rgba(240,237,232,0.05)",
                  padding:       "16px 24px",
                  paddingBottom: "calc(16px + env(safe-area-inset-bottom, 0px))",
                  display:       "flex",
                  alignItems:    "center",
                  justifyContent:"flex-end",
                  gap:           18,
                }}
              >
                <a
                  href="https://instagram.com/sneax_cr"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram @sneax_cr"
                  style={{ color: "rgba(240,237,232,0.2)", transition: "color 130ms ease-out", display: "flex" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "rgba(240,237,232,0.65)")}
                  onMouseLeave={e => (e.currentTarget.style.color = "rgba(240,237,232,0.2)")}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="currentColor" strokeWidth="1.5"/>
                    <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.5"/>
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>
                  </svg>
                </a>
                <a
                  href="https://wa.me/50688888888"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  style={{ color: "rgba(240,237,232,0.2)", transition: "color 130ms ease-out", display: "flex" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "rgba(240,237,232,0.65)")}
                  onMouseLeave={e => (e.currentTarget.style.color = "rgba(240,237,232,0.2)")}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M20.52 3.48A11.93 11.93 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.11.55 4.16 1.6 5.97L0 24l6.18-1.62A11.94 11.94 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.2-1.25-6.21-3.48-8.52Z"
                      stroke="currentColor" strokeWidth="1.5" fill="none"/>
                    <path d="M17.5 14.9c-.3-.15-1.77-.87-2.04-.97-.28-.1-.48-.15-.68.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.68-1.63-.93-2.23-.24-.59-.49-.51-.68-.52h-.58c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.47s1.06 2.86 1.21 3.06c.15.2 2.09 3.19 5.06 4.47.71.31 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z"
                      fill="currentColor" opacity="0.9"/>
                  </svg>
                </a>
              </div>
            </motion.div>
          </>
        )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  );
}
