"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/products";

// ─── EU → US size map (mirrors ProductDetail) ─────────────────────────────────
const EU_TO_US: Record<number, number> = {
  36: 4, 37: 4.5, 38: 5.5, 39: 6.5,
  40: 7, 41: 8,  42: 8.5, 43: 9.5, 44: 10, 45: 11,
};

// ─── Spring — snappy, physical, no bounce ────────────────────────────────────
const DRAWER_SPRING = {
  type:      "spring",
  stiffness: 380,
  damping:   38,
  mass:       1,
} as const;

// ─── Component ────────────────────────────────────────────────────────────────
export default function CartSidebar() {
  const {
    isOpen, closeCart,
    items, totalItems, totalPrice,
    removeItem, updateQuantity,
  } = useCart();

  // ESC to close
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeCart(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, closeCart]);

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ── Backdrop ────────────────────────────────────────────────── */}
          <motion.div
            key="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] as const }}
            onClick={closeCart}
            aria-hidden="true"
            style={{
              position: "fixed",
              inset:    0,
              background: "rgba(10,10,10,0.5)",
              zIndex:   90,
            }}
          />

          {/* ── Drawer ──────────────────────────────────────────────────── */}
          <motion.aside
            key="cart-drawer"
            initial={{ x: 420 }}
            animate={{ x: 0 }}
            exit={{ x: 420 }}
            transition={DRAWER_SPRING}
            role="dialog"
            aria-modal="true"
            aria-label="Carrito de compras"
            style={{
              position:      "fixed",
              top:           0,
              right:         0,
              bottom:        0,
              width:         420,
              background:    "#E8E6E1",
              zIndex:        100,
              display:       "flex",
              flexDirection: "column",
              overflow:      "hidden",
            }}
          >
            {/* ── Header ──────────────────────────────────────────────── */}
            <div
              style={{
                display:        "flex",
                alignItems:     "center",
                justifyContent: "space-between",
                padding:        "0 24px",
                height:         72,
                borderBottom:   "1px solid #B8B4AC",
                flexShrink:     0,
              }}
            >
              <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                <span
                  className="font-display"
                  style={{
                    fontSize:      32,
                    lineHeight:    1,
                    letterSpacing: "-0.01em",
                    color:         "#0A0A0A",
                  }}
                >
                  TU CARRITO
                </span>
                {totalItems > 0 && (
                  <span
                    className="font-body"
                    style={{ fontSize: 12, color: "#B8B4AC", letterSpacing: "0.1em" }}
                  >
                    ({totalItems})
                  </span>
                )}
              </div>

              {/* X close button */}
              <button
                onClick={closeCart}
                aria-label="Cerrar carrito"
                style={{
                  background: "none",
                  border:     "none",
                  cursor:     "pointer",
                  padding:    6,
                  display:    "flex",
                  alignItems: "center",
                  color:      "#0A0A0A",
                  opacity:    0.55,
                  transition: "opacity 150ms ease-out",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.55")}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <line x1="2" y1="2" x2="18" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="18" y1="2" x2="2"  y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* ── Scrollable body ─────────────────────────────────────── */}
            <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
              {items.length === 0 ? (

                /* Empty state */
                <div
                  style={{
                    display:        "flex",
                    flexDirection:  "column",
                    alignItems:     "center",
                    justifyContent: "center",
                    height:         "100%",
                    padding:        "0 32px",
                    textAlign:      "center",
                    gap:            20,
                  }}
                >
                  <svg width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden="true">
                    <line x1="8" y1="8" x2="72" y2="72" stroke="#B8B4AC" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="72" y1="8" x2="8" y2="72" stroke="#B8B4AC" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>

                  <p
                    className="font-body"
                    style={{ fontSize: 15, color: "#5A5850", letterSpacing: "0.01em" }}
                  >
                    Nada por aquí todavía.
                  </p>

                  <Link
                    href="/"
                    onClick={closeCart}
                    className="font-body font-medium uppercase"
                    style={{
                      fontSize:       11,
                      letterSpacing:  "0.18em",
                      color:          "#0A0A0A",
                      textDecoration: "none",
                      borderBottom:   "1px solid rgba(10,10,10,0.35)",
                      paddingBottom:  3,
                      opacity:        0.65,
                      transition:     "opacity 200ms ease-out",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.65")}
                  >
                    Explorá la colección →
                  </Link>
                </div>

              ) : (

                /* Items list */
                <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                  {items.map((item) => {
                    const usSize   = EU_TO_US[item.selectedSize] ?? item.selectedSize;
                    const lineTotal = item.product.price * item.quantity;

                    return (
                      <li
                        key={`${item.product.id}-${item.selectedSize}`}
                        style={{
                          display:      "flex",
                          gap:          16,
                          padding:      "20px 24px",
                          borderBottom: "1px solid #B8B4AC",
                        }}
                      >
                        {/* Thumbnail */}
                        <div
                          style={{
                            width:      80,
                            height:     80,
                            background: "#D4D0C8",
                            flexShrink: 0,
                            position:   "relative",
                          }}
                        >
                          <Image
                            src={item.product.image}
                            alt={`${item.product.brand} ${item.product.name}`}
                            fill
                            className="object-contain"
                            style={{ padding: 8 }}
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).style.opacity = "0";
                            }}
                          />
                        </div>

                        {/* Info column */}
                        <div
                          style={{
                            flex:           1,
                            minWidth:       0,
                            display:        "flex",
                            flexDirection:  "column",
                            justifyContent: "space-between",
                          }}
                        >
                          {/* Brand / name / size */}
                          <div>
                            <p
                              className="font-body font-medium uppercase"
                              style={{
                                fontSize:      9,
                                letterSpacing: "0.18em",
                                color:         "#B8B4AC",
                                marginBottom:  2,
                              }}
                            >
                              {item.product.brand}
                            </p>
                            <p
                              className="font-body font-medium"
                              style={{
                                fontSize:     13,
                                color:        "#0A0A0A",
                                letterSpacing:"0.02em",
                                marginBottom: 4,
                                overflow:     "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace:   "nowrap",
                              }}
                            >
                              {item.product.name}
                            </p>
                            <p
                              className="font-body"
                              style={{
                                fontSize:      11,
                                color:         "#5A5850",
                                letterSpacing: "0.04em",
                              }}
                            >
                              EU {item.selectedSize} / US {usSize}
                            </p>
                          </div>

                          {/* Qty + price + remove */}
                          <div
                            style={{
                              display:        "flex",
                              alignItems:     "center",
                              justifyContent: "space-between",
                              marginTop:      12,
                            }}
                          >
                            {/* Quantity stepper */}
                            <div
                              style={{
                                display:    "flex",
                                alignItems: "center",
                                border:     "1px solid #B8B4AC",
                                height:     32,
                              }}
                            >
                              <StepBtn
                                label="Reducir cantidad"
                                onClick={() =>
                                  updateQuantity(
                                    item.product.id,
                                    item.selectedSize,
                                    item.quantity - 1,
                                  )
                                }
                              >
                                −
                              </StepBtn>

                              <span
                                className="font-body"
                                style={{
                                  width:          28,
                                  height:         "100%",
                                  display:        "flex",
                                  alignItems:     "center",
                                  justifyContent: "center",
                                  fontSize:       12,
                                  color:          "#0A0A0A",
                                  borderLeft:     "1px solid #B8B4AC",
                                  borderRight:    "1px solid #B8B4AC",
                                }}
                              >
                                {item.quantity}
                              </span>

                              <StepBtn
                                label="Aumentar cantidad"
                                onClick={() =>
                                  updateQuantity(
                                    item.product.id,
                                    item.selectedSize,
                                    item.quantity + 1,
                                  )
                                }
                              >
                                +
                              </StepBtn>
                            </div>

                            {/* Price + remove */}
                            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                              <span
                                className="font-body font-bold"
                                style={{ fontSize: 14, color: "#0A0A0A" }}
                              >
                                {formatPrice(lineTotal)}
                              </span>

                              <button
                                onClick={() =>
                                  removeItem(item.product.id, item.selectedSize)
                                }
                                aria-label={`Eliminar ${item.product.brand} ${item.product.name}`}
                                style={{
                                  background: "none",
                                  border:     "none",
                                  cursor:     "pointer",
                                  padding:    4,
                                  color:      "#B8B4AC",
                                  display:    "flex",
                                  alignItems: "center",
                                  transition: "color 150ms ease-out",
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.color = "#0A0A0A")}
                                onMouseLeave={(e) => (e.currentTarget.style.color = "#B8B4AC")}
                              >
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                                  <line x1="1" y1="1" x2="13" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                  <line x1="13" y1="1" x2="1"  y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* ── Sticky footer (only when items exist) ───────────────── */}
            {items.length > 0 && (
              <div
                style={{
                  flexShrink: 0,
                  borderTop:  "1px solid #B8B4AC",
                  padding:    "20px 24px 28px",
                  background: "#E8E6E1",
                }}
              >
                {/* Subtotal row */}
                <div
                  style={{
                    display:        "flex",
                    justifyContent: "space-between",
                    alignItems:     "baseline",
                    marginBottom:   6,
                  }}
                >
                  <span
                    className="font-body font-medium uppercase"
                    style={{
                      fontSize:      11,
                      letterSpacing: "0.18em",
                      color:         "#5A5850",
                    }}
                  >
                    Subtotal
                  </span>
                  <span
                    className="font-body font-bold"
                    style={{ fontSize: 22, color: "#0A0A0A" }}
                  >
                    {formatPrice(totalPrice)}
                  </span>
                </div>

                {/* Shipping note */}
                <p
                  className="font-body"
                  style={{
                    fontSize:      11,
                    color:         "#B8B4AC",
                    letterSpacing: "0.04em",
                    marginBottom:  20,
                  }}
                >
                  Envío calculado al finalizar la compra
                </p>

                {/* CTA button */}
                <button
                  className="font-body font-medium uppercase"
                  style={{
                    width:         "100%",
                    height:        56,
                    background:    "#0A0A0A",
                    color:         "#E8E6E1",
                    border:        "none",
                    cursor:        "pointer",
                    fontSize:      12,
                    letterSpacing: "0.16em",
                    transition:    "opacity 200ms ease-out, transform 100ms ease-out",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.82")}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity   = "1";
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                  onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
                  onMouseUp={(e)   => (e.currentTarget.style.transform = "scale(1)")}
                >
                  Finalizar Compra
                </button>

                {/* Demo disclaimer */}
                <p
                  className="font-body"
                  style={{
                    fontSize:      10,
                    color:         "#B8B4AC",
                    letterSpacing: "0.06em",
                    textAlign:     "center",
                    marginTop:     12,
                    opacity:       0.8,
                  }}
                >
                  Demo — no se procesará ningún pago
                </p>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Internal: quantity stepper button ───────────────────────────────────────
function StepBtn({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode;
  label:    string;
  onClick:  () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      style={{
        width:          32,
        height:         32,
        background:     "none",
        border:         "none",
        cursor:         "pointer",
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        color:          "#0A0A0A",
        fontSize:       17,
        lineHeight:     1,
        transition:     "background 120ms ease-out",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#D4D0C8")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
    >
      {children}
    </button>
  );
}
