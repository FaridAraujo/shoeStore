"use client";

import Link from "next/link";

/**
 * Minimal header for auth + checkout pages.
 * Just the SNEAX wordmark as a home link — no cart, no nav links.
 */
export default function AuthHeader({ dark = false }: { dark?: boolean }) {
  const ink = dark ? "#F0EDE8" : "#0A0A0A";

  return (
    <header
      style={{
        position:       "fixed",
        top:            0,
        left:           0,
        right:          0,
        zIndex:         50,
        height:         64,
        display:        "flex",
        alignItems:     "center",
        justifyContent: "space-between",
        padding:        "0 clamp(1.25rem, 4vw, 3rem)",
        background:     dark ? "rgba(10,10,10,0.85)" : "rgba(240,237,232,0.88)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderBottom:   `1px solid ${dark ? "rgba(240,237,232,0.07)" : "rgba(10,10,10,0.07)"}`,
      }}
    >
      {/* Wordmark → home */}
      <Link
        href="/"
        className="font-display"
        style={{
          fontSize:       20,
          letterSpacing:  "0.1em",
          color:          ink,
          textDecoration: "none",
          lineHeight:     1,
        }}
      >
        SNEAX
      </Link>

      {/* Back to home */}
      <Link
        href="/"
        className="font-body font-medium uppercase"
        style={{
          fontSize:       10,
          letterSpacing:  "0.2em",
          color:          dark ? "rgba(240,237,232,0.45)" : "#8A8680",
          textDecoration: "none",
          display:        "flex",
          alignItems:     "center",
          gap:            6,
          transition:     "color 150ms ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = ink)}
        onMouseLeave={(e) => (e.currentTarget.style.color = dark ? "rgba(240,237,232,0.45)" : "#8A8680")}
      >
        ← Inicio
      </Link>
    </header>
  );
}
