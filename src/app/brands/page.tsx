import type { Metadata } from "next";
import { CartProvider } from "@/context/CartContext";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import BrandsGrid from "./BrandsGrid";

export const metadata: Metadata = {
  title: "Marcas",
  description: "Todas las marcas disponibles en SNEAX — Nike, Jordan, Adidas, ASICS, New Balance y más.",
};

export default function BrandsPage() {
  return (
    <CartProvider>
      <Nav />
      <main data-nav-theme="light" style={{ paddingTop: 72 }}>
        <BrandsGrid />
      </main>
      <Footer />
    </CartProvider>
  );
}
