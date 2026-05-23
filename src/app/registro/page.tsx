"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

// ─── Field ────────────────────────────────────────────────────────────────────

function Field({
  label,
  type = "text",
  value,
  onChange,
  error,
  autoComplete,
  hint,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  autoComplete?: string;
  hint?: string;
}) {
  const [focused, setFocused] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const isPassword = type === "password";
  const inputType  = isPassword && showPwd ? "text" : type;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
      <label
        className="font-body font-medium uppercase"
        style={{ fontSize: 10, letterSpacing: "0.24em", color: focused ? "#0A0A0A" : "#8A8680", transition: "color 150ms ease" }}
      >
        {label}
      </label>

      <div style={{ position: "relative" }}>
        <input
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          autoComplete={autoComplete}
          className="font-body"
          style={{
            width:        "100%",
            height:       50,
            padding:      isPassword ? "0 56px 0 0" : "0",
            background:   "transparent",
            border:       "none",
            borderBottom: `1px solid ${error ? "#C0392B" : focused ? "#0A0A0A" : "#C8C4BC"}`,
            borderRadius: 0,
            outline:      "none",
            fontSize:     15,
            color:        "#0A0A0A",
            transition:   "border-color 180ms ease",
            boxSizing:    "border-box",
          }}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPwd((v) => !v)}
            tabIndex={-1}
            style={{
              position:      "absolute",
              right:         0,
              top:           "50%",
              transform:     "translateY(-50%)",
              background:    "none",
              border:        "none",
              cursor:        "pointer",
              padding:       0,
              color:         "#B8B4AC",
              fontSize:      10,
              letterSpacing: "0.1em",
              fontFamily:    "var(--font-dm-sans, sans-serif)",
              fontWeight:    500,
            }}
            aria-label={showPwd ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            {showPwd ? "OCULTAR" : "VER"}
          </button>
        )}
      </div>

      {error && (
        <span className="font-body" style={{ fontSize: 11, color: "#C0392B", letterSpacing: "0.03em" }}>
          {error}
        </span>
      )}
      {!error && hint && (
        <span className="font-body" style={{ fontSize: 11, color: "#B8B4AC", letterSpacing: "0.03em" }}>
          {hint}
        </span>
      )}
    </div>
  );
}

// ─── Spinner ──────────────────────────────────────────────────────────────────

function Spinner() {
  return (
    <span style={{
      display: "inline-block", width: 13, height: 13,
      border: "1.5px solid rgba(10,10,10,0.2)", borderTopColor: "#0A0A0A",
      borderRadius: "50%", animation: "sneax-spin 0.65s linear infinite",
    }} />
  );
}

// ─── Password strength ────────────────────────────────────────────────────────

function strength(pwd: string): 0 | 1 | 2 | 3 {
  if (!pwd) return 0;
  let s = 0;
  if (pwd.length >= 8)             s++;
  if (/[A-Z]/.test(pwd))           s++;
  if (/[0-9!@#$%^&*]/.test(pwd))  s++;
  return s as 0 | 1 | 2 | 3;
}

const S_LABELS: Record<1|2|3, string> = { 1: "Débil", 2: "Regular", 3: "Fuerte" };
const S_COLORS: Record<1|2|3, string> = { 1: "#C0392B", 2: "#E67E22", 3: "#27AE60" };

function PasswordStrength({ pwd }: { pwd: string }) {
  const s = strength(pwd);
  if (!pwd) return null;
  const color = S_COLORS[s as 1|2|3] ?? "#B8B4AC";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5, marginTop: -2 }}>
      <div style={{ display: "flex", gap: 4 }}>
        {([1,2,3] as const).map((tier) => (
          <div key={tier} style={{
            flex: 1, height: 2, borderRadius: 1,
            background: s >= tier ? color : "rgba(10,10,10,0.1)",
            transition: "background 220ms ease",
          }} />
        ))}
      </div>
      <span className="font-body" style={{ fontSize: 10, color, letterSpacing: "0.08em" }}>
        {S_LABELS[s as 1|2|3]}
      </span>
    </div>
  );
}

