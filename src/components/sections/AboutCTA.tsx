import Link from "next/link";

/**
 * Card editorial que lleva a /about.
 * Mobile: full-width, compacta.
 * Desktop: centrada con max-width, padding más generoso.
 */
export default function AboutCTA() {
  return (
    <Link
      href="/about"
      className="about-cta-card"
      style={{
        display:        "flex",
        flexDirection:  "column",
        padding:        "clamp(28px, 5vw, 64px) clamp(20px, 8vw, 120px)",
        background:     "#0A0A0A",
        textDecoration: "none",
        position:       "relative",
        overflow:       "hidden",
      }}
    >
      {/* Marca de agua — logo X */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/x-sneax.svg"
        alt=""
        aria-hidden="true"
        style={{
          position:      "absolute",
          right:         "-4%",
          top:           "50%",
          transform:     "translateY(-50%)",
          width:         "clamp(260px, 45%, 520px)",
          height:        "auto",
          opacity:       0.06,
          filter:        "invert(1)",
          pointerEvents: "none",
          userSelect:    "none",
        }}
      />

      {/* Eyebrow */}
      <span
        className="font-body"
        style={{
          fontSize:      9,
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          color:         "#F2BF1A",
          marginBottom:  "0.5rem",
        }}
      >
        Sobre nosotros
      </span>

      {/* Headline */}
      <span
        className="font-display"
        style={{
          fontSize:      "clamp(2.2rem, 6vw, 5rem)",
          lineHeight:    0.95,
          letterSpacing: "-0.01em",
          color:         "#F0EDE8",
          marginBottom:  "0.9rem",
        }}
      >
        NUESTRA HISTORIA
      </span>

      {/* Footer row */}
      <span
        className="font-body"
        style={{
          display:        "flex",
          alignItems:     "center",
          justifyContent: "space-between",
          fontSize:       11,
          letterSpacing:  "0.08em",
          color:          "rgba(240,237,232,0.45)",
        }}
      >
        <span>Conocé quiénes somos</span>
        <span style={{ color: "#F2BF1A", fontSize: 14 }}>→</span>
      </span>
    </Link>
  );
}
