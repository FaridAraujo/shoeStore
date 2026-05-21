"use client";

import { motion } from "framer-motion";
import Link from "next/link";

// ─── Stat block ───────────────────────────────────────────────────────────────
function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span
        className="font-display"
        style={{
          fontSize:      "clamp(3.5rem, 7vw, 6rem)",
          lineHeight:    0.88,
          letterSpacing: "-0.01em",
          color:         "#0A0A0A",
        }}
      >
        {value}
      </span>
      <span
        className="font-body uppercase"
        style={{
          fontSize:      10,
          letterSpacing: "0.26em",
          color:         "#B8B4AC",
        }}
      >
        {label}
      </span>
    </div>
  );
}

// ─── Divider ─────────────────────────────────────────────────────────────────
function Divider() {
  return <div style={{ height: 1, background: "#B8B4AC", opacity: 0.35 }} />;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function AboutContent() {
  return (
    <section
      data-nav-theme="light"
      style={{
        background: "#E8E6E1",
        paddingTop: "clamp(7rem, 12vw, 10rem)",
        paddingBottom: "clamp(4rem, 8vw, 7rem)",
        paddingLeft:  "clamp(1.5rem, 5vw, 5rem)",
        paddingRight: "clamp(1.5rem, 5vw, 5rem)",
      }}
    >
      {/* ── Eyebrow ─────────────────────────────────────────────────────── */}
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1,  y: 0  }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        className="font-body font-medium uppercase"
        style={{
          fontSize:      10,
          letterSpacing: "0.28em",
          color:         "#B8B4AC",
          marginBottom:  "1.25rem",
        }}
      >
        SNEAX — Costa Rica
      </motion.p>

      {/* ── Headline ────────────────────────────────────────────────────── */}
      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1,  y: 0  }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1], delay: 0.05 }}
        className="font-display"
        style={{
          fontSize:      "clamp(4.5rem, 11vw, 9rem)",
          lineHeight:    0.88,
          letterSpacing: "-0.01em",
          color:         "#0A0A0A",
          maxWidth:      "12ch",
          marginBottom:  "clamp(3rem, 6vw, 5rem)",
        }}
      >
        Para<br />TODXS
      </motion.h1>

      <Divider />

      {/* ── Two column layout ───────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1,  y: 0  }}
        transition={{ duration: 0.55, ease: [0.23, 1, 0.32, 1], delay: 0.12 }}
        style={{
          display:             "grid",
          gridTemplateColumns: "1fr 1fr",
          gap:                 "clamp(3rem, 6vw, 6rem)",
          paddingTop:          "clamp(2.5rem, 5vw, 4rem)",
          paddingBottom:       "clamp(2.5rem, 5vw, 4rem)",
        }}
      >
        {/* Left — statement */}
        <div>
          <p
            className="font-body"
            style={{
              fontSize:   "clamp(1.1rem, 2vw, 1.4rem)",
              lineHeight: 1.55,
              color:      "#0A0A0A",
              maxWidth:   "32ch",
            }}
          >
            SNEAX nació en Costa Rica con una idea simple: que los mejores sneakers del mundo estén
            disponibles para quienes los viven de verdad.
          </p>
          <p
            className="font-body"
            style={{
              fontSize:   "clamp(1.1rem, 2vw, 1.4rem)",
              lineHeight: 1.55,
              color:      "#5A5850",
              maxWidth:   "32ch",
              marginTop:  "1.25rem",
            }}
          >
            Sin pretensiones. Sin lista de espera de días. Sin importar si sos del centro
            o de la aurora — encontranos cerca.
          </p>
        </div>

        {/* Right — manifesto list */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {[
            { num: "01", text: "Selección curada — solo entra lo que vale la pena." },
            { num: "02", text: "Precios directos — sin intermediarios que inflen el costo." },
            { num: "03", text: "Cultura real — drops, collabs y lanzamientos que le importan a quienes los viven." },
          ].map(({ num, text }) => (
            <div key={num} style={{ display: "flex", gap: "1.25rem", alignItems: "flex-start" }}>
              <span
                className="font-body font-medium"
                style={{
                  fontSize:      10,
                  letterSpacing: "0.18em",
                  color:         "#B8B4AC",
                  paddingTop:    3,
                  flexShrink:    0,
                }}
              >
                {num}
              </span>
              <p
                className="font-body"
                style={{ fontSize: 14, lineHeight: 1.6, color: "#5A5850" }}
              >
                {text}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      <Divider />

      {/* ── Stats ───────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1,  y: 0  }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1], delay: 0.18 }}
        style={{
          display:             "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap:                 "clamp(2rem, 4vw, 4rem)",
          paddingTop:          "clamp(2.5rem, 5vw, 4rem)",
          paddingBottom:       "clamp(2.5rem, 5vw, 4rem)",
        }}
      >
        <Stat value="5"         label="Tiendas en Costa Rica"  />
        <Stat value="10+"       label="Marcas en catálogo"     />
        <Stat value="@sneax_cr" label="Síguenos en Instagram"  />
      </motion.div>

      <Divider />

      {/* ── CTA ─────────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1,  y: 0  }}
        transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1], delay: 0.22 }}
        style={{
          display:        "flex",
          alignItems:     "center",
          justifyContent: "space-between",
          paddingTop:     "clamp(2rem, 4vw, 3rem)",
          flexWrap:       "wrap",
          gap:            "1.5rem",
        }}
      >
        <p
          className="font-body"
          style={{ fontSize: 13, color: "#8A8680", letterSpacing: "0.04em", maxWidth: "44ch" }}
        >
          ¿Tenés consultas sobre pedidos, tallas o disponibilidad?{" "}
          <a
            href="https://wa.me/50688888888"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#0A0A0A", textDecoration: "underline", textUnderlineOffset: 3 }}
          >
            Escribinos por WhatsApp
          </a>{" "}
          — respondemos rápido.
        </p>

        <div className="flex items-center gap-3">
          <Link
            href="/collection"
            className="font-body font-medium uppercase"
            style={{
              fontSize:       11,
              letterSpacing:  "0.16em",
              color:          "#0A0A0A",
              border:         "1px solid #0A0A0A",
              padding:        "12px 28px",
              textDecoration: "none",
              transition:     "background 160ms ease-out, color 160ms ease-out",
              display:        "inline-block",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "#0A0A0A";
              (e.currentTarget as HTMLElement).style.color      = "#E8E6E1";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
              (e.currentTarget as HTMLElement).style.color      = "#0A0A0A";
            }}
          >
            Ver colección →
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
