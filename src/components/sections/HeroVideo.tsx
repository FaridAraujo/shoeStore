"use client";

import { useState, useRef, useEffect } from "react";

export default function HeroVideo() {
  const [failed, setFailed]   = useState(false);
  const videoRef              = useRef<HTMLVideoElement>(null);

  const handleError = () => {
    console.warn(
      "[HeroVideo] Video failed to load — check /public/videos/hero.mp4 exists and is H.264 MP4"
    );
    setFailed(true);
  };

  // Llamada manual a .play() — más confiable que el atributo autoPlay en iOS Safari.
  // El atributo puede ser ignorado si la página cargó en background, el usuario
  // volvió de otra pestaña, o la red fue lenta. .play() fuerza la reproducción.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    function tryPlay() {
      video!.play().catch(() => {
        // Silenciar — si el browser bloquea el autoplay no hay nada que hacer,
        // el video simplemente no se reproduce (no es un error crítico).
      });
    }

    // Intentar en cuanto el componente monta
    tryPlay();

    // Reintentar cuando el video tenga datos suficientes para reproducirse
    video.addEventListener("canplay", tryPlay);

    // Reintentar si la página vuelve al primer plano (ej. el usuario cambió de
    // pestaña y volvió — en iOS el video se pausa automáticamente al salir)
    function onVisibilityChange() {
      if (document.visibilityState === "visible") tryPlay();
    }
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      video.removeEventListener("canplay", tryPlay);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

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
      ref={videoRef}
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