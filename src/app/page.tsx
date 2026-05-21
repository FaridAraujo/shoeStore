import { CartProvider } from "@/context/CartContext";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import FeaturedDrop from "@/components/sections/FeaturedDrop";
import Collection from "@/components/sections/Collection";
import Sucursales from "@/components/sections/Sucursales";

/*
  Page composition:
  CartProvider wraps everything so Nav (cart badge + toggle) and any future
  section that calls useCart() can access the store without prop drilling.

  Nav is fixed-position, so it sits above the scroll flow.
  Hero renders the pinned video section + the concrete transition zone.
*/
export default function Home() {
  return (
    <CartProvider>
      <Nav />
      <Hero />
      <FeaturedDrop />
      <Collection />
      <Sucursales />
      <Footer />
    </CartProvider>
  );
}
