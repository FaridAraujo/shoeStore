import type { Metadata } from "next";
import { CartProvider } from "@/context/CartContext";
import { CollectionSearchProvider } from "@/context/CollectionSearchContext";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import Collection from "@/components/sections/Collection";
import { BRANDS, type BrandFilter } from "@/lib/products";

export const metadata: Metadata = {
  title: "Colección",
  description: "Todos los pares disponibles en SNEAX. Nike, Jordan, Adidas, ASICS, New Balance y más.",
};

export default function CollectionPage({
  searchParams,
}: {
  searchParams: { brand?: string };
}) {
  // Validate brand param against our enum so we never pass garbage to the component
  const raw   = searchParams?.brand?.toUpperCase() as BrandFilter | undefined;
  const brand = raw && (BRANDS as readonly string[]).includes(raw) ? raw : undefined;

  return (
    <CollectionSearchProvider>
      <CartProvider>
        <Nav />
        <main data-nav-theme="light" style={{ paddingTop: 72 }}>
          <Collection initialBrand={brand} />
        </main>
        <Footer />
      </CartProvider>
    </CollectionSearchProvider>
  );
}
