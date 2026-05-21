"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

// ─── Info tooltip ─────────────────────────────────────────────────────────────

function InfoTooltip() {
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{ position: "relative", display: "inline-flex" }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* Icon */}
      <svg
        width="13" height="13" viewBox="0 0 16 16" fill="none"
        style={{ color: open ? "rgba(240,237,232,0.6)" : "rgba(240,237,232,0.2)", cursor: "default", transition: "color 150ms ease" }}
      >
        <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.2" />
        <line x1="8" y1="7" x2="8" y2="11.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <circle cx="8" cy="4.8" r="0.8" fill="currentColor" />
      </svg>

      {/* Popover */}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 4, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
          style={{
            position:    "absolute",
            top:         "calc(100% + 8px)",
            left:        "50%",
            transform:   "translateX(-50%)",
            transformOrigin: "top center",
            zIndex:      40,
            background:  "#1C1C1C",
            border:      "1px solid rgba(240,237,232,0.1)",
            borderRadius: 3,
            padding:     "14px 16px",
            minWidth:    200,
            boxShadow:   "0 8px 24px rgba(0,0,0,0.4)",
            pointerEvents: "none",
          }}
        >
          {/* Arrow */}
          <div style={{
            position: "absolute", top: -5, left: "50%", transform: "translateX(-50%)",
            width: 8, height: 8, background: "#1C1C1C",
            border: "1px solid rgba(240,237,232,0.1)",
            borderBottom: "none", borderRight: "none",
            rotate: "45deg",
          }} />

          <p className="font-body font-medium uppercase" style={{ fontSize: 9, letterSpacing: "0.24em", color: "rgba(240,237,232,0.3)", marginBottom: 10 }}>
            Detalles de cuenta
          </p>
          {[
            { label: "País",          value: "Costa Rica" },
            { label: "Miembro desde", value: "Mayo 2026"  },
          ].map(({ label, value }) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", gap: 16, padding: "5px 0", borderBottom: "1px solid rgba(240,237,232,0.05)" }}>
              <span className="font-body" style={{ fontSize: 11, color: "rgba(240,237,232,0.3)" }}>{label}</span>
              <span className="font-body" style={{ fontSize: 11, color: "#F0EDE8" }}>{value}</span>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

function Section({ title, children, extra }: { title: string; children: React.ReactNode; extra?: React.ReactNode }) {
  return (
    <div style={{ borderTop: "1px solid rgba(240,237,232,0.08)", paddingTop: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <p className="font-body font-medium uppercase" style={{ fontSize: 9, letterSpacing: "0.28em", color: "rgba(240,237,232,0.3)" }}>
          {title}
        </p>
        {extra}
      </div>
      {children}
    </div>
  );
}

// ─── Row ──────────────────────────────────────────────────────────────────────

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "9px 0", borderBottom: "1px solid rgba(240,237,232,0.06)", gap: 16 }}>
      <span className="font-body" style={{ fontSize: 12, color: "rgba(240,237,232,0.35)", flexShrink: 0 }}>
        {label}
      </span>
      <span className="font-body" style={{ fontSize: 13, color: "#F0EDE8", textAlign: "right" }}>
        {value}
      </span>
    </div>
  );
}

// ─── Toggle ───────────────────────────────────────────────────────────────────

