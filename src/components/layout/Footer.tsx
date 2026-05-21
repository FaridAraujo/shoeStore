"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";

// ─── Data ─────────────────────────────────────────────────────────────────────

const MALLS = [
  "Multiplaza Escazú",
  "Multiplaza Curridabat",
  "Lincoln Plaza",
  "City Mall Alajuela",
  "Mall Oxígeno",
] as const;

// ─── Palette ──────────────────────────────────────────────────────────────────
const BG      = "#1A1816";
const DIVIDER = "#2A2724";
const WHITE   = "#F0EDE8";
const MUTED   = "rgba(240,237,232,0.35)";

// ─── Social icon components ───────────────────────────────────────────────────

function IconInstagram() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  );
}

function IconWhatsApp() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M20.52 3.48A11.93 11.93 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.11.55 4.16 1.6 5.97L0 24l6.18-1.62A11.94 11.94 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.2-1.25-6.21-3.48-8.52Z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M17.5 14.9c-.3-.15-1.77-.87-2.04-.97-.28-.1-.48-.15-.68.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.68-1.63-.93-2.23-.24-.59-.49-.51-.68-.52h-.58c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.47s1.06 2.86 1.21 3.06c.15.2 2.09 3.19 5.06 4.47.71.31 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z"
        fill="currentColor"
        opacity="0.9"
      />
    </svg>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      style={{
        color:      WHITE,
        opacity:    0.55,
        display:    "flex",
        alignItems: "center",
        transition: "opacity 160ms ease-out",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
      onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.55")}
    >
      {children}
    </a>
  );
}

/** Dot separator between inline items */
function Dot() {
  return (
    <span
      aria-hidden="true"
      className="font-body"
      style={{ fontSize: 10, color: MUTED, opacity: 0.6, userSelect: "none" }}
    >
      ·
    </span>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-footer-row]", {
        y:        12,
        opacity:  0,
        duration: 0.55,
        ease:     "power3.out",
        scrollTrigger: {
          trigger: footerRef.current,
          start:   "top 92%",
          once:    true,
        },
      });
    }, footerRef);
    return () => ctx.revert();
  }, []);

  const scrollToStores = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = document.getElementById("sucursales");
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth" });
    }
    // else: let the href="/#sucursales" handle navigation naturally
  };

  return (
    <footer
      ref={footerRef}
      style={{ background: BG, width: "100%", position: "relative", overflow: "hidden" }}
    >
      {/* ── Logo watermark + copyright debajo ──────────────────────────── */}
      <div
        aria-hidden="true"
        style={{
          position:       "absolute",
          inset:          0,
          display:        "flex",
          flexDirection:  "column",
          alignItems:     "center",
          justifyContent: "center",
          pointerEvents:  "none",
          zIndex:         0,
          gap:            "0.6rem",
        }}
      >
        <div style={{ position: "relative", width: "82%", height: "55%" }}>
          <Image
            src="/images/logo-white.png"
            alt=""
            fill
            className="object-contain"
            style={{ opacity: 0.055 }}
          />
        </div>
        <span
          className="font-body"
          style={{
            fontSize:      11,
            color:         WHITE,
            letterSpacing: "0.1em",
            opacity:       0.18,
            userSelect:    "none",
          }}
        >
          © 2026
        </span>
      </div>

      {/* ── Content ─────────────────────────────────────────────────────── */}
      <div style={{ position: "relative", zIndex: 1, borderTop: `1px solid ${DIVIDER}` }}>
        <div
          data-footer-row
          style={{
            display:        "flex",
            alignItems:     "center",
            padding:        "clamp(2rem, 3.5vw, 3rem) clamp(2rem, 5vw, 5rem)",
          }}
        >

          {/* LEFT — Tiendas inline */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.55rem", flexWrap: "wrap" }}>
            <span
              className="font-body"
              style={{
                fontSize:      10,
                fontWeight:    500,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color:         MUTED,
                flexShrink:    0,
              }}
            >
              Tiendas
            </span>
            {MALLS.map((mall, i) => (
              <span key={mall} style={{ display: "flex", alignItems: "center", gap: "0.55rem" }}>
                {i > 0 && <Dot />}
                <a
                  href="/#sucursales"
                  className="font-body"
                  onClick={scrollToStores}
                  style={{
                    fontSize:       12,
                    color:          WHITE,
                    textDecoration: "none",
                    opacity:        0.65,
                    whiteSpace:     "nowrap",
                    transition:     "opacity 160ms ease-out",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.65")}
                >
                  {mall}
                </a>
              </span>
            ))}
          </div>

          {/* CENTER — pure spacer */}
          <div style={{ flex: 1 }} />

          {/* RIGHT — Síguenos con íconos */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexShrink: 0 }}>
            <span
              className="font-body"
              style={{
                fontSize:      10,
                fontWeight:    500,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color:         MUTED,
              }}
            >
              Síguenos
            </span>
            <SocialLink href="https://instagram.com/sneax_cr" label="Instagram @sneax_cr">
              <IconInstagram />
            </SocialLink>
            <SocialLink href="https://wa.me/50688888888" label="WhatsApp">
              <IconWhatsApp />
            </SocialLink>
          </div>

        </div>
      </div>
    </footer>
  );
}
