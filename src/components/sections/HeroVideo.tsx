"use client";

import { useState } from "react";

export default function HeroVideo() {
  const [failed, setFailed] = useState(false);

  const handleError = () => {
    console.warn(
      "[HeroVideo] Video failed to load — check /public/videos/hero.mp4 exists and is H.264 MP4"
    );
    setFailed(true);
  };

  if (failed) return null;

  /*
    El video termina 48px antes del borde inferior del hero.
    Esa franja inferior queda completamente libre para:
    - el bottom gradient
    - el bottom solid
    - la transición al concrete background

    Así evitamos cualquier video bleed / seam en el cambio
    hacia la siguiente sección.
  */

  return (
    <video
      autoPlay
      muted
      loop
      playsInline
      onError={handleError}
      className="absolute top-0 left-0 w-full object-cover z-0 hero-video"
      style={{
        height: "calc(100% - 46px)",
      }}
      aria-hidden="true"
    >
      <source
        src="/videos/hero.mp4"
        type="video/mp4"
        onError={handleError}
      />
    </video>
  );
}