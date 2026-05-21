import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { CartProvider } from "@/context/CartContext";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";

// Act 1 uses WebGL (Three.js Canvas) — must be client-only, no SSR
const Act1LaX        = dynamic(() => import("./Act1LaX"),        {
  ssr: false,
  loading: () => <div style={{ height: "175dvh", background: "#0A0A0A" }} />,
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
    <CartProvider>
      <Nav />

      <main>
        {/* Act 1 — loads eagerly (above fold, sets first impression) */}
        <Act1LaX />

        {/* Acts 2–5 — lazy loaded below the fold */}
        <Act2Espacio />
        <Act3ParaTodxs />
        <Act4Marcas />
        <Act5CostaRica />
      </main>

      <Footer />
    </CartProvider>
  );
}
