"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { gsap } from "@/lib/gsap";
import {
  PRODUCTS,
  BRANDS,
  formatPrice,
  type BrandFilter,
  type Product,
} from "@/lib/products";
import { useCollectionSearch } from "@/context/CollectionSearchContext";

// ─── Product Card ─────────────────────────────────────────────────────────────

function ProductCard({ product, index, dark }: { product: Product; index: number; dark: boolean }) {
  const [imgError, setImgError] = useState(false);
  const router = useRouter();

  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        opacity: { delay: (index % 3) * 0.06, duration: 0.5, ease: [0.23, 1, 0.32, 1] },
        y:       { delay: (index % 3) * 0.06, duration: 0.5, ease: [0.23, 1, 0.32, 1] },
      }}
      whileHover="hovered"
      onClick={() => router.push(`/productos/${product.id}`)}
      className="flex flex-col cursor-pointer"
      style={{ background: dark ? "#181818" : "#D4D0C8", borderRadius: 3 }}
    >
      {/* Image area */}
      <div
        className="relative"
        style={{ paddingTop: "65%", borderRadius: "3px 3px 0 0" }}
      >
        <div
          className="absolute inset-0 flex items-center justify-center p-6"
          style={{ overflow: "hidden", borderRadius: "3px 3px 0 0" }}
        >
          {imgError ? (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ background: dark ? "#222222" : "#C0BDB5", borderRadius: 2 }}
            >
              <span style={{ fontSize: 36, opacity: 0.25 }}>👟</span>
            </div>
          ) : (
            <div className="w-full h-full relative">
              {/* Ground shadow — skip for products with baked-in shadow */}
              {product.id !== "asics-gel-1130" && (
                <div
                  aria-hidden="true"
                  className="absolute left-1/2 bottom-3"
                  style={{
                    transform: "translateX(-50%)",
                    width: "65%",
                    height: 18,
                    background: dark ? "rgba(0,0,0,0.7)" : "rgba(0,0,0,0.45)",
                    borderRadius: "50%",
                    filter: "blur(10px)",
                  }}
                />
              )}
              <motion.div
                className="absolute inset-0"
                variants={{ hovered: { scale: 1.04 } }}
                transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
              >
                <Image
                  src={product.image}
                  alt={`${product.brand} ${product.name}`}
                  fill
                  className="object-contain"
                  style={{
                    objectPosition: "center",
                    transform: product.id === "adidas-ballerina-bad-bunny" ? "translateY(15%)" : undefined,
                  }}
                  onError={() => setImgError(true)}
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </motion.div>
            </div>
          )}
        </div>
      </div>

      {/* Info area */}
      <div
        className="relative flex flex-col"
        style={{ background: dark ? "#111111" : "#E8E6E1", padding: "14px 16px 16px", borderRadius: "0 0 3px 3px" }}
      >
        <span
          className="font-body font-medium uppercase"
          style={{ fontSize: 10, letterSpacing: "0.22em", color: dark ? "rgba(240,237,232,0.35)" : "#B8B4AC", marginBottom: 4 }}
        >
          {product.brand}
        </span>

        <span
          className="font-body font-bold"
          style={{ fontSize: 15, letterSpacing: "0.01em", color: dark ? "#F0EDE8" : "#0A0A0A", lineHeight: 1.3, marginBottom: 8 }}
        >
          {product.name}
          {product.colorway && (
            <span
              className="block font-normal"
              style={{ fontSize: 11, color: dark ? "rgba(240,237,232,0.45)" : "#8A8680", letterSpacing: "0.04em", marginTop: 2 }}
            >
              {product.colorway}
            </span>
          )}
        </span>

        <div className="flex items-center justify-between">
          <span className="font-body font-medium" style={{ fontSize: 14, color: dark ? "#F0EDE8" : "#0A0A0A" }}>
            {formatPrice(product.price)}
          </span>

          <motion.button
            variants={{ hovered: { opacity: 1, y: 0 } }}
            initial={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="font-body font-medium uppercase"
            style={{
              fontSize: 10,
              letterSpacing: "0.14em",
              background: "#F2BF1A",
              color: "#0A0A0A",
              border: "none",
              padding: "6px 12px",
              borderRadius: 2,
              cursor: "pointer",
            }}
            aria-label={`Agregar ${product.name} al carrito`}
          >
            Agregar
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}