function Toggle({ label, description, checked, onChange }: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "11px 0", borderBottom: "1px solid rgba(240,237,232,0.06)", gap: 24 }}>
      <div>
        <p className="font-body" style={{ fontSize: 13, color: "#F0EDE8", marginBottom: 3 }}>{label}</p>
        <p className="font-body" style={{ fontSize: 11, color: "rgba(240,237,232,0.35)", letterSpacing: "0.02em" }}>{description}</p>
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        style={{
          flexShrink: 0, width: 40, height: 22, borderRadius: 11,
          background: checked ? "#F2BF1A" : "rgba(240,237,232,0.15)",
          border: "none", cursor: "pointer", position: "relative",
          transition: "background 200ms ease",
        }}
      >
        <span style={{
          position: "absolute", top: 3, left: checked ? 21 : 3,
          width: 16, height: 16, borderRadius: "50%",
          background: checked ? "#0A0A0A" : "rgba(240,237,232,0.6)",
          transition: "left 200ms cubic-bezier(0.23,1,0.32,1)",
        }} />
      </button>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function CuentaPage() {
  const router        = useRouter();
  const { user, logout } = useAuth();

  const [drops,  setDrops]  = useState(true);
  const [promos, setPromos] = useState(false);
  const [talla,  setTalla]  = useState(false);

  useEffect(() => {
    if (!user) router.replace("/login");
  }, [user, router]);

  if (!user) return null;

  const ITEM = {
    hidden:  { opacity: 0, y: 14 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.42, ease: [0.23, 1, 0.32, 1] } },
  };

  return (
    <main
      style={{
        minHeight:      "100dvh",
        background:     "#0A0A0A",
        display:        "flex",
        flexDirection:  "column",
        padding:        "clamp(2.5rem, 5vw, 4rem) clamp(1.25rem, 4vw, 3rem)",
      }}
    >
      <div style={{ maxWidth: 560, width: "100%", margin: "0 auto", flex: 1, display: "flex", flexDirection: "column" }}>

        {/* ── Top bar ─────────────────────────────────────────────────── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "clamp(2.5rem, 5vw, 4rem)" }}>
          <span
            className="font-display"
            style={{ fontSize: 20, letterSpacing: "0.1em", color: "#F0EDE8" }}
          >
            MI CUENTA
          </span>
          <Link
            href="/"
            className="font-body font-medium uppercase"
            style={{ fontSize: 10, letterSpacing: "0.2em", color: "rgba(240,237,232,0.35)", textDecoration: "none", transition: "color 150ms ease" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#F0EDE8")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(240,237,232,0.35)")}
          >
            ← Inicio
          </Link>
        </div>


        {/* ── Content ─────────────────────────────────────────────────── */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.07, delayChildren: 0.12 } } }}
          style={{ display: "flex", flexDirection: "column", gap: 28, flex: 1 }}
        >
          <motion.div variants={ITEM}>
            <Section title="Datos personales" extra={<InfoTooltip />}>
              <Row label="Nombre"             value={user.name}   />
              <Row label="Correo electrónico" value={user.email}  />
            </Section>
          </motion.div>

          <motion.div variants={ITEM}>
            <Section title="Preferencias">
              <Toggle label="Notificaciones de drops"      description="Alertas de nuevos lanzamientos"           checked={drops}  onChange={setDrops}  />
              <Toggle label="Promociones y descuentos"     description="Ofertas exclusivas para miembros"         checked={promos} onChange={setPromos} />
              <Toggle label="Recordatorio de talla"        description="Guardá tu talla para agilizar el checkout" checked={talla}  onChange={setTalla}  />
            </Section>
          </motion.div>

          <motion.div variants={ITEM}>
            <Section title="Historial de pedidos">
              <div style={{ padding: "14px 0 6px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <p className="font-body" style={{ fontSize: 13, color: "rgba(240,237,232,0.3)" }}>
                  No hay pedidos registrados aún.
                </p>
                <Link
                  href="/collection"
                  className="font-body font-medium uppercase"
                  style={{ fontSize: 10, letterSpacing: "0.18em", color: "rgba(240,237,232,0.4)", textDecoration: "none", whiteSpace: "nowrap", transition: "color 150ms ease" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#F0EDE8")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(240,237,232,0.4)")}
                >
                  Ver colección →
                </Link>
              </div>
            </Section>
          </motion.div>

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Cerrar sesión */}
          <motion.div variants={ITEM} style={{ paddingTop: 8 }}>
            <button
              onClick={() => { logout(); router.push("/"); }}
              className="font-body font-medium uppercase"
              style={{
                width: "100%", height: 46,
                background: "transparent",
                border: "1px solid rgba(240,237,232,0.12)",
                borderRadius: 2,
                fontSize: 11, letterSpacing: "0.2em",
                color: "rgba(240,237,232,0.3)",
                cursor: "pointer",
                transition: "border-color 150ms ease, color 150ms ease",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(192,57,43,0.6)"; (e.currentTarget as HTMLButtonElement).style.color = "#C0392B"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(240,237,232,0.12)"; (e.currentTarget as HTMLButtonElement).style.color = "rgba(240,237,232,0.3)"; }}
            >
              Cerrar sesión
            </button>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}

export default function Page() {
  return <CuentaPage />;
}
