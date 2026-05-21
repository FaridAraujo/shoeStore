"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";

const Act2Espacio   = dynamic(() => import("./Act2Espacio"),   { ssr: false });
const Act3ParaTodxs = dynamic(() => import("./Act3ParaTodxs"), { ssr: false });
const Act4Marcas    = dynamic(() => import("./Act4Marcas"),    { ssr: false });
const Act5CostaRica = dynamic(() => import("./Act5CostaRica"), { ssr: false });
const AboutContent  = dynamic(() => import("./AboutContent"),  { ssr: false });

/**
 * Monta Acts 2-5 y AboutContent solo cuando el usuario se acerca scrolleando.
 * Evita que los bundles se descarguen hasta que sean necesarios.
 */
export default function AboutLazyActs() {
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMounted(true);
          obs.disconnect();
        }
      },
      { rootMargin: "600px" },
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref}>
      {mounted ? (
        <>
          <Act2Espacio />
          <Act3ParaTodxs />
          <Act4Marcas />
          <Act5CostaRica />
          <AboutContent />
        </>
      ) : (
        <div style={{ minHeight: "300vh", background: "#E8E6E1" }} />
      )}
    </div>
  );
}