// ─── Left panel ───────────────────────────────────────────────────────────────

function LeftPanel() {
  return (
    <motion.div
      initial={{ x: -40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
      style={{
        flex:           "0 0 46%",
        background:     "#0A0A0A",
        display:        "flex",
        flexDirection:  "column",
        justifyContent: "space-between",
        padding:        "clamp(2rem, 3.5vw, 3rem)",
        position:       "relative",
        overflow:       "hidden",
        minHeight:      "100%",
        gap:            "clamp(2rem, 4vh, 3.5rem)",
      }}
    >
      {/* Wordmark → home */}
      <Link
        href="/"
        className="font-display"
        style={{ fontSize: 22, letterSpacing: "0.08em", color: "#F0EDE8", textDecoration: "none" }}
      >
        SNEAX
      </Link>

      {/* Editorial text */}
      <div>
        <p
          className="font-body uppercase"
          style={{ fontSize: 11, letterSpacing: "0.28em", color: "rgba(240,237,232,0.3)", marginBottom: "1.5rem" }}
        >
          Nueva cuenta
        </p>
        <h2
          className="font-display"
          style={{ fontSize: "clamp(3rem, 4.5vw, 5rem)", lineHeight: 0.9, letterSpacing: "-0.01em", color: "#F0EDE8" }}
        >
          ÚNETE<br />
          A LA<br />
          <span style={{ color: "#F2BF1A" }}>CULTURA</span><br />
          SNEAX.
        </h2>
      </div>

      {/* Bottom */}
      <div>
        <div style={{ height: 1, background: "rgba(240,237,232,0.1)", marginBottom: 16 }} />
        <p
          className="font-body"
          style={{ fontSize: 12, color: "rgba(240,237,232,0.3)", letterSpacing: "0.06em", lineHeight: 1.6 }}
        >
          Drops exclusivos. Precios directos.<br />
          Sin pretensiones. Para todxs.
        </p>
      </div>

      {/* Decorative bg text */}
      <span
        className="font-display"
        aria-hidden="true"
        style={{
          position: "absolute", bottom: "-0.15em", right: "-0.05em",
          fontSize: "clamp(10rem, 18vw, 18rem)", lineHeight: 1,
          letterSpacing: "-0.04em", color: "rgba(240,237,232,0.03)",
          userSelect: "none", pointerEvents: "none",
        }}
      >
        SX
      </span>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const ITEM = {
  hidden:  { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.23, 1, 0.32, 1] } },
};

function RegistroPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [nombre,     setNombre]     = useState("");
  const [email,      setEmail]      = useState("");
  const [password,   setPassword]   = useState("");
  const [confirm,    setConfirm]    = useState("");
  const [errors,     setErrors]     = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  function validate() {
    const next: Record<string, string> = {};
    if (!nombre.trim())  next.nombre = "Ingresá tu nombre completo.";
    if (!email.trim())   next.email  = "Ingresá tu correo electrónico.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Correo inválido.";
    if (!password)       next.password = "Ingresá una contraseña.";
    else if (password.length < 8) next.password = "Mínimo 8 caracteres.";
    if (!confirm)        next.confirm = "Confirmá tu contraseña.";
    else if (confirm !== password) next.confirm = "Las contraseñas no coinciden.";
    return next;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next = validate();
    if (Object.keys(next).length > 0) { setErrors(next); return; }
    setErrors({});
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 700));
    login({ name: nombre, email });
    router.push("/cuenta");
  }

  function clear(field: string) {
    setErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });
  }

  return (
    <div
      data-nav-theme="light"
      style={{ minHeight: "100svh", display: "flex", background: "#F0EDE8" }}
    >
      {/* ── Left panel ───────────────────────────────────────────────── */}
      <div style={{ flex: "0 0 46%", display: "flex" }} className="hidden-mobile">
        <LeftPanel />
      </div>

      {/* ── Right form panel ─────────────────────────────────────────── */}
      <div
        style={{
          flex:      1,
          display:   "flex",
          alignItems: "center",
          padding:   "clamp(2rem, 4vw, 3rem) clamp(2.5rem, 5vw, 4rem)",
          overflowY: "auto",
          minWidth:  0,
        }}
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } } }}
          style={{ width: "100%", maxWidth: 400, display: "flex", flexDirection: "column", gap: 22 }}
        >
          {/* Back link */}
          <motion.div variants={ITEM}>
            <Link
              href="/"
              className="font-body font-medium uppercase"
              style={{ fontSize: 10, letterSpacing: "0.2em", color: "#B8B4AC", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, transition: "color 150ms ease" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#0A0A0A")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#B8B4AC")}
            >
              ← Inicio
            </Link>
          </motion.div>

          {/* Heading */}
          <motion.div variants={ITEM} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <h1
              className="font-display"
              style={{ fontSize: 52, lineHeight: 0.9, letterSpacing: "0.01em", color: "#0A0A0A" }}
            >
              REGISTRATE
            </h1>
            <p className="font-body" style={{ fontSize: 13, color: "#8A8680" }}>
              Creá tu cuenta SNEAX
            </p>
          </motion.div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            noValidate
            style={{ display: "flex", flexDirection: "column", gap: 18 }}
          >
            <motion.div variants={ITEM}>
              <Field
                label="Nombre completo"
                value={nombre}
                onChange={(v) => { setNombre(v); clear("nombre"); }}
                error={errors.nombre}
                autoComplete="name"
              />
            </motion.div>

            <motion.div variants={ITEM}>
              <Field
                label="Correo electrónico"
                type="email"
                value={email}
                onChange={(v) => { setEmail(v); clear("email"); }}
                error={errors.email}
                autoComplete="email"
              />
            </motion.div>

            <motion.div variants={ITEM} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <Field
                label="Contraseña"
                type="password"
                value={password}
                onChange={(v) => { setPassword(v); clear("password"); }}
                error={errors.password}
                autoComplete="new-password"
                hint="Mínimo 8 caracteres"
              />
              <PasswordStrength pwd={password} />
            </motion.div>

            <motion.div variants={ITEM}>
              <Field
                label="Confirmar contraseña"
                type="password"
                value={confirm}
                onChange={(v) => { setConfirm(v); clear("confirm"); }}
                error={errors.confirm}
                autoComplete="new-password"
              />
            </motion.div>

            {/* Submit */}
            <motion.div variants={ITEM}>
              <button
                type="submit"
                disabled={submitting}
                className="font-display"
                style={{
                  width:          "100%",
                  height:         54,
                  background:     submitting ? "#3A3A3A" : "#0A0A0A",
                  color:          submitting ? "#888" : "#F0EDE8",
                  border:         "none",
                  fontSize:       20,
                  letterSpacing:  "0.2em",
                  cursor:         submitting ? "default" : "pointer",
                  transition:     "background 160ms ease, color 160ms ease",
                  display:        "flex",
                  alignItems:     "center",
                  justifyContent: "center",
                  gap:            10,
                  marginTop:      4,
                }}
                onMouseEnter={(e) => {
                  if (submitting) return;
                  (e.currentTarget as HTMLButtonElement).style.background = "#F2BF1A";
                  (e.currentTarget as HTMLButtonElement).style.color      = "#0A0A0A";
                }}
                onMouseLeave={(e) => {
                  if (submitting) return;
                  (e.currentTarget as HTMLButtonElement).style.background = "#0A0A0A";
                  (e.currentTarget as HTMLButtonElement).style.color      = "#F0EDE8";
                }}
              >
                {submitting ? <><Spinner /> CREANDO CUENTA</> : "CREAR CUENTA"}
              </button>
            </motion.div>
          </form>

          {/* Footer note */}
          <motion.p
            variants={ITEM}
            className="font-body"
            style={{ fontSize: 13, color: "#8A8680" }}
          >
            ¿Ya tenés cuenta?{" "}
            <Link href="/login" style={{ color: "#0A0A0A", textDecoration: "underline", textUnderlineOffset: 3 }}>
              Iniciá sesión
            </Link>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}

export default function Page() {
  return <RegistroPage />;
}
