"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useCollectionSearch } from "@/context/CollectionSearchContext";
import { useAuth } from "@/context/AuthContext";
import SearchOverlay from "./SearchOverlay";
import CartSidebar from "./CartSidebar";

const CENTER_LINKS = [
  { label: "Inicio",              href: "/"            },
  { label: "Colección",           href: "/collection"  },
  { label: "Nuevos Lanzamientos", href: "/new-drops"   },
  { label: "Nosotros",            href: "/about"       },
] as const;

export default function Nav() {
  const { totalItems, toggleCart } = useCart();
  const { user, logout }           = useAuth();
  const [isDark, setIsDark]           = useState(true);
  const [hasGlass, setHasGlass]       = useState(false);
  const [searchOpen,     setSearchOpen]     = useState(false);
  const [accountOpen,    setAccountOpen]    = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname                      = usePathname();
  const navRef                        = useRef<HTMLElement>(null);
  const navInputRef                   = useRef<HTMLInputElement>(null);
  const accountRef                    = useRef<HTMLDivElement>(null);

  const { query, setQuery, heroVisible } = useCollectionSearch();
  // Show compact nav search when on /collection and in-page search has scrolled away
  const showNavSearch = pathname === "/collection" && !heroVisible;

  // Auto-focus nav search input when it appears
  useEffect(() => {
    if (showNavSearch) {
      const t = setTimeout(() => navInputRef.current?.focus(), 180);
      return () => clearTimeout(t);
    }
  }, [showNavSearch]);

  // Close account dropdown on outside click
  useEffect(() => {
    if (!accountOpen) return;
    function handler(e: MouseEvent) {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [accountOpen]);

  // Close mobile menu on route change
  useEffect(() => { setMobileMenuOpen(false); }, [pathname]);

  // Body scroll lock when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  /* ── Detect active data-nav-theme section ─────────────────────────── */
  // Uses elementsFromPoint to ask the browser what's literally behind
  // the nav bar at the current scroll position — immune to timing issues.
  const update = useCallback(() => {
    const nav = navRef.current;
    // Sample just below the nav bar (nav is h-[72px]) so we always hit page
    // content and not the nav itself — fixes mobile browsers that don't
    // penetrate through fixed elements at their own centre point.
    const sampleY = nav ? nav.offsetHeight + 105 : 177;
    const elements = document.elementsFromPoint(window.innerWidth / 2, sampleY);

    for (const el of elements) {
      // Skip the nav and its own children
      if (nav && nav.contains(el)) continue;

      // Walk up to find the nearest data-nav-theme ancestor
      const themed = el.closest("[data-nav-theme]") as HTMLElement | null;
      if (themed) {
        const theme = themed.getAttribute("data-nav-theme");
        // "dark"       → transparent bg, white text  (hero video, about webgl)
        // "dark-glass" → dark frosted glass, white text  (new-drops, solid dark sections)
        // "light"      → light frosted glass, dark text
        setIsDark(theme !== "light");
        setHasGlass(theme !== "dark");
        return;
      }
    }
    setIsDark(true);
    setHasGlass(false); // default: transparent
  }, []);

  // Scroll listener
  useEffect(() => {
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [update]);

  // Re-detect on route change — fire immediately AND after first paint.
  // The synchronous call catches pages that are already rendered (e.g. back-nav);
  // the rAF catches pages that paint after the effect runs.
  useEffect(() => {
    update();
    const raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, [pathname, update]);

  /* ── Derived values ────────────────────────────────────────────────── */
  const mutedColor    = isDark ? "rgba(255,255,255,0.5)"  : "rgba(10,10,10,0.5)";
  const hoverColor    = isDark ? "rgba(255,255,255,0.95)" : "rgba(10,10,10,0.9)";
  const searchHoverBg = isDark ? "rgba(255,255,255,0.07)" : "rgba(10,10,10,0.05)";

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-0 inset-x-0 z-50 h-[72px] flex items-center px-6 md:px-8"
        style={{
          ["--nav-hover"           as string]: hoverColor,
          ["--nav-search-hover-bg" as string]: searchHoverBg,
          background:           !hasGlass ? "transparent"
                              : isDark  ? "rgba(10,10,10,0.75)"
                              :           "rgba(232,230,225,0.88)",
          backdropFilter:       hasGlass ? "blur(14px)" : "none",
          WebkitBackdropFilter: hasGlass ? "blur(14px)" : "none",
          borderBottom:         hasGlass
                              ? `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(184,180,172,0.3)"}`
                              : "1px solid transparent",
          transition: "background 500ms ease-out, backdrop-filter 500ms ease-out, border-color 500ms ease-out",
        }}
      >
        {/* ── MENÚ trigger — mobile izquierda ──────────────────────────── */}
        <button
          className="flex md:hidden items-center"
          onClick={() => setMobileMenuOpen((v) => !v)}
          aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={mobileMenuOpen}
          style={{
            background:    "none",
            border:        "none",
            cursor:        "pointer",
            padding:       "4px 2px",
            color:         mutedColor,
            fontFamily:    "var(--font-dm-sans, sans-serif)",
            fontSize:      10,
            fontWeight:    500,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            lineHeight:    1,
            minWidth:      36,
            transition:    "color 300ms ease-out",
            flexShrink:    0,
          }}
        >
          <AnimatePresence mode="wait" initial={false}>
            {mobileMenuOpen ? (
              <motion.span
                key="close"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
                style={{ display: "block" }}
              >
                ✕
              </motion.span>
            ) : (
              <motion.span
                key="menu"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
                style={{ display: "block" }}
              >
                MENÚ
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        {/* ── Logo — centrado en mobile, izquierda en desktop ───────────── */}
        <Link
          href="/"
          className="block flex-shrink-0 hover:opacity-60 transition-opacity duration-200 absolute left-1/2 -translate-x-1/2 md:relative md:left-auto md:translate-x-0"
          style={{ height: 80, width: "clamp(160px, 45vw, 320px)" }}
          aria-label="SNEAX — Home"
        >
          <Image
            src="/images/logo-white.png"
            alt="SNEAX"
            fill
            className="object-contain object-center md:object-left"
            style={{ opacity: isDark ? 1 : 0, transition: "opacity 500ms ease-out" }}
            priority
          />
          <Image
            src="/images/logo-black.png"
            alt=""
            aria-hidden="true"
            fill
            className="object-contain object-center md:object-left"
            style={{ opacity: isDark ? 0 : 1, transition: "opacity 500ms ease-out" }}
            priority
          />
        </Link>

        {/* ── Centre zone — links ↔ collection search ───────────────── */}
        <div className="absolute left-1/2 -translate-x-1/2 hidden md:block" style={{ width: 380 }}>

          {/* Nav links */}
          <div
            className="flex items-center justify-center gap-7"
            style={{
              opacity:       showNavSearch ? 0 : 1,
              pointerEvents: showNavSearch ? "none" : "auto",
              transition:    "opacity 180ms ease",
              position:      "absolute",
              inset:         0,
              whiteSpace:    "nowrap",
            }}
          >
            {CENTER_LINKS.map(({ label, href }) => {
              const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
              return (
                <Link
                  key={label}
                  href={href}
                  className="nav-item font-body text-[11px] tracking-[0.16em] uppercase relative flex flex-col items-center gap-[5px]"
                  style={{ color: isActive ? hoverColor : mutedColor, transition: "color 500ms ease-out" }}
                >
                  {label}
                  <span
                    aria-hidden="true"
                    style={{
                      display:    "block",
                      width:      3,
                      height:     3,
                      borderRadius: "50%",
                      background: "#F2BF1A",
                      opacity:    isActive ? 1 : 0,
                      transform:  isActive ? "scale(1)" : "scale(0)",
                      transition: "opacity 300ms ease-out, transform 300ms cubic-bezier(0.23,1,0.32,1)",
                    }}
                  />
                </Link>
              );
            })}
          </div>

          {/* Compact search — appears when collection in-page search scrolls away */}
          <div
            style={{
              opacity:       showNavSearch ? 1 : 0,
              pointerEvents: showNavSearch ? "auto" : "none",
              transition:    "opacity 180ms ease",
              position:      "absolute",
              inset:         0,
              display:       "flex",
              alignItems:    "center",
            }}
          >
            <div
              style={{
                display:      "flex",
                alignItems:   "center",
                gap:          8,
                border:       `1px solid ${isDark ? "rgba(255,255,255,0.22)" : "rgba(10,10,10,0.2)"}`,
                borderRadius: 2,
                padding:      "0 12px",
                height:       34,
                width:        "100%",
                transition:   "border-color 300ms ease",
              }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ flexShrink: 0, color: mutedColor }}>
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <input
                ref={navInputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar…"
                className="font-body nav-collection-search"
                style={{
                  flex:          1,
                  background:    "transparent",
                  border:        "none",
                  outline:       "none",
                  fontSize:      11,
                  letterSpacing: "0.10em",
                  color:         hoverColor,
                  appearance:    "none",
                  minWidth:      0,
                }}
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  style={{ background: "none", border: "none", cursor: "pointer", color: mutedColor, fontSize: 15, lineHeight: 1, padding: 0, flexShrink: 0 }}
                  aria-label="Limpiar"
                >×</button>
              )}
            </div>
          </div>

        </div>

        {/* ── Right actions ─────────────────────────────────────────────── */}
        <div className="ml-auto flex items-center gap-5">

          {/* Buscar — oculto en /collection: ahí la búsqueda de la colección lo reemplaza */}
          {pathname !== "/collection" && (
            <button
              onClick={() => setSearchOpen(true)}
              className="nav-search-btn hidden md:flex items-center gap-2 font-body uppercase tracking-[0.16em]"
              style={{
                fontSize:     11,
                color:        mutedColor,
                border:       isDark ? "1px solid rgba(255,255,255,0.22)" : "1px solid rgba(10,10,10,0.2)",
                borderRadius: 2,
                padding:      "6px 14px",
                background:   "transparent",
                cursor:       "pointer",
                transition:   "color 500ms ease-out, border-color 500ms ease-out",
              }}
              aria-label="Abrir búsqueda"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              Buscar
            </button>
          )}

          {/* ── Account dropdown ───────────────────────────────────── */}
          <div ref={accountRef} className="hidden md:block" style={{ position: "relative" }}>
            <button
              onClick={() => setAccountOpen((v) => !v)}
              className="nav-item font-body text-[11px] tracking-[0.16em] uppercase"
              style={{
                color:      mutedColor,
                transition: "color 500ms ease-out",
                background: "none",
                border:     "none",
                cursor:     "pointer",
                display:    "flex",
                alignItems: "center",
                gap:        5,
              }}
            >
              {user ? user.name.split(" ")[0] : "Cuenta"}
              {user && (
                <span style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: "#F2BF1A", flexShrink: 0,
                }} />
              )}
            </button>

            {accountOpen && (
              <div style={{
                position:   "absolute",
                top:        "calc(100% + 12px)",
                right:      0,
                minWidth:   180,
                background: isDark ? "rgba(18,18,18,0.96)" : "rgba(248,246,242,0.97)",
                border:     `1px solid ${isDark ? "rgba(240,237,232,0.1)" : "rgba(10,10,10,0.09)"}`,
                borderRadius: 3,
                boxShadow:  "0 12px 32px rgba(0,0,0,0.18)",
                backdropFilter: "blur(12px)",
                overflow:   "hidden",
                zIndex:     60,
              }}>
                {user ? (
                  <>
                    {/* User info header */}
                    <div style={{ padding: "14px 18px 12px", borderBottom: `1px solid ${isDark ? "rgba(240,237,232,0.07)" : "rgba(10,10,10,0.06)"}` }}>
                      <p className="font-body font-medium" style={{ fontSize: 13, color: isDark ? "#F0EDE8" : "#0A0A0A", lineHeight: 1.3 }}>{user.name}</p>
                      <p className="font-body" style={{ fontSize: 11, color: isDark ? "rgba(240,237,232,0.35)" : "#B8B4AC", marginTop: 2 }}>{user.email}</p>
                    </div>
                    {/* Mi cuenta */}
                    <Link
                      href="/cuenta"
                      onClick={() => setAccountOpen(false)}
                      className="font-body"
                      style={{
                        display:       "block",
                        padding:       "12px 18px",
                        fontSize:      12,
                        letterSpacing: "0.04em",
                        color:         isDark ? "#F0EDE8" : "#0A0A0A",
                        textDecoration: "none",
                        transition:    "background 120ms ease",
                        borderBottom:  `1px solid ${isDark ? "rgba(240,237,232,0.07)" : "rgba(10,10,10,0.06)"}`,
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = isDark ? "rgba(240,237,232,0.06)" : "rgba(10,10,10,0.04)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      Mi cuenta
                    </Link>
                    {/* Cerrar sesión */}
                    <button
                      onClick={() => { logout(); setAccountOpen(false); }}
                      className="font-body"
                      style={{
                        display:       "block",
                        width:         "100%",
                        textAlign:     "left",
                        padding:       "12px 18px",
                        fontSize:      12,
                        letterSpacing: "0.04em",
                        color:         isDark ? "rgba(240,237,232,0.5)" : "#8A8680",
                        background:    "none",
                        border:        "none",
                        cursor:        "pointer",
                        transition:    "background 120ms ease, color 120ms ease",
                      }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = isDark ? "rgba(240,237,232,0.06)" : "rgba(10,10,10,0.04)"; (e.currentTarget as HTMLElement).style.color = isDark ? "#F0EDE8" : "#0A0A0A"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = isDark ? "rgba(240,237,232,0.5)" : "#8A8680"; }}
                    >
                      Cerrar sesión
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setAccountOpen(false)}
                      className="font-body"
                      style={{
                        display:       "block",
                        padding:       "12px 18px",
                        fontSize:      12,
                        letterSpacing: "0.04em",
                        color:         isDark ? "#F0EDE8" : "#0A0A0A",
                        textDecoration: "none",
                        borderBottom:  `1px solid ${isDark ? "rgba(240,237,232,0.07)" : "rgba(10,10,10,0.06)"}`,
                        transition:    "background 120ms ease",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = isDark ? "rgba(240,237,232,0.06)" : "rgba(10,10,10,0.04)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      Iniciar sesión
                    </Link>
                    <Link
                      href="/registro"
                      onClick={() => setAccountOpen(false)}
                      className="font-body"
                      style={{
                        display:       "block",
                        padding:       "12px 18px",
                        fontSize:      12,
                        letterSpacing: "0.04em",
                        color:         isDark ? "#F0EDE8" : "#0A0A0A",
                        textDecoration: "none",
                        transition:    "background 120ms ease",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = isDark ? "rgba(240,237,232,0.06)" : "rgba(10,10,10,0.04)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      Registrarse
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Buscar — mobile only, abre SearchOverlay */}
          {pathname !== "/collection" && (
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Abrir búsqueda"
              className="flex md:hidden nav-item active:scale-95 transition-transform duration-100"
              style={{
                background: "none",
                border:     "none",
                cursor:     "pointer",
                padding:    6,
                color:      mutedColor,
                transition: "color 500ms ease-out",
                alignItems: "center",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
                <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
          )}

          <button
            onClick={toggleCart}
            aria-label={`Carrito, ${totalItems} artículo${totalItems !== 1 ? "s" : ""}`}
            className="nav-item active:scale-95 transition-transform duration-100 relative"
            style={{
              color:      mutedColor,
              transition: "color 500ms ease-out",
              background: "none",
              border:     "none",
              cursor:     "pointer",
              padding:    4,
              display:    "flex",
              alignItems: "center",
            }}
          >
            {/* Desktop — texto */}
            <span className="hidden md:inline font-body text-[11px] tracking-[0.16em] uppercase">
              Carrito
              {totalItems > 0 ? (
                <span className="ml-1" style={{ color: "#F2BF1A" }}>({totalItems})</span>
              ) : (
                <span className="ml-1 opacity-40">(0)</span>
              )}
            </span>

            {/* Mobile — ícono bolsa + badge */}
            <span className="md:hidden relative" style={{ alignItems: "center" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/>
                <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="1.7"/>
                <path d="M16 10a4 4 0 0 1-8 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
              </svg>
              {totalItems > 0 && (
                <span style={{
                  position:       "absolute",
                  top:            -5,
                  right:          -5,
                  width:          14,
                  height:         14,
                  borderRadius:   "50%",
                  background:     "#F2BF1A",
                  color:          "#0A0A0A",
                  fontSize:       8,
                  fontWeight:     700,
                  display:        "flex",
                  alignItems:     "center",
                  justifyContent: "center",
                  lineHeight:     1,
                  fontFamily:     "var(--font-dm-sans, sans-serif)",
                }}>
                  {totalItems}
                </span>
              )}
            </span>
          </button>
        </div>
      </nav>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <CartSidebar />

      {/* ── Mobile menu — misma estética que SearchOverlay ────────────────── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{
              position:             "fixed",
              inset:                0,
              zIndex:               55,
              background:           "rgba(10,10,10,0.85)",
              backdropFilter:       "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              display:              "flex",
              flexDirection:        "column",
            }}
          >
            {/* Header — igual al SearchOverlay */}
            <div style={{
              height:         72,
              flexShrink:     0,
              display:        "flex",
              alignItems:     "center",
              justifyContent: "space-between",
              padding:        "0 24px",
            }}>
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                style={{ height: 44, width: 176, position: "relative", display: "block" }}
                aria-label="SNEAX — Home"
              >
                <Image
                  src="/images/logo-white.png"
                  alt="SNEAX"
                  fill
                  className="object-contain object-left"
                  style={{
                    filter: "drop-shadow(0 0 10px rgba(255,255,255,0.55)) drop-shadow(0 0 24px rgba(255,255,255,0.25))",
                  }}
                  priority
                />
              </Link>

              {/* X circular — igual al SearchOverlay */}
              <button
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Cerrar menú"
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

            {/* Búsqueda — fila en el menú mobile */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1], delay: 0.04 }}
              style={{ padding: "0 24px", marginBottom: 4 }}
            >
              <button
                onClick={() => { setMobileMenuOpen(false); setTimeout(() => setSearchOpen(true), 160); }}
                style={{
                  display:        "flex",
                  alignItems:     "center",
                  gap:            12,
                  width:          "100%",
                  padding:        "18px 0",
                  background:     "none",
                  border:         "none",
                  borderBottom:   "1px solid rgba(255,255,255,0.07)",
                  cursor:         "pointer",
                  color:          "rgba(255,255,255,0.35)",
                  transition:     "color 140ms ease",
                }}
                onTouchStart={e => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
                onTouchEnd={e => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}
                onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
                  <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
                <span
                  className="font-body font-medium uppercase"
                  style={{ fontSize: 13, letterSpacing: "0.16em" }}
                >
                  Buscar
                </span>
              </button>
            </motion.div>

            {/* Nav links */}
            <motion.nav
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.055, delayChildren: 0.06 } } }}
              style={{ flex: 1, overflowY: "auto", padding: "0 24px" }}
            >
              {CENTER_LINKS.map(({ label, href }) => {
                const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
                return (
                  <motion.div
                    key={label}
                    variants={{
                      hidden:  { opacity: 0, y: -14 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.38, ease: [0.23, 1, 0.32, 1] } },
                    }}
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
                  >
                    <Link
                      href={href}
                      onClick={() => setMobileMenuOpen(false)}
                      style={{
                        display:        "flex",
                        alignItems:     "center",
                        justifyContent: "space-between",
                        padding:        "0 0",
                        height:         68,
                        textDecoration: "none",
                        background:     "transparent",
                        transition:     "background 140ms ease",
                        margin:         "0 -24px",
                        paddingLeft:    24,
                        paddingRight:   24,
                      }}
                      onTouchStart={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
                      onTouchEnd={(e)   => (e.currentTarget.style.background = "transparent")}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <span
                        className="font-body font-medium uppercase"
                        style={{
                          fontSize:      13,
                          letterSpacing: "0.16em",
                          color:         isActive ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.45)",
                          transition:    "color 140ms ease",
                        }}
                      >
                        {label}
                      </span>
                      {isActive && (
                        <span style={{
                          width: 6, height: 6, borderRadius: "50%",
                          background: "#F2BF1A", flexShrink: 0,
                        }} />
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </motion.nav>

            {/* Footer — cuenta + social */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.3, ease: "easeOut" }}
              style={{
                flexShrink:     0,
                borderTop:      "1px solid rgba(255,255,255,0.07)",
                padding:        "20px 24px 44px",
                display:        "flex",
                alignItems:     "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {user ? (
                  <>
                    <span className="font-body" style={{ fontSize: 10, letterSpacing: "0.12em", color: "rgba(255,255,255,0.2)" }}>
                      {user.email}
                    </span>
                    <div style={{ display: "flex", gap: 20 }}>
                      <Link
                        href="/cuenta"
                        onClick={() => setMobileMenuOpen(false)}
                        className="font-body uppercase"
                        style={{ fontSize: 11, letterSpacing: "0.16em", color: "rgba(255,255,255,0.6)", textDecoration: "none" }}
                      >
                        Mi cuenta →
                      </Link>
                      <button
                        onClick={() => { logout(); setMobileMenuOpen(false); }}
                        className="font-body uppercase"
                        style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, letterSpacing: "0.16em", color: "rgba(255,255,255,0.25)", padding: 0 }}
                      >
                        Salir
                      </button>
                    </div>
                  </>
                ) : (
                  <div style={{ display: "flex", gap: 20 }}>
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="font-body uppercase"
                      style={{ fontSize: 11, letterSpacing: "0.16em", color: "rgba(255,255,255,0.6)", textDecoration: "none" }}
                    >
                      Iniciar sesión →
                    </Link>
                    <Link
                      href="/registro"
                      onClick={() => setMobileMenuOpen(false)}
                      className="font-body uppercase"
                      style={{ fontSize: 11, letterSpacing: "0.16em", color: "rgba(255,255,255,0.3)", textDecoration: "none" }}
                    >
                      Registrarse
                    </Link>
                  </div>
                )}
              </div>

              <div style={{ display: "flex", gap: 18 }}>
                <a href="https://instagram.com/sneax_cr" target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                  style={{ color: "rgba(255,255,255,0.25)", display: "flex", transition: "color 130ms ease" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
                  onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.25)")}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="currentColor" strokeWidth="1.5" />
                    <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.5" />
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
                  </svg>
                </a>
                <a href="https://wa.me/50688888888" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"
                  style={{ color: "rgba(255,255,255,0.25)", display: "flex", transition: "color 130ms ease" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
                  onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.25)")}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M20.52 3.48A11.93 11.93 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.11.55 4.16 1.6 5.97L0 24l6.18-1.62A11.94 11.94 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.2-1.25-6.21-3.48-8.52Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                    <path d="M17.5 14.9c-.3-.15-1.77-.87-2.04-.97-.28-.1-.48-.15-.68.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.68-1.63-.93-2.23-.24-.59-.49-.51-.68-.52h-.58c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.47s1.06 2.86 1.21 3.06c.15.2 2.09 3.19 5.06 4.47.71.31 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z" fill="currentColor" opacity="0.9"/>
                  </svg>
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
