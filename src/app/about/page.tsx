import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import ScrollReset from "./ScrollReset";

// Act 1 uses WebGL (Three.js Canvas) — must be client-only, no SSR
const Act1LaX        = dynamic(() => import("./Act1LaX"),        {
  ssr: false,
  loading: () => (
    <div
      style={{
        height: "175dvh",
        background: "#0A0A0A",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingTop: "35dvh",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-bebas-neue, serif)",
          fontSize: "clamp(4rem, 12vw, 9rem)",
          letterSpacing: "-0.03em",
          color: "rgba(240,237,232,0.07)",
          userSelect: "none",
          lineHeight: 1,
        }}
      >
        SNEAX
      </span>
    </div>
  ),
});
const Act2Espacio    = dynamic(() => import("./Act2Espacio"),    { ssr: false });
const Act3ParaTodxs  = dynamic(() => import("./Act3ParaTodxs"),  { ssr: false });
const Act4Marcas     = dynamic(() => import("./Act4Marcas"),     { ssr: false });
const Act5CostaRica  = dynamic(() => import("./Act5CostaRica"),  { ssr: false });

export const metadata: Metadata = {
  title: "Nosotros",
  description: "SNEAX — La tienda de sneakers premium de Costa Rica. 5 tiendas, cultura auténtica.",
};

export default function AboutPage() {
  return (
    <>
      <Nav />

      <main>
        <ScrollReset />
        <Act1LaX />
        <Act2Espacio />
        <Act3ParaTodxs />
        <Act4Marcas />
        <Act5CostaRica />
      </main>

      <Footer />
    </>
  );
}
