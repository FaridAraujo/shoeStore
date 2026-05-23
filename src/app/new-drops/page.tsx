import type { Metadata } from "next";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import Collection from "@/components/sections/Collection";

export const metadata: Metadata = {
  title: "Nuevos Lanzamientos",
  description: "Los drops más recientes en SNEAX. Collabs exclusivos y ediciones limitadas.",
};

export default function NewDropsPage() {
  return (
    <>
      <Nav />
      <main data-nav-theme="dark-glass" style={{ paddingTop: 72, background: "#0A0A0A", minHeight: "100svh" }}>
        <Collection newDropsOnly />
      </main>
      <Footer />
    </>
  );
}