// ─── Collection ───────────────────────────────────────────────────────────────

export default function Collection({
  initialBrand,
  newDropsOnly = false,
}: {
  initialBrand?:  BrandFilter;
  newDropsOnly?:  boolean;
} = {}) {
  const dark = newDropsOnly; // shorthand used throughout for theme switching

  const [activeFilter, setActiveFilter] = useState<BrandFilter>(initialBrand ?? "TODOS");
  const [filtersOpen, setFiltersOpen]   = useState(false);
  const sectionRef  = useRef<HTMLElement>(null);
  const searchRef   = useRef<HTMLDivElement>(null);
  const inputRef    = useRef<HTMLInputElement>(null);

  const { query, setQuery, setHeroVisible } = useCollectionSearch();

  // Tell Nav whether the in-page search bar is visible.
  // Uses getBoundingClientRect on scroll — reliable regardless of threshold quirks.
  useEffect(() => {
    if (newDropsOnly) return;
    const NAV_H = 72;
    function check() {
      const el = searchRef.current;
      if (!el) return;
      // visible = the bottom edge of the search bar is still below the nav
      setHeroVisible(el.getBoundingClientRect().bottom > NAV_H);
    }
    check(); // run once on mount
    window.addEventListener("scroll", check, { passive: true });
    return () => window.removeEventListener("scroll", check);
  }, [newDropsOnly, setHeroVisible]);

  // Filtered products — brand + text search
  const filtered = useMemo<Product[]>(() => {
    let base = newDropsOnly ? PRODUCTS.filter((p) => p.isNewDrop) : PRODUCTS;
    if (activeFilter !== "TODOS") base = base.filter((p) => p.brand === activeFilter);
    if (query.trim()) {
      const q = query.toLowerCase();
      base = base.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          (p.colorway?.toLowerCase().includes(q) ?? false),
      );
    }
    return base;
  }, [activeFilter, newDropsOnly, query]);

  // GSAP: header slides up on scroll into view
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!sectionRef.current) return;
      gsap.from("[data-col-header]", {
        y: 30, opacity: 0, duration: 0.7, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%", once: true },
      });
    });
    return () => ctx.revert();
  }, []);

  function handleFilter(brand: BrandFilter) {
    if (brand !== "TODOS" && activeFilter === brand) {
      setActiveFilter("TODOS");
    } else {
      setActiveFilter(brand);
    }
  }

  const isFiltered = activeFilter !== "TODOS";

  // ── Derived theme tokens ──────────────────────────────────────────────────
  const sectionBg   = dark ? "#0A0A0A"               : "#E8E6E1";
  const titleColor  = dark ? "#F0EDE8"               : "#0A0A0A";
  const countColor  = dark ? "rgba(240,237,232,0.35)" : "#B8B4AC";
  const emptyColor  = dark ? "rgba(240,237,232,0.3)"  : "#B8B4AC";

  // Filter toggle button
  const ftColor     = isFiltered ? (dark ? "#0A0A0A"               : "#FFFFFF")     : (dark ? "rgba(240,237,232,0.75)" : "#0A0A0A");
  const ftBg        = isFiltered ? (dark ? "#F0EDE8"               : "#0A0A0A")     : "transparent";
  const ftBorder    = isFiltered ? (dark ? "#F0EDE8"               : "#0A0A0A")     : (dark ? "rgba(240,237,232,0.2)" : "#B8B4AC");
  const ftHoverOn   = isFiltered ? (dark ? { background: "rgba(240,237,232,0.85)", borderColor: "rgba(240,237,232,0.85)" } : { background: "#2A2A2A", borderColor: "#2A2A2A" })
                                 : (dark ? { background: "rgba(240,237,232,0.07)", borderColor: "#F0EDE8" }               : { background: "rgba(10,10,10,0.07)", borderColor: "#0A0A0A" });

  // "Ver todos" button
  const btnColor    = dark ? "rgba(240,237,232,0.7)" : "#0A0A0A";
  const btnBorder   = dark ? "rgba(240,237,232,0.2)" : "#B8B4AC";
  const btnHover    = dark
    ? { borderColor: "#F0EDE8", background: "#F0EDE8", color: "#0A0A0A" }
    : { borderColor: "#0A0A0A", background: "#0A0A0A", color: "#E8E6E1" };

  return (
    <section
      ref={sectionRef}
      id="coleccion"
      data-nav-theme={dark ? "dark-glass" : "light"}
      className="w-full"
      style={{ background: sectionBg, padding: `${dark ? "clamp(4rem, 8vw, 7rem)" : "1.75rem"} clamp(1.5rem, 5vw, 5rem) clamp(2rem, 4vw, 3rem)` }}
    >
      {/* ── Search bar (collection page only) ───────────────────────── */}
      {!dark && (
        <div
          ref={searchRef}
          style={{ marginBottom: "2.5rem", maxWidth: 480 }}
          onFocusCapture={(e) => {
            const wrap = e.currentTarget.querySelector<HTMLDivElement>("[data-search-wrap]");
            if (wrap) {
              wrap.style.borderColor = "#0A0A0A";
              wrap.style.background  = "#FFFFFF";
              wrap.style.boxShadow   = "0 2px 16px rgba(0,0,0,0.10)";
            }
          }}
          onBlurCapture={(e) => {
            const wrap = e.currentTarget.querySelector<HTMLDivElement>("[data-search-wrap]");
            if (wrap) {
              wrap.style.borderColor = "rgba(10,10,10,0.14)";
              wrap.style.background  = "#F5F3EF";
              wrap.style.boxShadow   = "0 1px 4px rgba(0,0,0,0.05)";
            }
          }}
        >
          <div
            data-search-wrap
            style={{
              display:      "flex",
              alignItems:   "center",
              gap:          12,
              background:   "#F5F3EF",
              border:       "1px solid rgba(10,10,10,0.14)",
              borderRadius: 2,
              padding:      "0 20px",
              height:       56,
              boxShadow:    "0 1px 4px rgba(0,0,0,0.05)",
              transition:   "border-color 180ms ease, background 180ms ease, box-shadow 180ms ease",
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ flexShrink: 0, color: "#8A8680" }}>
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
              <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar modelos, marcas, colorways…"
              className="font-body collection-search-input"
              style={{
                flex:          1,
                background:    "transparent",
                border:        "none",
                outline:       "none",
                fontSize:      13,
                letterSpacing: "0.04em",
                color:         "#0A0A0A",
                appearance:    "none",
              }}
            />
            {query && (
              <button
                onClick={() => { setQuery(""); inputRef.current?.focus(); }}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#B8B4AC", fontSize: 18, lineHeight: 1, padding: 0, flexShrink: 0 }}
                aria-label="Limpiar búsqueda"
              >×</button>
            )}
          </div>
        </div>
      )}

      {/* ── Header ───────────────────────────────────────────────────── */}
      <div
        data-col-header
        className="flex items-baseline justify-between"
        style={{ marginBottom: filtersOpen ? "1.5rem" : "3rem", transition: "margin 300ms ease" }}
      >
        <h2
          className="font-display"
          style={{ fontSize: "clamp(3rem, 6vw, 5rem)", lineHeight: 0.9, letterSpacing: "-0.01em", color: titleColor }}
        >
          {dark ? "Nuevos Lanzamientos" : "Colección"}
        </h2>

        <div className="flex items-center gap-4">
          {/* Count */}
          <span
            className="font-body"
            style={{ fontSize: 12, color: countColor, letterSpacing: "0.06em" }}
          >
            {filtered.length} {filtered.length === 1 ? "par" : "pares"}
          </span>

          {/* Filter toggle */}
          <motion.button
            onClick={() => setFiltersOpen((v) => !v)}
            className="font-body font-medium uppercase flex items-center gap-2"
            style={{
              fontSize:      11,
              letterSpacing: "0.15em",
              color:         ftColor,
              background:    ftBg,
              border:        `1px solid ${ftBorder}`,
              padding:       "6px 14px",
              cursor:        "pointer",
            }}
            whileHover={ftHoverOn}
            transition={{ duration: 0.15, ease: "easeOut" }}
            aria-expanded={filtersOpen}
          >
            {isFiltered ? activeFilter : "Filtrar"}
            <motion.span
              animate={{ rotate: filtersOpen ? 180 : 0 }}
              transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
              style={{ fontSize: 10, lineHeight: 1, display: "inline-block" }}
              aria-hidden="true"
            >
              ▾
            </motion.span>
          </motion.button>
        </div>
      </div>

      {/* ── Filter pills ─────────────────────────────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateRows: filtersOpen ? "1fr" : "0fr",
          transition: "grid-template-rows 280ms cubic-bezier(0.23,1,0.32,1)",
          marginBottom: filtersOpen ? "2rem" : 0,
        }}
      >
        <div style={{ overflow: "hidden" }}>
          <div
            className="flex flex-wrap gap-2"
            style={{
              paddingTop: 4,
              opacity:    filtersOpen ? 1 : 0,
              transform:  filtersOpen ? "translateY(0)" : "translateY(-8px)",
              transition: "opacity 220ms ease, transform 220ms ease",
            }}
          >
            {BRANDS.map((brand) => {
              const active = activeFilter === brand;
              const pColor  = active ? (dark ? "#0A0A0A" : "#FFFFFF")               : (dark ? "rgba(240,237,232,0.7)" : "#0A0A0A");
              const pBg     = active ? (dark ? "#F0EDE8" : "#0A0A0A")               : "transparent";
              const pBorder = active ? (dark ? "#F0EDE8" : "#0A0A0A")               : (dark ? "rgba(240,237,232,0.2)" : "#B8B4AC");
              const pHover  = active
                ? (dark ? { background: "rgba(240,237,232,0.85)", borderColor: "rgba(240,237,232,0.85)" } : { background: "#2A2A2A", borderColor: "#2A2A2A" })
                : (dark ? { background: "rgba(240,237,232,0.07)", borderColor: "#F0EDE8"               } : { background: "rgba(10,10,10,0.07)", borderColor: "#0A0A0A" });
              return (
                <motion.button
                  key={brand}
                  onClick={() => handleFilter(brand)}
                  className="font-body font-medium uppercase flex items-center gap-1.5"
                  style={{
                    fontSize:      11,
                    letterSpacing: "0.15em",
                    padding:       "6px 16px",
                    border:        `1px solid ${pBorder}`,
                    background:    pBg,
                    color:         pColor,
                    cursor:        "pointer",
                    borderRadius:  2,
                  }}
                  whileHover={pHover}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  aria-pressed={active}
                >
                  {brand}
                  {active && brand !== "TODOS" && (
                    <span style={{ fontSize: 13, lineHeight: 1, opacity: 0.7 }} aria-hidden="true">
                      ×
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Product grid ─────────────────────────────────────────────── */}
      <div
        className="grid gap-3"
        style={{ gridTemplateColumns: "repeat(3, 1fr)" }}
      >
        {filtered.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} dark={dark} />
        ))}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-24"
        >
          <span style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }}>👟</span>
          <p className="font-body" style={{ fontSize: 14, color: emptyColor, letterSpacing: "0.08em" }}>
            No hay productos disponibles en esta categoría
          </p>
        </motion.div>
      )}

      {/* ── Ver todos ────────────────────────────────────────────────────── */}
      <div className="flex justify-center" style={{ marginTop: "3rem" }}>
        <motion.button
          className="font-body font-medium uppercase"
          style={{
            fontSize:      11,
            letterSpacing: "0.16em",
            color:         btnColor,
            background:    "transparent",
            border:        `1px solid ${btnBorder}`,
            padding:       "14px 48px",
            cursor:        "pointer",
          }}
          whileHover={btnHover}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
        >
          Ver todos
        </motion.button>
      </div>
    </section>
  );
}
