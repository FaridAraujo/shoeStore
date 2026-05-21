import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import FeaturedDrop from "@/components/sections/FeaturedDrop";
import Collection from "@/components/sections/Collection";
import Sucursales from "@/components/sections/Sucursales";

/*
  Nav is fixed-position, so it sits above the scroll flow.
  Hero renders the pinned video section + the concrete transition zone.
  CartProvider lives in the root layout.
*/
export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <FeaturedDrop />
      <Collection />
      <Sucursales />
      <Footer />
    </>
  );
}
