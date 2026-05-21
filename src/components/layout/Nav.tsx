"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useCollectionSearch } from "@/context/CollectionSearchContext";
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
  const [isDark, setIsDark]         = useState(true);
  const [hasGlass, setHasGlass]     = useState(false); // false = transparent, true = frosted glass
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname                    = usePathname();
  const navRef                      = useRef<HTMLElement>(null);
  const navInputRef                 = useRef<HTMLInputElement>(null);

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

  /* ── Detect active data-nav-theme section ─────────────────────────── */
  // Uses elementsFromPoint to ask the browser what's literally behind
  // the nav bar at the current scroll position — immune to timing issues.
  const update = useCallback(() => {
    const nav = navRef.current;
    // Sample the stack of elements behind the vertical centre of the nav bar.
    const elements = document.elementsFromPoint(window.innerWidth / 2, 36);

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
        {/* ── Logo ──────────────────────────────────────────────────────── */}
        <Link
          href="/"
          className="relative block flex-shrink-0 hover:opacity-60 transition-opacity duration-200"
          style={{ height: 80, width: 320 }}
          aria-label="SNEAX — Home"
        >
          <Image
            src="/images/logo-white.png"
            alt="SNEAX"
            fill
            className="object-contain object-left"
            style={{ opacity: isDark ? 1 : 0, transition: "opacity 500ms ease-out" }}
            priority
          />
          <Image
            src="/images/logo-black.png"
            alt=""
            aria-hidden="true"
            fill
            className="object-contain object-left"
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

          <button
            className="nav-item hidden md:block font-body text-[11px] tracking-[0.16em] uppercase"
            style={{
              color:      mutedColor,
              transition: "color 500ms ease-out",
              background: "none",
              border:     "none",
              cursor:     "pointer",
            }}
          >
            Cuenta
          </button>

          <button
            onClick={toggleCart}
            aria-label={`Carrito, ${totalItems} artículo${totalItems !== 1 ? "s" : ""}`}
            className="nav-item font-body text-[11px] tracking-[0.16em] uppercase active:scale-95 transition-transform duration-100"
            style={{
              color:      mutedColor,
              transition: "color 500ms ease-out",
              background: "none",
              border:     "none",
              cursor:     "pointer",
            }}
          >
            Carrito
            {totalItems > 0 ? (
              <span className="ml-1" style={{ color: "#F2BF1A" }}>({totalItems})</span>
            ) : (
              <span className="ml-1 opacity-40">(0)</span>
            )}
          </button>
        </div>
      </nav>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <CartSidebar />
    </>
  );
}
