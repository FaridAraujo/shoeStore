"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/products";
import type { CartItem } from "@/types";

// ─── Inner page — needs cart context ─────────────────────────────────────────

function ConfirmationPage() {
  const { items, totalPrice, clearCart } = useCart();

  // Save cart snapshot FIRST on mount, then clear.
  // Using a ref so the effect only fires once even in StrictMode double-invoke.
  const cleared = useRef(false);
  const [savedItems, setSavedItems]   = useState<CartItem[]>([]);
  const [savedTotal, setSavedTotal]   = useState(0);
  const [visible, setVisible]         = useState(false);

  useEffect(() => {
    if (cleared.current) return;
    cleared.current = true;

    // 1. Snapshot cart state
    setSavedItems(items);
    setSavedTotal(totalPrice);

    // 2. Clear the cart
    clearCart();

    // 3. Trigger entrance animation
    requestAnimationFrame(() => setVisible(true));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hasItems = savedItems.length > 0;

  const orderNumber = useRef(
    `SNX-${Math.floor(100000 + Math.random() * 900000)}`
  ).current;

  return (
    <main
      data-nav-theme="dark"
      style={{
        minHeight: "100dvh",
        background: "#0A0A0A",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(5rem, 10vw, 8rem) clamp(1.25rem, 4vw, 2rem) clamp(3rem, 6vw, 5rem)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 520,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 0,
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(24px)",
          transition: "opacity 0.55s cubic-bezier(0.23,1,0.32,1), transform 0.55s cubic-bezier(0.23,1,0.32,1)",
        }}
      >
        {/* ── Wordmark ────────────────────────────────────────────────── */}
        <Link
          href="/"
          className="font-display"
          style={{ fontSize: 20, letterSpacing: "0.1em", color: "rgba(240,237,232,0.25)", textDecoration: "none", marginBottom: 16, transition: "color 150ms ease" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#F0EDE8")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(240,237,232,0.25)")}
        >
          SNEAX
        </Link>

        {/* ── Brand mark ──────────────────────────────────────────────── */}
        <div
          style={{
            width: 80,
            height: 80,
            marginBottom: 28,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CheckMark />
        </div>

        {/* ── Headline ────────────────────────────────────────────────── */}
        <h1
          className="font-display"
          style={{
            fontSize: "clamp(4rem, 12vw, 6rem)",
            lineHeight: 0.88,
            letterSpacing: "0.02em",
            color: "#F0EDE8",
            textAlign: "center",
            marginBottom: 14,
          }}
        >
          ¡LISTO!
        </h1>

        <p
          className="font-body"
          style={{
            fontSize: 16,
            lineHeight: 1.55,
            color: "rgba(240,237,232,0.5)",
            textAlign: "center",
            letterSpacing: "0.02em",
            marginBottom: 8,
          }}
        >
          Tu pedido está en camino.
        </p>

        <p
          className="font-body font-medium uppercase"
          style={{
            fontSize: 10,
            letterSpacing: "0.22em",
            color: "rgba(240,237,232,0.25)",
            marginBottom: 40,
          }}
        >
          {orderNumber}
        </p>

        {/* ── Order summary card ─────────────────────────────────────── */}
        <div
          style={{
            width: "100%",
            background: "#1C1C1C",
            borderRadius: 4,
            overflow: "hidden",
            marginBottom: 32,
          }}
        >
          {/* Card header */}
          <div
            style={{
              padding: "16px 24px",
              borderBottom: "1px solid rgba(240,237,232,0.07)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              className="font-body font-medium uppercase"
              style={{ fontSize: 10, letterSpacing: "0.22em", color: "rgba(240,237,232,0.35)" }}
            >
              Resumen del pedido
            </span>
            <span
              className="font-body"
              style={{ fontSize: 11, color: "rgba(240,237,232,0.2)", letterSpacing: "0.06em" }}
            >
              Entrega estimada: 3–5 días hábiles
            </span>
          </div>

          {/* Items */}
          {hasItems ? (
            <div style={{ padding: "8px 0" }}>
              {savedItems.map((item, i) => (
                <div
                  key={`${item.product.id}-${item.selectedSize}`}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    padding: "12px 24px",
                    borderBottom:
                      i < savedItems.length - 1
                        ? "1px solid rgba(240,237,232,0.05)"
                        : "none",
                    gap: 16,
                  }}
                >
                  {/* Left: name + meta */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 3, flex: 1, minWidth: 0 }}>
                    <span
                      className="font-body font-medium uppercase"
                      style={{
                        fontSize: 9,
                        letterSpacing: "0.22em",
                        color: "rgba(240,237,232,0.3)",
                      }}
                    >
                      {item.product.brand}
                    </span>
                    <span
                      className="font-body"
                      style={{
                        fontSize: 13,
                        color: "#F0EDE8",
                        lineHeight: 1.35,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {item.product.name}
                    </span>
                    <span
                      className="font-body"
                      style={{ fontSize: 11, color: "rgba(240,237,232,0.3)" }}
                    >
                      Talla {item.selectedSize} · Cant. {item.quantity}
                    </span>
                  </div>

                  {/* Right: price */}
                  <span
                    className="font-body font-medium"
                    style={{
                      fontSize: 13,
                      color: "#F0EDE8",
                      whiteSpace: "nowrap",
                      paddingTop: 2,
                    }}
                  >
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                padding: "32px 24px",
                textAlign: "center",
                color: "rgba(240,237,232,0.2)",
                fontSize: 13,
              }}
              className="font-body"
            >
              No hay artículos registrados en este pedido.
            </div>
          )}

          {/* Total */}
          {hasItems && (
            <div
              style={{
                padding: "16px 24px",
                borderTop: "1px solid rgba(240,237,232,0.07)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span
                className="font-body font-medium uppercase"
                style={{ fontSize: 11, letterSpacing: "0.18em", color: "rgba(240,237,232,0.45)" }}
              >
                Total
              </span>
              <span
                className="font-display"
                style={{ fontSize: 22, color: "#F2BF1A", letterSpacing: "0.02em" }}
              >
                {formatPrice(savedTotal)}
              </span>
            </div>
          )}
        </div>

        {/* ── CTA ─────────────────────────────────────────────────────── */}
        <Link
          href="/"
          className="font-display"
          style={{
            fontSize: 18,
            letterSpacing: "0.16em",
            color: "#F0EDE8",
            border: "1px solid rgba(240,237,232,0.3)",
            padding: "14px 36px",
            textDecoration: "none",
            transition: "border-color 160ms ease, background 160ms ease, color 160ms ease",
            display: "inline-block",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.borderColor = "#F0EDE8";
            el.style.background  = "#F0EDE8";
            el.style.color       = "#0A0A0A";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.borderColor = "rgba(240,237,232,0.3)";
            el.style.background  = "transparent";
            el.style.color       = "#F0EDE8";
          }}
        >
          SEGUIR COMPRANDO →
        </Link>
      </div>
    </main>
  );
}

// ─── Accent checkmark ─────────────────────────────────────────────────────────

function CheckMark() {
  return (
    <svg
      width="80"
      height="80"
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Outer ring */}
      <circle cx="40" cy="40" r="38" stroke="#F2BF1A" strokeWidth="1.5" opacity="0.25" />
      {/* Inner solid circle */}
      <circle cx="40" cy="40" r="30" fill="#F2BF1A" fillOpacity="0.08" />
      {/* Checkmark */}
      <polyline
        points="24,40 35,52 56,28"
        stroke="#F2BF1A"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────

export default function Page() {
  return <ConfirmationPage />;
}
