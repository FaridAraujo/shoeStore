"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "@/lib/gsap";
import { useCart } from "@/context/CartContext";
import {
  PRODUCTS,
  BRANDS,
  formatPrice,
  type BrandFilter,
  type Product,
} from "@/lib/products";
import { useCollectionSearch } from "@/context/CollectionSearchContext";

// ─── Size Popover ─────────────────────────────────────────────────────────────

function SizePopover({
  product,
  dark,
  onClose,
}: {
  product: Product;
  dark: boolean;
  onClose: () => void;
}) {
  const { addItem } = useCart();
  const [added, setAdded] = useState<number | null>(null);

  function pick(size: number) {
    addItem(product, size);
    setAdded(size);
    setTimeout(() => { setAdded(null); onClose(); }, 700);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 6, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 4, scale: 0.97 }}
      transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
      style={{
        position:   "absolute",
        bottom:     "calc(100% + 8px)",
        right:      0,
        zIndex:     20,
        background: dark ? "#1C1C1C" : "#FFFFFF",
        border:     `1px solid ${dark ? "rgba(240,237,232,0.12)" : "rgba(10,10,10,0.1)"}`,
        borderRadius: 3,
        padding:    "10px 12px",
        minWidth:   160,
        boxShadow:  "0 8px 24px rgba(0,0,0,0.18)",
      }}
    >
      <p
        className="font-body font-medium uppercase"
        style={{ fontSize: 9, letterSpacing: "0.22em", color: dark ? "rgba(240,237,232,0.35)" : "#B8B4AC", marginBottom: 8 }}
      >
        Seleccioná talla (EU)
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
        {product.sizes.map((size) => {
          const isAdded = added === size;
          return (
            <button
              key={size}
              onClick={(e) => { e.stopPropagation(); pick(size); }}
              className="font-body font-medium"
              style={{
                fontSize:    11,
                width:       40,
                height:      40,
                border:      `1px solid ${isAdded ? "#F2BF1A" : dark ? "rgba(240,237,232,0.15)" : "rgba(10,10,10,0.15)"}`,
                background:  isAdded ? "#F2BF1A" : "transparent",
                color:       isAdded ? "#0A0A0A" : dark ? "#F0EDE8" : "#0A0A0A",
                cursor:      "pointer",
                borderRadius: 2,
                transition:  "background 120ms ease, border-color 120ms ease, color 120ms ease",
              }}
            >
              {size}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────

function ProductCard({ product, index, dark }: { product: Product; index: number; dark: boolean }) {
  const [imgError,     setImgError]     = useState(false);
  const [popoverOpen,  setPopoverOpen]  = useState(false);
  const cardRef  = useRef<HTMLElement>(null);
  const router   = useRouter();

  useEffect(() => {
    router.prefetch(`/productos/${product.id}`);
  }, [router, product.id]);

  // Close popover on outside click / tap
  useEffect(() => {
    if (!popoverOpen) return;
    function handleClick(e: MouseEvent | TouchEvent) {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        setPopoverOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("touchstart", handleClick as EventListener);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("touchstart", handleClick as EventListener);
    };
  }, [popoverOpen]);

  return (
    <motion.article
      ref={cardRef}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        opacity: { delay: (index % 2) * 0.06, duration: 0.5, ease: [0.23, 1, 0.32, 1] },
        y:       { delay: (index % 2) * 0.06, duration: 0.5, ease: [0.23, 1, 0.32, 1] },
      }}
      whileHover="hovered"
      onClick={() => router.push(`/productos/${product.id}`)}
      className="flex flex-col cursor-pointer"
      style={{ background: dark ? "#181818" : "#D4D0C8", borderRadius: 3 }}
    >
      {/* Image area */}
      <div className="relative" style={{ paddingTop: "65%", borderRadius: "3px 3px 0 0" }}>
        <div
          className="absolute inset-0 flex items-center justify-center p-6"
          style={{ overflow: "hidden", borderRadius: "3px 3px 0 0" }}
        >
          {/* Discount badge — top-left corner of the image area */}
          {product.originalPrice && (
            <div
              className="font-body font-bold"
              style={{
                position:      "absolute",
                top:           10,
                left:          10,
                zIndex:        10,
                background:    "#F2BF1A",
                color:         "#0A0A0A",
                fontSize:      10,
                letterSpacing: "0.12em",
                padding:       "3px 7px",
                borderRadius:  2,
              }}
            >
              -{Math.round((1 - product.price / product.originalPrice) * 100)}%
            </div>
          )}

          {imgError ? (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ background: dark ? "#222222" : "#C0BDB5", borderRadius: 2 }}
            >
              <span style={{ fontSize: 36, opacity: 0.25 }}>👟</span>
            </div>
          ) : (
            <div className="w-full h-full relative">
              {/* Sombra — fuera del blend-mode para no verse afectada */}
              <div
                aria-hidden="true"
                className="absolute left-1/2 bottom-3"
                style={{
                  transform: "translateX(-50%)",
                  width: "65%", height: 18,
                  background: dark ? "rgba(0,0,0,0.7)" : "rgba(0,0,0,0.45)",
                  borderRadius: "50%", filter: "blur(10px)",
                  zIndex: 0,
                }}
              />
              {/*
                Blend wrapper — div plano (no GPU) que envuelve el motion.div.
                El browser compila primero todo el subtree (incl. la capa GPU de
                Framer Motion), y luego aplica multiply sobre el backdrop beige.
                Blanco × #D4D0C8 = #D4D0C8 → los fondos blancos de las imágenes
                desaparecen y quedan iguales al resto de los cards.
              */}
              <div
                className="absolute inset-0"
                style={{ zIndex: 1 }}
              >
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
            </div>
          )}
        </div>
      </div>

      {/* Info area — flex:1 para cubrir cualquier espacio restante del card */}
      <div
        className="relative flex flex-col"
        style={{ flex: 1, background: dark ? "#111111" : "#E8E6E1", padding: "14px 16px 16px", borderRadius: "0 0 3px 3px" }}
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

        <div className="flex items-center justify-between" style={{ position: "relative" }}>
          <div className="flex flex-col" style={{ gap: 1 }}>
            {product.originalPrice && (
              <span
                className="font-body"
                style={{ fontSize: 11, color: dark ? "rgba(240,237,232,0.35)" : "#B8B4AC", textDecoration: "line-through", letterSpacing: "0.02em" }}
              >
                {formatPrice(product.originalPrice)}
              </span>
            )}
            <span className="font-body font-medium" style={{ fontSize: 14, color: product.originalPrice ? "#C08A00" : (dark ? "#F0EDE8" : "#0A0A0A") }}>
              {formatPrice(product.price)}
            </span>
          </div>

          <div style={{ position: "relative" }}>
            <AnimatePresence>
              {popoverOpen && (
                <SizePopover
                  product={product}
                  dark={dark}
                  onClose={() => setPopoverOpen(false)}
                />
              )}
            </AnimatePresence>

            <motion.button
              variants={{ hovered: { opacity: 1, y: 0 } }}
              initial={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              onClick={(e) => { e.stopPropagation(); setPopoverOpen((v) => !v); }}
              className="card-add-btn font-body font-medium uppercase"
              style={{
                fontSize:     10,
                letterSpacing: "0.14em",
                background:   popoverOpen ? "#0A0A0A" : "#F2BF1A",
                color:        popoverOpen ? "#F2BF1A" : "#0A0A0A",
                border:       "none",
                padding:      "6px 12px",
                borderRadius: 2,
                cursor:       "pointer",
                transition:   "background 150ms ease, color 150ms ease",
              }}
              aria-label={`Agregar ${product.name} al carrito`}
              aria-expanded={popoverOpen}
            >
              Agregar
            </motion.button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

// ─── Collection ───────────────────────────────────────────────────────────────

export default function Collection({
  initialBrand,
  newDropsOnly  = false,
  showSearch    = false,
  previewLimit,
}: {
  initialBrand?:  BrandFilter;
  newDropsOnly?:  boolean;
  showSearch?:    boolean;
  previewLimit?:  number;
} = {}) {
  const isPreview = previewLimit !== undefined;
  const dark = newDropsOnly;

  const ITEMS_PER_PAGE = 9;

  const [activeFilter, setActiveFilter] = useState<BrandFilter>(initialBrand ?? "TODOS");
  const [filtersOpen,  setFiltersOpen]  = useState(false);
  const [page,         setPage]         = useState(1);
  const sectionRef  = useRef<HTMLElement>(null);
  const searchRef   = useRef<HTMLDivElement>(null);
  const inputRef    = useRef<HTMLInputElement>(null);

  const { query, setQuery, setHeroVisible } = useCollectionSearch();

  // Tell Nav whether the in-page search bar is visible.
  // Uses getBoundingClientRect on scroll — reliable regardless of threshold quirks.
  useEffect(() => {
    if (newDropsOnly || !showSearch) return;
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

  // Reset to page 1 whenever filters or search change
  useEffect(() => { setPage(1); }, [activeFilter, query]);

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
      style={{ background: sectionBg }}
    >
      {/* ── Header band ──────────────────────────────────────────────── */}
      <div
        className={dark ? undefined : "col-band"}
        style={{
          position: "relative",
          overflow: "hidden",
          background: dark ? sectionBg : "#C8C3BA",
          padding: dark
            ? `clamp(4rem, 8vw, 7rem) clamp(1.5rem, 5vw, 5rem) clamp(2rem, 4vw, 3rem)`
            : `clamp(1.25rem, 2vw, 2rem) clamp(1.5rem, 5vw, 5rem) clamp(3rem, 5vw, 5rem)`,
          boxShadow: dark ? undefined : "inset 0 8px 24px rgba(0,0,0,0.08), inset 0 -8px 24px rgba(0,0,0,0.06)",
        }}
      >
        {/* Watermark "NUESTRA" — visible solo en mobile (oculto en desktop via CSS) */}
        {!dark && (
          <span
            aria-hidden="true"
            className="col-band-watermark font-display pointer-events-none select-none"
            style={{
              position:      "absolute",
              top:           "50%",
              left:          "50%",
              transform:     "translate(-50%, -50%)",
              fontSize:      "clamp(4.5rem, 26vw, 10rem)",
              lineHeight:    1,
              color:         "#0A0A0A",
              opacity:       0.08,
              letterSpacing: "-0.02em",
              whiteSpace:    "nowrap",
              zIndex:        0,
            }}
          >
            NUESTRA
          </span>
        )}

      {/* ── Search bar (collection page only) ───────────────────────── */}
      {showSearch && !dark && (
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
      <div>

        {/* Controls row — count + filter toggle, right-aligned */}
        {!isPreview && (
          <div className="flex items-center justify-end" style={{ marginBottom: "0.6rem" }}>
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
        )}

      </div>

      {/* ── Filter pills ─────────────────────────────────────────────── */}
      {!isPreview && <div
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
      </div>}

        {/* Title — lives in the band, bleeds below via negative marginBottom */}
        <h2
          data-col-header
          className="font-display"
          style={{
            fontSize:      "clamp(3.5rem, 7vw, 5.5rem)",
            lineHeight:    0.9,
            letterSpacing: "-0.01em",
            color:         titleColor,
            position:      "relative",
            zIndex:        2,
            marginBottom:  0,
          }}
        >
          {dark ? "Nuevos Lanzamientos" : "Colección"}
        </h2>

      </div>{/* end header band */}

      {/* ── Grid area ────────────────────────────────────────────────── */}
      {/* paddingTop must clear the h2 that bleeds down from the band.
          h2 height ≈ fontSize×lineHeight = clamp(3.5,7vw,5.5rem)×0.9 ≈ clamp(3.15rem,6.3vw,4.95rem)
          55% of that ≈ clamp(1.73rem,3.5vw,2.72rem) + breathing room ≈ clamp(3.5rem,6vw,5rem) */}
      <div
        className={dark ? undefined : "col-grid"}
        style={{
          background: sectionBg,
          position: "relative",
          zIndex: 0,
          padding: dark
            ? `0 clamp(1.5rem, 5vw, 5rem) clamp(2rem, 4vw, 3rem)`
            : `clamp(2rem, 3.5vw, 3rem) clamp(1.5rem, 5vw, 5rem) clamp(2rem, 4vw, 3rem)`,
        }}
      >

      {/* ── Product grid ─────────────────────────────────────────────── */}
      {(() => {
        const totalPages  = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
        const safePage    = Math.min(page, totalPages);
        const pageItems   = isPreview
          ? filtered.slice(0, previewLimit)
          : filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

        return (
          <>
            <div className="grid gap-3 grid-cols-2 md:grid-cols-3">
              {pageItems.map((product, index) => (
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

            {/* ── Ver todo CTA (modo preview) ──────────────────────────── */}
            {isPreview && (
              <div className="flex justify-center" style={{ marginTop: "2.5rem" }}>
                <a
                  href="/collection"
                  className="font-body font-medium uppercase"
                  style={{
                    fontSize:       11,
                    letterSpacing:  "0.18em",
                    color:          dark ? "#F0EDE8" : "#0A0A0A",
                    textDecoration: "none",
                    border:         `1px solid ${dark ? "rgba(240,237,232,0.25)" : "rgba(10,10,10,0.2)"}`,
                    padding:        "14px 40px",
                    display:        "inline-flex",
                    alignItems:     "center",
                    gap:            10,
                    transition:     "opacity 180ms ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.6")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                >
                  Ver toda la colección →
                </a>
              </div>
            )}

            {/* ── Pagination ───────────────────────────────────────────── */}
            {!isPreview && totalPages > 1 && (
              <div
                className="flex items-center justify-center"
                style={{ marginTop: "3rem", gap: 4 }}
              >
                {/* Prev */}
                <motion.button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={safePage === 1}
                  className="font-body font-medium"
                  style={{
                    width:       36,
                    height:      36,
                    display:     "flex",
                    alignItems:  "center",
                    justifyContent: "center",
                    background:  "transparent",
                    border:      `1px solid ${safePage === 1 ? "transparent" : btnBorder}`,
                    color:       safePage === 1 ? "transparent" : btnColor,
                    cursor:      safePage === 1 ? "default" : "pointer",
                    fontSize:    14,
                    transition:  "border-color 150ms ease, color 150ms ease",
                  }}
                  whileHover={safePage === 1 ? {} : btnHover}
                  whileTap={safePage === 1 ? {} : { scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  aria-label="Página anterior"
                >
                  ←
                </motion.button>

                {/* Page numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => {
                  const isActive = n === safePage;
                  return (
                    <motion.button
                      key={n}
                      onClick={() => setPage(n)}
                      className="font-body font-medium"
                      style={{
                        width:        36,
                        height:       36,
                        display:      "flex",
                        alignItems:   "center",
                        justifyContent: "center",
                        fontSize:     12,
                        letterSpacing: "0.06em",
                        background:   isActive ? (dark ? "#F0EDE8" : "#0A0A0A") : "transparent",
                        color:        isActive ? (dark ? "#0A0A0A" : "#F0EDE8") : btnColor,
                        border:       `1px solid ${isActive ? (dark ? "#F0EDE8" : "#0A0A0A") : btnBorder}`,
                        cursor:       "pointer",
                        transition:   "background 150ms ease, color 150ms ease, border-color 150ms ease",
                      }}
                      whileHover={isActive ? {} : btnHover}
                      whileTap={{ scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      aria-label={`Página ${n}`}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {n}
                    </motion.button>
                  );
                })}

                {/* Next */}
                <motion.button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={safePage === totalPages}
                  className="font-body font-medium"
                  style={{
                    width:       36,
                    height:      36,
                    display:     "flex",
                    alignItems:  "center",
                    justifyContent: "center",
                    background:  "transparent",
                    border:      `1px solid ${safePage === totalPages ? "transparent" : btnBorder}`,
                    color:       safePage === totalPages ? "transparent" : btnColor,
                    cursor:      safePage === totalPages ? "default" : "pointer",
                    fontSize:    14,
                    transition:  "border-color 150ms ease, color 150ms ease",
                  }}
                  whileHover={safePage === totalPages ? {} : btnHover}
                  whileTap={safePage === totalPages ? {} : { scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  aria-label="Página siguiente"
                >
                  →
                </motion.button>
              </div>
            )}
          </>
        );
      })()}
      </div>{/* end grid area */}
    </section>
  );
}
