"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { gsap } from "@/lib/gsap";

// ─── Catalog ──────────────────────────────────────────────────────────────────
const PRODUCTS = [
  {
    id: "asics-gel-1130",
    dropLabel: "DROP 001",
    brand: "ASICS",
    name: "Gel-1130",
    price: "₡71,900",
    originalPrice: "₡89,900",
    shipping: "Envío gratis a todo el país",
    description: "La silueta que define el momento. La Gel-1130 en White Pure Silver lleva la amortiguación GEL de ASICS a un diseño lifestyle que domina calles y feeds por igual.",
    tags: ["Lifestyle", "Amortiguación", "Unisex"],
    image: "/images/products/asicsFeatured.png",
  },
  {
    id: "puma-speedcat-chocolate",
    dropLabel: "DROP 002",
    brand: "Puma",
    name: "Speedcat TTF",
    price: "₡84,900",
    shipping: "Envío gratis a todo el país",
    description: "Heritage de pista, actitud de calle. La Speedcat TTF en Dark Chocolate con Frosted Ivory trae de vuelta la silueta más baja y limpia de PUMA con una paleta que lo dice todo sin decir nada.",
    tags: ["Lifestyle", "Retro", "Unisex"],
    image: "/images/products/puma-speedcat-chocolate.png",
  },
  {
    id: "nike-af1-nocta-clb",
    dropLabel: "DROP 003",
    brand: "Nike",
    name: "Air Force 1 Low",
    price: "₡139,900",
    shipping: "Envío gratis a todo el país",
    description: "Drake × Nike. La Certified Lover Boy lleva la silueta más vendida de la historia al territorio del arte — una pieza de colección que redefine qué significa una collab.",
    tags: ["Collab", "Lifestyle", "Limited"],
    image: "/images/products/nike-af1-nocta-clb.png",
  },
  {
    id: "adidas-ballerina-bad-bunny",
    dropLabel: "DROP 004",
    brand: "Adidas",
    name: "Ballerina",
    price: "₡134,900",
    shipping: "Envío gratis a todo el país",
    description: "Bad Bunny rompe moldes otra vez. La Ballerina Bold Gold lleva la estética de la danza clásica a las calles con una energía completamente nueva — tan inesperada como inevitable.",
    tags: ["Collab", "Lifestyle", "Limited"],
    image: "/images/products/adidas-ballerina-bad-bunny.png",
  },
  {
    id: "timberland-6in-wheat",
    dropLabel: "DROP 005",
    brand: "Timberland",
    name: "6'' Premium Boot",
    price: "₡119,900",
    shipping: "Envío gratis a todo el país",
    description: "El ícono que sobrevivió décadas de tendencias. La 6'' Premium en Wheat Nubuck es tan relevante hoy como el primer día — impermeable, indestructible, inconfundible.",
    tags: ["Lifestyle", "Outdoor", "Icónico"],
    image: "/images/products/timberland-6in-wheat.png",
  },
] as const;

type ProductId = (typeof PRODUCTS)[number]["id"];

// Enter-only transitions — no AnimatePresence, no exit variants.
// This prevents Framer Motion from holding DOM nodes during page navigation
// (which caused the removeChild conflict with React's unmounting in Next.js App Router).
const IMG_TRANSITION  = { duration: 0.55, ease: [0.23, 1, 0.32, 1] as const };
const INFO_TRANSITION = { duration: 0.38, ease: [0.23, 1, 0.32, 1] as const };

