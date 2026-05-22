"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "@/lib/gsap";
import { useCart } from "@/context/CartContext";
import { PRODUCTS, formatPrice } from "@/lib/products";
import type { Product } from "@/types";

// ─── Size conversion ────────────────────────────────────────────────────────────
// EU → US (men's) mapping. Catalog stores EU sizes; the toggle converts.
const EU_TO_US: Record<number, number> = {
  36: 4, 37: 4.5, 38: 5.5, 39: 6.5, 40: 7,
  41: 8, 42: 8.5, 43: 9.5, 44: 10, 45: 11,
};

type SizeUnit = "EU" | "US";

function formatUS(us: number): string {
  return us % 1 === 0 ? String(us) : us.toFixed(1);
}

// ─── Related products ─────────────────────────────────────────────────────────

function RelatedProducts({ currentId }: { currentId: string }) {
  const related = PRODUCTS.filter((p) => p.id !== currentId).slice(0, 4);

  return (
    <div
      style={{
        background: "#E8E6E1",
        borderTop: "1px solid #B8B4AC",
        padding: "clamp(3rem, 5vw, 4rem) clamp(1.5rem, 5vw, 5rem)",
      }}
    >
      {/* Header */}
      <div className="flex items-baseline justify-between" style={{ marginBottom: "2rem" }}>
        <h3
          className="font-display"
          style={{ fontSize: "clamp(2rem, 3.5vw, 2.8rem)", lineHeight: 0.92, letterSpacing: "0.02em", color: "#0A0A0A" }}
        >
          También te puede gustar
        </h3>
        <Link
          href="/#coleccion"
          className="font-body font-medium uppercase"
          style={{ fontSize: 11, letterSpacing: "0.15em", color: "#B8B4AC", textDecoration: "none" }}
        >
          Ver colección →
        </Link>
      </div>

      {/* Cards */}
      <div
        className="related-grid grid"
        style={{ gridTemplateColumns: "repeat(4, 1fr)", gap: "clamp(0.75rem, 1.5vw, 1rem)" }}
      >
        {related.map((product) => (
          <RelatedCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

function RelatedCard({ product }: { product: Product }) {
  const [imgError, setImgError] = useState(false);
  const [hovered, setHovered]   = useState(false);

  return (
    <motion.div
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover="hovered"
      style={{ background: "#D4D0C8", borderRadius: 3, cursor: "pointer" }}
    >
      <Link href={`/productos/${product.slug}`} style={{ textDecoration: "none", display: "flex", flexDirection: "column" }}>
        {/* Image */}
        <div className="relative" style={{ paddingTop: "70%", borderRadius: "3px 3px 0 0", overflow: "hidden" }}>
          <div className="absolute inset-0 flex items-center justify-center p-4">
            {imgError ? (
              <div className="w-full h-full flex items-center justify-center" style={{ background: "#C0BDB5" }}>
                <span style={{ fontSize: 28, opacity: 0.25 }}>👟</span>
              </div>
            ) : (
              <motion.div
                className="w-full h-full relative"
                variants={{ hovered: { scale: 1.04 } }}
                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              >
                <Image
                  src={product.image}
                  alt={`${product.brand} ${product.name}`}
                  fill
                  className="object-contain"
                  onError={() => setImgError(true)}
                  sizes="25vw"
                />
              </motion.div>
            )}
          </div>
        </div>

        {/* Info */}
        <div style={{ background: "#E8E6E1", padding: "12px 14px 14px", borderRadius: "0 0 3px 3px" }}>
          <span
            className="font-body font-medium uppercase block"
            style={{ fontSize: 9, letterSpacing: "0.22em", color: "#B8B4AC", marginBottom: 3 }}
          >
            {product.brand}
          </span>
          <span
            className="font-body font-bold block"
            style={{ fontSize: 13, letterSpacing: "0.01em", color: "#0A0A0A", lineHeight: 1.3, marginBottom: 6 }}
          >
            {product.name}
          </span>
          <div className="flex items-center justify-between">
            <div className="flex flex-col" style={{ gap: 1 }}>
              {product.originalPrice && (
                <span className="font-body" style={{ fontSize: 10, color: "#B8B4AC", textDecoration: "line-through" }}>
                  {formatPrice(product.originalPrice)}
                </span>
              )}
              <span className="font-body font-medium" style={{ fontSize: 13, color: product.originalPrice ? "#C08A00" : "#0A0A0A" }}>
                {formatPrice(product.price)}
              </span>
            </div>
            <motion.span
              animate={{ color: hovered ? "#F2BF1A" : "#B8B4AC", x: hovered ? 3 : 0 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
              className="font-body"
              style={{ fontSize: 14 }}
            >
              →
            </motion.span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Size Guide Modal ─────────────────────────────────────────────────────────

const SIZE_ROWS: { eu: number; usM: string; usW: string; cm: string }[] = [
  { eu: 36, usM: "4",    usW: "5.5",  cm: "22.5" },
  { eu: 37, usM: "4.5",  usW: "6",    cm: "23"   },
  { eu: 38, usM: "5.5",  usW: "7",    cm: "24"   },
  { eu: 39, usM: "6.5",  usW: "8",    cm: "24.5" },
  { eu: 40, usM: "7",    usW: "8.5",  cm: "25"   },
  { eu: 41, usM: "8",    usW: "9.5",  cm: "25.5" },
  { eu: 42, usM: "8.5",  usW: "10",   cm: "26.5" },
  { eu: 43, usM: "9.5",  usW: "11",   cm: "27"   },
  { eu: 44, usM: "10",   usW: "11.5", cm: "28"   },
  { eu: 45, usM: "11",   usW: "12.5", cm: "29"   },
];

function SizeGuideModal({ onClose }: { onClose: () => void }) {
  // Close on backdrop click
  function handleBackdrop(e: React.MouseEvent) {
    if (e.target === e.currentTarget) onClose();
  }

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const thStyle: React.CSSProperties = {
    padding:       "10px 16px",
    textAlign:     "left",
    fontSize:      10,
    letterSpacing: "0.22em",
    color:         "#B8B4AC",
    fontWeight:    500,
    borderBottom:  "1px solid rgba(10,10,10,0.08)",
    whiteSpace:    "nowrap",
  };

  const tdStyle: React.CSSProperties = {
    padding:  "10px 16px",
    fontSize: 13,
    color:    "#0A0A0A",
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={handleBackdrop}
      className="size-guide-backdrop"
      style={{
        position:       "fixed",
        inset:          0,
        zIndex:         100,
        background:     "rgba(10,10,10,0.45)",
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        padding:        "1.5rem",
        backdropFilter: "blur(4px)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0,  scale: 1    }}
        exit={{    opacity: 0, y: 12, scale: 0.98  }}
        transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
        className="size-guide-modal"
        style={{
          background:   "#FFFFFF",
          borderRadius: 4,
          width:        "100%",
          maxWidth:     480,
          overflow:     "hidden",
          boxShadow:    "0 24px 64px rgba(0,0,0,0.2)",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", borderBottom: "1px solid rgba(10,10,10,0.08)" }}>
          <div>
            <h2 className="font-display" style={{ fontSize: 28, letterSpacing: "0.04em", color: "#0A0A0A", lineHeight: 1 }}>
              GUÍA DE TALLAS
            </h2>
            <p className="font-body" style={{ fontSize: 11, color: "#B8B4AC", marginTop: 4, letterSpacing: "0.04em" }}>
              Medidas en centímetros del pie
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "#B8B4AC", padding: 4, lineHeight: 1 }}
            aria-label="Cerrar guía de tallas"
          >
            ×
          </button>
        </div>

        {/* Table */}
        <div className="size-guide-table" style={{ overflowY: "auto", maxHeight: "60vh" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ position: "sticky", top: 0, background: "#FAFAF9" }}>
              <tr>
                <th className="font-body" style={thStyle}>EU</th>
                <th className="font-body" style={thStyle}>US Hombre</th>
                <th className="font-body" style={thStyle}>US Mujer</th>
                <th className="font-body" style={thStyle}>CM</th>
              </tr>
            </thead>
            <tbody>
              {SIZE_ROWS.map((row, i) => (
                <tr
                  key={row.eu}
                  style={{ background: i % 2 === 0 ? "#FFFFFF" : "#F7F6F4" }}
                >
                  <td className="font-body font-medium" style={{ ...tdStyle, color: "#0A0A0A" }}>{row.eu}</td>
                  <td className="font-body" style={tdStyle}>{row.usM}</td>
                  <td className="font-body" style={tdStyle}>{row.usW}</td>
                  <td className="font-body" style={tdStyle}>{row.cm}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer note */}
        <div style={{ padding: "14px 24px", borderTop: "1px solid rgba(10,10,10,0.06)", background: "#FAFAF9" }}>
          <p className="font-body" style={{ fontSize: 11, color: "#B8B4AC", letterSpacing: "0.03em", lineHeight: 1.6 }}>
            Si estás entre dos tallas, te recomendamos ir a la talla mayor.<br />
            Las medidas son aproximadas y pueden variar según el modelo.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── ProductDetail ────────────────────────────────────────────────────────────

export default function ProductDetail({ product }: { product: Product }) {
  const { addItem, openCart } = useCart();
  const router = useRouter();

  const [selectedEU,    setSelectedEU]    = useState<number | null>(null);
  const [sizeUnit,      setSizeUnit]      = useState<SizeUnit>("EU");
  const [noSizeWarning, setNoSizeWarning] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const leftRef    = useRef<HTMLDivElement>(null);
  const rightRef   = useRef<HTMLDivElement>(null);
  const sneakerRef = useRef<HTMLDivElement>(null);

  // Reset selection whenever the product changes (defensive — the page
  // remounts per route, but this keeps state correct if it ever updates
  // in place).
  useEffect(() => {
    setSelectedEU(null);
    setNoSizeWarning(false);
  }, [product.id]);

  // ── GSAP entry ──────────────────────────────────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!sectionRef.current) return;
      const trigger = { trigger: sectionRef.current, start: "top 72%", once: true };
      if (leftRef.current)    gsap.from(leftRef.current,    { x: -52, opacity: 0, duration: 0.85, ease: "power3.out", scrollTrigger: trigger });
      if (rightRef.current)   gsap.from(rightRef.current,   { x:  52, opacity: 0, duration: 0.85, ease: "power3.out", scrollTrigger: trigger });
      if (sneakerRef.current) gsap.from(sneakerRef.current, { y:  64, opacity: 0, duration: 1.0,  ease: "power3.out", delay: 0.12, scrollTrigger: trigger });
    });
    return () => ctx.revert();
  }, []);

  function handleAddToCart() {
    if (selectedEU == null) {
      setNoSizeWarning(true);
      setTimeout(() => setNoSizeWarning(false), 2400);
      return;
    }
    addItem(product, selectedEU);
    openCart();
  }

  // Display label for a size chip
  function sizeLabel(eu: number): string {
    if (sizeUnit === "EU") return String(eu);
    return formatUS(EU_TO_US[eu] ?? eu);
  }

  return (
    <>
      <section
        ref={sectionRef}
        id="product-detail"
        data-nav-theme="light"
        className="w-full flex items-center relative"
        style={{
          minHeight: "100dvh",
          background: "#E8E6E1",
          padding: "clamp(5rem, 8vw, 7rem) clamp(1.5rem, 5vw, 5rem)",
        }}
      >
        {/* ── Back button ─────────────────────────────────────────────────── */}
        <motion.button
          onClick={() => router.back()}
          className="absolute font-body font-medium uppercase flex items-center gap-2"
          style={{
            top: "clamp(4.5rem, 6vw, 5.5rem)",
            left: "clamp(1.5rem, 5vw, 5rem)",
            fontSize: 11,
            letterSpacing: "0.16em",
            color: "#0A0A0A",
            background: "transparent",
            border: "1px solid #B8B4AC",
            borderRadius: 2,
            padding: "8px 16px",
            cursor: "pointer",
            zIndex: 10,
          }}
          whileHover={{ background: "#0A0A0A", color: "#E8E6E1", borderColor: "#0A0A0A" }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          aria-label="Volver"
        >
          <span style={{ display: "inline-block", fontSize: 13, lineHeight: 1 }} aria-hidden="true">
            ←
          </span>
          Volver
        </motion.button>

        <div className="pd-layout w-full flex" style={{ alignItems: "stretch", minHeight: "72vh" }}>

          {/* ── LEFT — Product identity (25%) ────────────────────────────── */}
          <div
            ref={leftRef}
            className="pd-left flex flex-col justify-center"
            style={{ width: "25%", paddingRight: "clamp(1.5rem, 3vw, 3rem)", borderRight: "1px solid #B8B4AC" }}
          >
            <motion.div
              key={product.id + "-identity"}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
            >
              <span
                className="font-body font-medium uppercase block"
                style={{ fontSize: 11, letterSpacing: "0.26em", color: "#B8B4AC", marginBottom: "1rem" }}
              >
                {product.brand}
              </span>

              <h2
                className="font-display"
                style={{ fontSize: "clamp(3rem, 5vw, 4.5rem)", lineHeight: 0.92, letterSpacing: "0.02em", color: "#0A0A0A", marginBottom: "0.5rem" }}
              >
                {product.name}
              </h2>

              {product.colorway && (
                <p
                  className="font-body"
                  style={{ fontSize: 13, color: "#5A5850", letterSpacing: "0.04em", marginBottom: "1.5rem" }}
                >
                  {product.colorway}
                </p>
              )}

              <div style={{ borderTop: "1px solid #B8B4AC", marginBottom: "1.5rem" }} />

              <p
                className="font-body pd-description"
                style={{ fontSize: 14, lineHeight: "24px", color: "#5A5850", marginBottom: "1.5rem", maxWidth: "34ch" }}
              >
                {product.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-body"
                    style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "#5A5850", border: "1px solid #B8B4AC", borderRadius: 2, padding: "4px 10px" }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ── CENTER — Floating sneaker (50%) ──────────────────────────── */}
          <div
            className="pd-center flex items-center justify-center relative"
            style={{ flex: 1, overflow: "hidden" }}
          >
            {/* Brand watermark — crossfades with the product */}
            <AnimatePresence mode="wait">
              <motion.span
                key={product.id + "-wm"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.06 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="font-display absolute select-none pointer-events-none"
                style={{ fontSize: "clamp(8rem, 20vw, 18rem)", lineHeight: 1, color: "#0A0A0A", letterSpacing: "0.02em", whiteSpace: "nowrap" }}
                aria-hidden="true"
              >
                {product.brand}
              </motion.span>
            </AnimatePresence>

            <div ref={sneakerRef} className="relative z-10">
              <motion.div
                style={{ transformStyle: "preserve-3d", perspective: "1200px" }}
                whileHover={{ rotateX: -3 }}
                transition={{ type: "spring", stiffness: 180, damping: 22 }}
              >
                {/* Sneaker fades/slides out then in when the product changes */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={product.id + "-img"}
                    initial={{ opacity: 0, y: 48 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -40 }}
                    transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                  >
                    <div
                      style={{
                        animation: "pd-float-shadow 3.5s ease-in-out infinite alternate",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Image
                        src={product.image}
                        alt={`${product.brand} ${product.name}`}
                        width={580}
                        height={400}
                        className="object-contain"
                        style={{ width: "clamp(200px, 70vw, 560px)", height: "auto", maxWidth: "100%" }}
                        priority
                      />
                    </div>
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </div>
          </div>

          {/* ── RIGHT — Purchase (25%) ────────────────────────────────────── */}
          <div
            ref={rightRef}
            className="pd-right flex flex-col justify-center"
            style={{ width: "25%", paddingLeft: "clamp(1.5rem, 3vw, 3rem)", borderLeft: "1px solid #B8B4AC" }}
          >
            <motion.div
              key={product.id + "-purchase"}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1], delay: 0.08 }}
            >
              {/* Price */}
              <div style={{ marginBottom: "1.75rem" }}>
                {product.originalPrice && (
                  <div className="flex items-center gap-2" style={{ marginBottom: "0.3rem" }}>
                    <span
                      className="font-body font-medium"
                      style={{ fontSize: "clamp(0.9rem, 1.2vw, 1rem)", color: "#B8B4AC", textDecoration: "line-through" }}
                    >
                      {formatPrice(product.originalPrice)}
                    </span>
                    <span
                      className="font-body font-bold"
                      style={{
                        fontSize:      10,
                        letterSpacing: "0.12em",
                        background:    "#F2BF1A",
                        color:         "#0A0A0A",
                        padding:       "2px 7px",
                        borderRadius:  2,
                      }}
                    >
                      -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                    </span>
                  </div>
                )}
                <p
                  className="font-display"
                  style={{ fontSize: "clamp(2.5rem, 3.5vw, 3.25rem)", lineHeight: 0.95, letterSpacing: "0.02em", color: product.originalPrice ? "#C08A00" : "#0A0A0A" }}
                >
                  {formatPrice(product.price)}
                </p>
              </div>

              {/* ── Size selector ───────────────────────────────────────────── */}
              <div className="flex items-center justify-between" style={{ marginBottom: "0.75rem" }}>
                <p className="font-body font-medium uppercase" style={{ fontSize: 11, letterSpacing: "0.2em", color: "#B8B4AC" }}>
                  Talla
                </p>

                {/* EU / US toggle */}
                <div className="flex" style={{ border: "1px solid #B8B4AC" }}>
                  {(["EU", "US"] as SizeUnit[]).map((unit) => (
                    <motion.button
                      key={unit}
                      onClick={() => setSizeUnit(unit)}
                      className="font-body font-medium"
                      style={{
                        fontSize: 10,
                        letterSpacing: "0.1em",
                        padding: "3px 8px",
                        background: sizeUnit === unit ? "#0A0A0A" : "transparent",
                        color:      sizeUnit === unit ? "#E8E6E1" : "#B8B4AC",
                        border: "none",
                        cursor: "pointer",
                      }}
                      whileHover={sizeUnit !== unit ? { color: "#0A0A0A" } : {}}
                      transition={{ duration: 0.12 }}
                    >
                      {unit}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div
                className="grid"
                style={{ gridTemplateColumns: "repeat(4, 1fr)", gap: 6, marginBottom: "0.6rem" }}
              >
                {product.sizes.map((eu) => {
                  const isSelected = selectedEU === eu;
                  return (
                    <div key={eu} className="flex flex-col items-center" style={{ gap: 5 }}>
                      <motion.button
                        onClick={() => setSelectedEU(eu)}
                        className="pd-size-btn font-body font-medium w-full"
                        style={{
                          fontSize: 12,
                          height: 36,
                          border: "1px solid #0A0A0A",
                          background: isSelected ? "#0A0A0A" : "transparent",
                          color: isSelected ? "#E8E6E1" : "#0A0A0A",
                          cursor: "pointer",
                        }}
                        whileHover={!isSelected ? { background: "#0A0A0A", color: "#E8E6E1" } : {}}
                        whileTap={{ scale: 0.96 }}
                        transition={{ duration: 0.13, ease: "easeOut" }}
                        aria-label={`Talla ${sizeUnit} ${sizeLabel(eu)}`}
                        aria-pressed={isSelected}
                      >
                        {sizeLabel(eu)}
                      </motion.button>

                      {/* Accent dot */}
                      <div
                        style={{ width: 4, height: 4, borderRadius: "50%", background: isSelected ? "#F2BF1A" : "transparent", transition: "background 150ms ease", flexShrink: 0 }}
                        aria-hidden="true"
                      />
                    </div>
                  );
                })}
              </div>

              {/* Guía de tallas */}
              <motion.button
                onClick={() => setSizeGuideOpen(true)}
                className="font-body text-left"
                style={{ fontSize: 11, letterSpacing: "0.06em", color: "#B8B4AC", background: "none", border: "none", cursor: "pointer", padding: 0, marginBottom: "1.75rem", textDecoration: "underline", textUnderlineOffset: 3 }}
                whileHover={{ color: "#5A5850" }}
                transition={{ duration: 0.14 }}
              >
                Guía de tallas
              </motion.button>

              {/* Size guide modal */}
              <AnimatePresence>
                {sizeGuideOpen && <SizeGuideModal onClose={() => setSizeGuideOpen(false)} />}
              </AnimatePresence>

              {/* ── Color ───────────────────────────────────────────────────── */}
              <p
                className="font-body font-medium uppercase"
                style={{ fontSize: 11, letterSpacing: "0.2em", color: "#B8B4AC", marginBottom: "0.75rem" }}
              >
                Color
              </p>

              <div className="flex items-center gap-3" style={{ marginBottom: "2rem" }}>
                <span
                  aria-label={product.colorway ?? "Color"}
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    background: product.swatch,
                    outline: "2.5px solid #0A0A0A",
                    outlineOffset: 3,
                    display: "inline-block",
                    flexShrink: 0,
                  }}
                />
                <span
                  className="font-body"
                  style={{ fontSize: 12, color: "#5A5850", letterSpacing: "0.03em" }}
                >
                  {product.colorway ?? "Colorway única"}
                </span>
              </div>

              {/* ── Add to cart ─────────────────────────────────────────────── */}
              <motion.button
                onClick={handleAddToCart}
                className="font-display uppercase w-full"
                style={{ fontSize: "clamp(0.9rem, 1.3vw, 1.1rem)", letterSpacing: "0.12em", height: 56, background: "#0A0A0A", color: "#E8E6E1", border: "none", cursor: "pointer", marginBottom: "0.75rem", touchAction: "manipulation" }}
                whileHover={{ background: "#F2BF1A", color: "#0A0A0A", scale: 1.02 }}
                whileTap={{ scale: 0.97, background: "#F2BF1A", color: "#0A0A0A" }}
                transition={{ duration: 0.16, ease: "easeOut" }}
              >
                Agregar al carrito
              </motion.button>

              {/* No-size warning */}
              <div style={{ height: 20, marginBottom: "0.75rem" }}>
                <AnimatePresence>
                  {noSizeWarning && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      className="font-body"
                      style={{ fontSize: 12, color: "#5A5850", letterSpacing: "0.05em" }}
                      aria-live="polite"
                    >
                      Seleccioná una talla para continuar
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── También te puede gustar ─────────────────────────────────────────── */}
      <RelatedProducts currentId={product.id} />
    </>
  );
}
