"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { PRODUCTS, BRANDS } from "@/lib/products";

// ─── Per-brand accent colours (dominant swatch of each brand's products) ─────
const BRAND_ACCENT: Record<string, string> = {
  NIKE:          "#E8E4DD",
  JORDAN:        "#2A3A52",
  ADIDAS:        "#C9A24B",
  ASICS:         "#D8D4CC",
  "NEW BALANCE": "#C7B79E",
  CONVERSE:      "#3E5B8C",
  TIMBERLAND:    "#C8A567",
  PUMA:          "#4A3526",
  VEJA:          "#B8B4AC",
  GOLA:          "#B8B4AC",
};

// ─── Brand card ───────────────────────────────────────────────────────────────
function BrandCard({ brand }: { brand: string }) {
  const router   = useRouter();
  const count    = PRODUCTS.filter((p) => p.brand === brand).length;
  const hasStock = count > 0;
  const accent   = BRAND_ACCENT[brand] ?? "#B8B4AC";

  function handleClick() {
    if (!hasStock) return;
    router.push(`/collection?brand=${encodeURIComponent(brand)}`);
  }

  return (
    <motion.button
      onClick={handleClick}
      disabled={!hasStock}
      className="relative text-left w-full overflow-hidden"
      style={{
        background:   "#1A1816",
        border:       "1px solid #2A2724",
        borderRadius: 3,
        cursor:       hasStock ? "pointer" : "default",
        aspectRatio:  "3 / 2",
        display:      "flex",
        flexDirection:"column",
        justifyContent:"flex-end",
        padding:      "clamp(1.25rem, 2.5vw, 1.75rem)",
      }}
      whileHover={hasStock ? "hovered" : undefined}
      transition={{ duration: 0.18, ease: "easeOut" }}
    >
      {/* Accent fill — scales up on hover */}
      <motion.div
        aria-hidden="true"
        variants={{ hovered: { opacity: 0.1, scale: 1.08 } }}
        initial={{ opacity: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
        style={{
          position:     "absolute",
          inset:        0,
          background:   accent,
          borderRadius: 3,
        }}
      />

      {/* Border highlight */}
      <motion.div
        aria-hidden="true"
        variants={{ hovered: { opacity: 1 } }}
        initial={{ opacity: 0 }}
        transition={{ duration: 0.22 }}
        style={{
          position:     "absolute",
          inset:        0,
          border:       `1px solid ${accent}`,
          borderRadius: 3,
          pointerEvents:"none",
          opacity:      0.35,
        }}
      />

      {/* Brand name */}
      <div className="relative z-10">
        <motion.span
          className="font-display block"
          variants={{ hovered: { color: "#F0EDE8" } }}
          style={{
            fontSize:      "clamp(2rem, 4.5vw, 3.5rem)",
            lineHeight:    0.9,
            letterSpacing: "0.02em",
            color:         hasStock ? "rgba(240,237,232,0.82)" : "rgba(240,237,232,0.22)",
          }}
          transition={{ duration: 0.18 }}
        >
          {brand}
        </motion.span>

        <div
          className="flex items-center gap-3"
          style={{ marginTop: "0.65rem" }}
        >
          {hasStock ? (
            <>
              <span
                className="font-body"
                style={{
                  fontSize:      10,
                  letterSpacing: "0.2em",
                  color:         "rgba(240,237,232,0.28)",
                  textTransform: "uppercase",
                }}
              >
                {count} {count === 1 ? "modelo" : "modelos"}
              </span>
              <motion.span
                variants={{ hovered: { x: 4, color: accent, opacity: 1 } }}
                style={{ fontSize: 13, color: "rgba(240,237,232,0.2)", opacity: 0.6 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
              >
                →
              </motion.span>
            </>
          ) : (
            <span
              className="font-body uppercase"
              style={{
                fontSize:      9,
                letterSpacing: "0.22em",
                color:         "rgba(240,237,232,0.18)",
                border:        "1px solid rgba(240,237,232,0.1)",
                padding:       "3px 8px",
                borderRadius:  2,
              }}
            >
              Próximamente
            </span>
          )}
        </div>
      </div>
    </motion.button>
  );
}

// ─── Grid ─────────────────────────────────────────────────────────────────────
export default function BrandsGrid() {
  // Separate brands with stock from those without, show stocked first
  const withStock    = BRANDS.filter((b) => b !== "TODOS" && PRODUCTS.some((p) => p.brand === b));
  const withoutStock = BRANDS.filter((b) => b !== "TODOS" && !PRODUCTS.some((p) => p.brand === b));
  const ordered      = [...withStock, ...withoutStock];

  return (
    <section
      style={{
        background: "#0E0C0A",
        minHeight:  "100dvh",
        padding:    "clamp(4rem, 7vw, 6rem) clamp(1.5rem, 5vw, 5rem)",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: "clamp(2.5rem, 5vw, 4rem)" }}>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1,  y: 0  }}
          transition={{ duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
          className="font-display"
          style={{
            fontSize:      "clamp(4rem, 10vw, 8rem)",
            lineHeight:    0.88,
            letterSpacing: "-0.01em",
            color:         "#F0EDE8",
          }}
        >
          Marcas
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1,  y: 0  }}
          transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1], delay: 0.1 }}
          className="font-body"
          style={{
            fontSize:      13,
            letterSpacing: "0.04em",
            color:         "rgba(240,237,232,0.35)",
            marginTop:     "1rem",
            maxWidth:      "42ch",
          }}
        >
          Selección curada de las marcas que definen la cultura del sneaker.
        </motion.p>
      </div>

      {/* Grid */}
      <div
        className="grid"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(clamp(220px, 28vw, 320px), 1fr))",
          gap:                 "clamp(0.75rem, 1.5vw, 1rem)",
        }}
      >
        {ordered.map((brand, i) => (
          <motion.div
            key={brand}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1,  y: 0  }}
            transition={{
              duration: 0.4,
              ease:     [0.23, 1, 0.32, 1],
              delay:    i * 0.04,
            }}
          >
            <BrandCard brand={brand} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
