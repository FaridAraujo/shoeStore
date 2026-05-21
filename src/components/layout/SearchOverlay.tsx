"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { PRODUCTS, formatPrice } from "@/lib/products";
import type { Product } from "@/types";

// ─── Brand pills shown before typing ─────────────────────────────────────────
const BRAND_PILLS = ["NIKE", "ADIDAS", "ASICS", "NEW BALANCE"] as const;

// ─── Filtering ────────────────────────────────────────────────────────────────
function filterProducts(query: string): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      (p.colorway ?? "").toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q)),
  );
}

// ─── Result card ─────────────────────────────────────────────────────────────
function ResultCard({
  product,
  onSelect,
}: {
  product: Product;
  onSelect: (p: Product) => void;
}) {
  const [imgError, setImgError] = useState(false);

  return (
    <motion.button
      onClick={() => onSelect(product)}
      className="text-left w-full"
      style={{
        background:    "rgba(255,255,255,0.04)",
        border:        "1px solid rgba(255,255,255,0.07)",
        borderRadius:  3,
        cursor:        "pointer",
        overflow:      "hidden",
        display:       "flex",
        flexDirection: "column",
      }}
      whileHover="hovered"
      whileTap={{ scale: 0.98 }}
      variants={{
        hovered: { borderColor: "rgba(242,191,26,0.35)", background: "rgba(255,255,255,0.07)" },
      }}
      transition={{ duration: 0.14, ease: "easeOut" }}
    >
      {/* Image */}
      <div
        style={{
          position:   "relative",
          paddingTop: "65%",
          background: "rgba(255,255,255,0.03)",
          flexShrink: 0,
          overflow:   "hidden",
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center p-4">
          {imgError ? (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.04)" }}
            >
              <span style={{ fontSize: 32, opacity: 0.15 }}>👟</span>
            </div>
          ) : (
            <motion.div
              className="absolute inset-0 flex items-center justify-center p-4"
              variants={{ hovered: { scale: 1.06 } }}
              transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
            >
              <Image
                src={product.image}
                alt={`${product.brand} ${product.name}`}
                fill
                className="object-contain"
                onError={() => setImgError(true)}
                sizes="(max-width: 768px) 50vw, 22vw"
              />
            </motion.div>
          )}
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: "12px 14px 14px", flex: 1 }}>
        <span
          className="font-body font-medium uppercase block"
          style={{
            fontSize:      11,
            letterSpacing: "0.24em",
            color:         "#F2BF1A",
            marginBottom:  4,
          }}
        >
          {product.brand}
        </span>
        <span
          className="font-body font-bold block"
          style={{
            fontSize:      14,
            letterSpacing: "0.01em",
            color:         "rgba(255,255,255,0.9)",
            lineHeight:    1.3,
            marginBottom:  8,
          }}
        >
          {product.name}
        </span>
        <span
          className="font-body block"
          style={{ fontSize: 13, color: "rgba(255,255,255,0.38)", letterSpacing: "0.02em" }}
        >
          {formatPrice(product.price)}
        </span>
      </div>
    </motion.button>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function SearchOverlay({
  open,
  onClose,
}: {
  open:    boolean;
  onClose: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const router = useRouter();

  const results = useMemo(() => filterProducts(query), [query]);
  const hasQuery   = query.trim().length > 0;
  const hasResults = results.length > 0;

  // ── Auto-focus + body lock ────────────────────────────────────────────────
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      const t = setTimeout(() => inputRef.current?.focus(), 80);
      return () => {
        clearTimeout(t);
        document.body.style.overflow = "";
      };
    } else {
      document.body.style.overflow = "";
      setQuery("");
    }
  }, [open]);

  // ── ESC key ───────────────────────────────────────────────────────────────
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  // ── Navigate on result click ──────────────────────────────────────────────
  function handleSelect(product: Product) {
    onClose();
    router.push(`/productos/${product.slug}`);
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed inset-0 z-[200] flex flex-col"
          style={{
            background:           "rgba(10,10,10,0.85)",
            backdropFilter:       "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
          }}
        >
          {/* ── Top bar ─────────────────────────────────────────────────── */}
          <div className="flex items-center justify-between px-6 md:px-8 h-[72px] flex-shrink-0">
            <div style={{ position: "relative", height: 44, width: 176 }}>
              <Image
                src="/images/logo-white.png"
                alt="SNEAX"
                fill
                className="object-contain object-left"
                style={{
                  filter: "drop-shadow(0 0 10px rgba(255,255,255,0.55)) drop-shadow(0 0 24px rgba(255,255,255,0.25))",
                }}
              />
            </div>

            {/* Close — SVG circle × */}
            <button
              onClick={onClose}
              aria-label="Cerrar búsqueda"
              style={{
                display:        "flex",
                alignItems:     "center",
                justifyContent: "center",
                width:          32,
                height:         32,
                borderRadius:   "50%",
                background:     "rgba(255,255,255,0.08)",
                border:         "none",
                cursor:         "pointer",
                color:          "rgba(255,255,255,0.5)",
                transition:     "background 130ms ease-out, color 130ms ease-out",
                flexShrink:     0,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "rgba(242,191,26,0.15)";
                e.currentTarget.style.color      = "#F2BF1A";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                e.currentTarget.style.color      = "rgba(255,255,255,0.5)";
              }}
            >
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
                <line x1="1" y1="1" x2="10" y2="10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                <line x1="10" y1="1" x2="1"  y2="10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* ── Search area ─────────────────────────────────────────────── */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0,   opacity: 1 }}
            exit={{ y: -12,    opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.23, 1, 0.32, 1], delay: 0.04 }}
            className="flex flex-col items-center px-6 md:px-8"
            style={{ marginTop: "8vh" }}
          >
            {/* Input row */}
            <div
              className="relative w-full"
              style={{
                maxWidth:      600,
                borderBottom:  "1px solid rgba(255,255,255,0.22)",
                paddingBottom: "0.6rem",
              }}
            >
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="¿Qué estás buscando?"
                className="w-full bg-transparent font-display outline-none uppercase"
                style={{
                  fontSize:      48,
                  lineHeight:    1.05,
                  letterSpacing: "0.02em",
                  color:         "rgba(255,255,255,0.95)",
                  caretColor:    "#F2BF1A",
                }}
              />

              {/* Clear */}
              <AnimatePresence>
                {hasQuery && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.14 }}
                    onClick={() => { setQuery(""); inputRef.current?.focus(); }}
                    className="absolute right-0 bottom-3 font-body transition-colors duration-150"
                    style={{ fontSize: 20, color: "rgba(255,255,255,0.28)", lineHeight: 1, background: "none", border: "none", cursor: "pointer", padding: 0 }}
                    aria-label="Limpiar búsqueda"
                    onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.65)")}
                    onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.28)")}
                  >
                    ×
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* ── Brand pills — visible before typing ─────────────────────── */}
            <AnimatePresence mode="wait">
              {!hasQuery && (
                <motion.div
                  key="brands"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.24, ease: [0.23, 1, 0.32, 1], delay: 0.1 }}
                  className="w-full"
                  style={{ maxWidth: 600, marginTop: "2rem" }}
                >
                  <p
                    className="font-body font-medium uppercase tracking-[0.22em]"
                    style={{ fontSize: 9, color: "rgba(255,255,255,0.22)", marginBottom: "0.85rem" }}
                  >
                    Marcas populares
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {BRAND_PILLS.map(brand => (
                      <button
                        key={brand}
                        onClick={() => { setQuery(brand); inputRef.current?.focus(); }}
                        className="font-body font-medium uppercase tracking-[0.1em] transition-all duration-150"
                        style={{
                          fontSize:   11,
                          border:     "1px solid rgba(255,255,255,0.22)",
                          borderRadius: 2,
                          padding:    "7px 18px",
                          color:      "rgba(255,255,255,0.6)",
                          background: "transparent",
                          cursor:     "pointer",
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.borderColor = "rgba(255,255,255,0.7)";
                          e.currentTarget.style.color       = "rgba(255,255,255,0.95)";
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.borderColor = "rgba(255,255,255,0.22)";
                          e.currentTarget.style.color       = "rgba(255,255,255,0.6)";
                        }}
                      >
                        {brand}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* ── Results ──────────────────────────────────────────────────── */}
          <AnimatePresence mode="wait">
            {hasQuery && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.26, ease: [0.23, 1, 0.32, 1] }}
                className="flex-1 overflow-y-auto px-6 md:px-8"
                style={{ marginTop: "2.5rem", paddingBottom: "3rem" }}
              >
                <div
                  className="mx-auto"
                  style={{ maxWidth: 960 }}
                >
                  {hasResults ? (
                    <>
                      {/* Result count */}
                      <p
                        className="font-body uppercase tracking-[0.22em]"
                        style={{ fontSize: 9, color: "rgba(255,255,255,0.2)", marginBottom: "1.25rem" }}
                      >
                        {results.length} resultado{results.length !== 1 ? "s" : ""} para "{query}"
                      </p>

                      {/* Grid */}
                      <motion.div
                        className="grid"
                        style={{
                          gridTemplateColumns: "repeat(3, 1fr)",
                          gap: "clamp(0.75rem, 1.5vw, 1rem)",
                        }}
                      >
                        {results.map((product, i) => (
                          <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              duration: 0.28,
                              ease: [0.23, 1, 0.32, 1],
                              delay: i * 0.045,
                            }}
                          >
                            <ResultCard product={product} onSelect={handleSelect} />
                          </motion.div>
                        ))}
                      </motion.div>
                    </>
                  ) : (
                    /* ── No results ── */
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.22 }}
                      className="flex flex-col items-center"
                      style={{ paddingTop: "4vh" }}
                    >
                      <p
                        className="font-display uppercase"
                        style={{ fontSize: 24, color: "rgba(255,255,255,0.18)", letterSpacing: "0.04em", marginBottom: 8 }}
                      >
                        Sin resultados para "{query}"
                      </p>
                      <p
                        className="font-body"
                        style={{ fontSize: 12, color: "rgba(255,255,255,0.2)", letterSpacing: "0.06em" }}
                      >
                        Intentá con otra marca, modelo o color
                      </p>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Keyboard hint ─────────────────────────────────────────────── */}
          {!hasQuery && (
            <div className="mt-auto pb-8 flex justify-center pointer-events-none">
              <span
                className="font-body uppercase tracking-[0.18em]"
                style={{ fontSize: 9, color: "rgba(255,255,255,0.12)" }}
              >
                Presioná Escape para cerrar
              </span>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