// ─── Component ────────────────────────────────────────────────────────────────
export default function FeaturedDrop() {
  const [activeId, setActiveId]   = useState<ProductId>("asics-gel-1130");
  const [imgError, setImgError]   = useState(false);
  const active      = PRODUCTS.find((p) => p.id === activeId) ?? PRODUCTS[0];
  const activeIndex = PRODUCTS.findIndex((p) => p.id === activeId);
  const sectionRef  = useRef<HTMLElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Reset error state whenever the active product changes
  useEffect(() => { setImgError(false); }, [activeId]);

  // Auto-scroll carousel to keep active thumb visible on mobile
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    const thumb = carousel.children[activeIndex] as HTMLElement | undefined;
    if (thumb) thumb.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [activeIndex]);

  function navigate(dir: 1 | -1) {
    const next = PRODUCTS[(activeIndex + dir + PRODUCTS.length) % PRODUCTS.length];
    setActiveId(next.id);
  }

  // ── GSAP entry animations ─────────────────────────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!sectionRef.current) return;
      const trigger = { trigger: sectionRef.current, start: "top 78%", once: true };

      gsap.from("[data-fd-img]", {
        y: 60, opacity: 0, duration: 0.9, ease: "power3.out",
        scrollTrigger: trigger,
      });
      gsap.from("[data-fd-text]", {
        x: 40, opacity: 0, duration: 0.7, ease: "power3.out",
        stagger: 0.07, scrollTrigger: trigger,
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="featured-drop"
      data-nav-theme="light"
      className="w-full flex flex-col"
      style={{ minHeight: "100dvh" }}
    >
      {/* ── Two-column area ───────────────────────────────────────────────── */}
      <div className="fd-main flex flex-1">

        {/* LEFT — surface #D4D0C8 */}
        <div
          className="fd-left relative w-1/2 flex items-center justify-center overflow-hidden"
          style={{ background: "#D4D0C8" }}
        >
          {/* Drop label */}
          <span
            className="absolute top-8 left-8 font-body font-medium uppercase select-none"
            style={{ fontSize: 11, letterSpacing: "0.22em", color: "#F2BF1A" }}
          >
            {active.dropLabel}
          </span>

          {/* Watermark */}
          <motion.span
            key={active.id + "-wm"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.07 }}
            transition={{ duration: 0.55 }}
            className="absolute font-display pointer-events-none select-none"
            style={{
              fontSize: "clamp(10rem, 62vw, 30rem)",
              lineHeight: 1,
              color: "#0A0A0A",
              letterSpacing: "-0.03em",
              transform: "scaleY(2.2)",
              transformOrigin: "center",
            }}
            aria-hidden="true"
          >
            {active.brand.toUpperCase()}
          </motion.span>

          {/* Flechas de navegación — mobile only */}
          <div className="md:hidden absolute bottom-5 left-0 right-0 flex justify-between px-5 z-20 pointer-events-none">
            <button
              onClick={() => navigate(-1)}
              aria-label="Producto anterior"
              className="pointer-events-auto"
              style={{
                width: 36, height: 36, borderRadius: "50%",
                background: "rgba(10,10,10,0.55)",
                border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#F0EDE8", fontSize: 16, lineHeight: 1,
                backdropFilter: "blur(6px)",
              }}
            >
              ‹
            </button>
            <button
              onClick={() => navigate(1)}
              aria-label="Producto siguiente"
              className="pointer-events-auto"
              style={{
                width: 36, height: 36, borderRadius: "50%",
                background: "rgba(10,10,10,0.55)",
                border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#F0EDE8", fontSize: 16, lineHeight: 1,
                backdropFilter: "blur(6px)",
              }}
            >
              ›
            </button>
          </div>

          {/* Discount badge — top-right corner, only when product has originalPrice */}
          {"originalPrice" in active && active.originalPrice && (
            <motion.span
              key={active.id + "-badge"}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
              className="absolute font-body font-bold"
              style={{
                top:           "1.5rem",
                right:         "1.5rem",
                zIndex:        20,
                background:    "#F2BF1A",
                color:         "#0A0A0A",
                fontSize:      11,
                letterSpacing: "0.12em",
                padding:       "4px 10px",
                borderRadius:  2,
              }}
            >
              -20%
            </motion.span>
          )}

          {/* Sneaker + shadow
              motion.div handles enter animation (key swap).
              Inner div runs the CSS float keyframe.
              Separate elements avoid transform conflicts. */}
          <div data-fd-img className="relative z-10 flex flex-col items-center">
            <motion.div
              key={active.id}
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0,  opacity: 1 }}
              transition={IMG_TRANSITION}
            >
                <div
                  style={{
                    animation: "fd-float 3s ease-in-out infinite alternate",
                    transform: active.id === "adidas-ballerina-bad-bunny" ? "translateY(18%)" : undefined,
                  }}
                >
                  {imgError ? (
                    <div
                      className="flex flex-col items-center justify-center"
                      style={{
                        width: "clamp(320px, 46vw, 640px)",
                        height: "clamp(220px, 32vw, 440px)",
                        background: "#C0BDB5",
                        borderRadius: 4,
                      }}
                    >
                      <span style={{ fontSize: 64, opacity: 0.2 }}>👟</span>
                      <span
                        className="font-body uppercase tracking-[0.2em] mt-3"
                        style={{ fontSize: 10, color: "rgba(10,10,10,0.3)" }}
                      >
                        Imagen próximamente
                      </span>
                    </div>
                  ) : (
                    <Image
                      src={active.image}
                      alt={`${active.brand} ${active.name}`}
                      width={520}
                      height={360}
                      className="object-contain"
                      style={{
                        width: "clamp(320px, 46vw, 640px)",
                        height: "auto",
                        objectPosition: "center",
                      }}
                      priority
                      onError={() => setImgError(true)}
                    />
                  )}
                </div>
            </motion.div>

            {/* Ground shadow — skip for products with baked-in shadow */}
            {active.id !== "asics-gel-1130" && (
              <div
                aria-hidden="true"
                style={{
                  width: "clamp(200px, 32vw, 420px)",
                  height: 28,
                  marginTop: active.id === "adidas-ballerina-bad-bunny" ? "clamp(-80px, -12vw, -120px)" : -16,
                  background: "rgba(0,0,0,0.45)",
                  borderRadius: "50%",
                  filter: "blur(14px)",
                  animation: "fd-shadow 3s ease-in-out infinite alternate",
                }}
              />
            )}
          </div>
        </div>

        {/* RIGHT — concrete #E8E6E1 */}
        <div
          className="fd-right w-1/2 flex flex-col justify-center"
          style={{
            background: "#E8E6E1",
            padding: "clamp(2rem, 4.5vw, 4.5rem) clamp(2.5rem, 5vw, 5rem)",
          }}
        >
          <p
            data-fd-text
            className="font-body font-medium uppercase"
            style={{ fontSize: 11, letterSpacing: "0.22em", color: "#B8B4AC", marginBottom: "0.65rem" }}
          >
            Lanzamiento Destacado
          </p>

          <motion.div key={active.id + "-head"} initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={INFO_TRANSITION}>
            <p
              className="font-body font-medium uppercase"
              style={{ fontSize: 12, letterSpacing: "0.32em", color: "#0A0A0A", marginBottom: "0.3rem" }}
            >
              {active.brand}
            </p>
            <h2
              className="font-display"
              style={{
                fontSize: "clamp(3.8rem, 9vw, 4.75rem)",
                lineHeight: 0.92,
                letterSpacing: "-0.01em",
                color: "#0A0A0A",
                marginBottom: "1.5rem",
              }}
            >
              {active.brand}<br />{active.name}
            </h2>
          </motion.div>

          <div
            data-fd-text
            style={{ height: 1, background: "#B8B4AC", marginBottom: "1.5rem" }}
          />

          <motion.div
            key={active.id + "-price"}
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0,  opacity: 1 }}
            transition={{ ...INFO_TRANSITION, delay: 0.13 }}
            className="flex items-center flex-wrap gap-3"
            style={{ marginBottom: "2rem" }}
          >
            {"originalPrice" in active && active.originalPrice && (
              <span
                className="font-body font-medium"
                style={{ fontSize: "clamp(1rem, 1.6vw, 1.25rem)", color: "#B8B4AC", textDecoration: "line-through" }}
              >
                {active.originalPrice}
              </span>
            )}
            <span
              className="font-body font-bold"
              style={{ fontSize: "clamp(1.6rem, 2.5vw, 2.1rem)", color: "originalPrice" in active && active.originalPrice ? "#C08A00" : "#0A0A0A" }}
            >
              {active.price}
            </span>
            {"originalPrice" in active && active.originalPrice && (
              <span
                className="font-body font-bold"
                style={{
                  fontSize:      10,
                  letterSpacing: "0.12em",
                  background:    "#F2BF1A",
                  color:         "#0A0A0A",
                  padding:       "3px 8px",
                  borderRadius:  2,
                }}
              >
                -20%
              </span>
            )}
          </motion.div>

          <div data-fd-text>
            <Link
              href={`/productos/${active.id}`}
              className="fd-cta font-body font-medium uppercase transition-opacity duration-200 hover:opacity-70 active:scale-[0.98] transition-transform"
              style={{
                background: "#0A0A0A",
                color: "#E8E6E1",
                fontSize: 12,
                letterSpacing: "0.12em",
                width: 280,
                height: 52,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
              }}
            >
              Ver producto →
            </Link>
          </div>
        </div>
      </div>

      {/* ── Carousel ──────────────────────────────────────────────────────── */}
      <div
        ref={carouselRef}
        className="fd-carousel w-full flex overflow-x-auto"
        style={{ background: "#D4D0C8", borderTop: "1px solid #B8B4AC", flexShrink: 0, scrollbarWidth: "none" }}
      >
        {PRODUCTS.map((product) => {
          const isActive = product.id === activeId;
          return (
            <button
              key={product.id}
              onClick={() => setActiveId(product.id)}
              aria-pressed={isActive}
              aria-label={`${product.brand} ${product.name}`}
              className="flex-shrink-0 flex items-center gap-3 transition-colors duration-300 focus-visible:outline-none"
              style={{
                width: 228,
                height: 90,
                padding: "0 18px",
                background: isActive ? "#0A0A0A" : "transparent",
                border: "none",
                borderRight: "1px solid #B8B4AC",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <div className="relative flex-shrink-0" style={{ width: 52, height: 52 }}>
                <Image
                  src={product.image}
                  alt=""
                  fill
                  className="object-contain"
                  style={{ opacity: isActive ? 1 : 0.6 }}
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = "0"; }}
                />
              </div>

              <div className="flex flex-col min-w-0">
                <span
                  className="font-body font-medium uppercase truncate"
                  style={{ fontSize: 9, letterSpacing: "0.18em", color: isActive ? "#F2BF1A" : "#B8B4AC", marginBottom: 3 }}
                >
                  {product.brand}
                </span>
                <span
                  className="font-body font-medium truncate"
                  style={{ fontSize: 12, letterSpacing: "0.04em", color: isActive ? "#FFFFFF" : "#0A0A0A", lineHeight: 1.3 }}
                >
                  {product.name}
                </span>
              </div>
            </button>
          );
        })}
      </div>
      {/* Dots — mobile only, debajo de la tira de thumbnails.
          order: -1 para que queden junto al fd-carousel (que también es order -1)
          y ambos aparezcan antes del fd-main en el flex column mobile. */}
      <div
        className="md:hidden flex justify-center gap-[7px] py-3 fd-dots"
        style={{ background: "#D4D0C8" }}
      >
        {PRODUCTS.map((p) => {
          const isActive = p.id === activeId;
          return (
            <button
              key={p.id}
              onClick={() => setActiveId(p.id)}
              aria-label={`Ver ${p.brand} ${p.name}`}
              style={{
                width:        isActive ? 18 : 6,
                height:       6,
                borderRadius: 3,
                background:   isActive ? "#F2BF1A" : "rgba(10,10,10,0.22)",
                border:       "none",
                cursor:       "pointer",
                padding:      0,
                transition:   "width 300ms cubic-bezier(0.23,1,0.32,1), background 300ms ease",
              }}
            />
          );
        })}
      </div>
    </section>
  );
}
