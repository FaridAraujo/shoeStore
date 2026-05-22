"use client";

import { Suspense, useRef, useEffect, useMemo } from "react";
import { Canvas, useLoader, useFrame, useThree } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import * as THREE from "three";
import { gsap, ScrollTrigger } from "@/lib/gsap";

// ─── Coordinate system ────────────────────────────────────────────────────────
// All SVGs share viewBox "0 0 600 444" with transform translate(0,444) scale(0.1,-0.1)
// We map the 600-unit wide space → 9 world units, centering the logo at origin.
const WS = 9 / 600;      // world scale per SVG unit
const CX = 300 * WS;     // horizontal center offset
const CY = 222 * WS;     // vertical center offset (after Y flip)

// ─── Fly-out destinations ─────────────────────────────────────────────────────
// S leads, A trails — each letter gets its own dramatic trajectory
const FLY: [number, number, number][] = [
  [-13,  -2,  5],  // S → hard left + slightly down + toward camera
  [ -5,  13, -4],  // N → up-left, receding
  [  0,  16,  5],  // E → straight up, toward camera
  [  7,  13, -4],  // A → up-right, receding
];

// ─── Area of shape's axis-aligned bounding box (in SVG viewBox units²) ───────
function shapeArea(shape: THREE.Shape): number {
  const pts = shape.getPoints(8);
  if (pts.length < 3) return 0;
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const p of pts) {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  }
  return (maxX - minX) * (maxY - minY);
}

const MIN_AREA = 400;

// ─── Build ExtrudeGeometry ────────────────────────────────────────────────────
function buildGeom(
  svgData: { paths: THREE.ShapePath[] },
  depth = 5,
): THREE.BufferGeometry {
  const shapes: THREE.Shape[] = [];

  const collect = (path: THREE.ShapePath) => {
    SVGLoader.createShapes(path).forEach((s) => {
      if (shapeArea(s) > MIN_AREA) shapes.push(s);
    });
  };

  svgData.paths.forEach((path) => {
    if (path.color.r < 0.1 && path.color.g < 0.1 && path.color.b < 0.1) collect(path);
  });
  if (shapes.length === 0) svgData.paths.forEach(collect);

  const geom = new THREE.ExtrudeGeometry(shapes, {
    depth,
    bevelEnabled:   true,
    bevelThickness: 0.5,
    bevelSize:      0.25,
    bevelSegments:  3,
  });

  geom.scale(WS, -WS, WS);
  geom.translate(-CX, CY, 0);
  return geom;
}

// ─── Build X geometry centered at mesh origin ─────────────────────────────────
// Baking the visual center in lets scale() expand from the X's midpoint.
function buildXGeom(svgData: { paths: THREE.ShapePath[] }): {
  geom: THREE.BufferGeometry;
  startX: number;
  startY: number;
} {
  const geom = buildGeom(svgData, 8);
  geom.computeBoundingBox();
  const b  = geom.boundingBox!;
  const cx = (b.min.x + b.max.x) / 2;
  const cy = (b.min.y + b.max.y) / 2;
  geom.translate(-cx, -cy, 0);
  return { geom, startX: cx, startY: cy };
}

// ─── Easing helpers ───────────────────────────────────────────────────────────
function eio(x: number) {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

function lp(p: number, delay: number, end: number): number {
  return eio(Math.max(0, Math.min(1, (p - delay) / (end - delay))));
}

// ─── Inner Three.js scene ─────────────────────────────────────────────────────
function LogoScene({ progressRef }: { progressRef: { current: number } }) {
  const sSVG = useLoader(SVGLoader, "/images/Slogo.svg");
  const nSVG = useLoader(SVGLoader, "/images/Nlogo.svg");
  const eSVG = useLoader(SVGLoader, "/images/Elogo.svg");
  const aSVG = useLoader(SVGLoader, "/images/Alogo.svg");
  const xSVG = useLoader(SVGLoader, "/images/Xlogo.svg");

  const gS = useMemo(() => buildGeom(sSVG as { paths: THREE.ShapePath[] }), [sSVG]);
  const gN = useMemo(() => buildGeom(nSVG as { paths: THREE.ShapePath[] }), [nSVG]);
  const gE = useMemo(() => buildGeom(eSVG as { paths: THREE.ShapePath[] }), [eSVG]);
  const gA = useMemo(() => buildGeom(aSVG as { paths: THREE.ShapePath[] }), [aSVG]);

  const { geom: gX, startX: xStartX, startY: xStartY } = useMemo(
    () => buildXGeom(xSVG as { paths: THREE.ShapePath[] }),
    [xSVG],
  );

  const rS = useRef<THREE.Mesh>(null);
  const rN = useRef<THREE.Mesh>(null);
  const rE = useRef<THREE.Mesh>(null);
  const rA = useRef<THREE.Mesh>(null);
  const rX = useRef<THREE.Mesh>(null);

  const mS = useRef<THREE.MeshStandardMaterial>(null);
  const mN = useRef<THREE.MeshStandardMaterial>(null);
  const mE = useRef<THREE.MeshStandardMaterial>(null);
  const mA = useRef<THREE.MeshStandardMaterial>(null);

  useFrame(() => {
    const p = progressRef.current;

    const letters = [
      { r: rS.current, m: mS.current, f: FLY[0], t: lp(p, 0,    0.62) },
      { r: rN.current, m: mN.current, f: FLY[1], t: lp(p, 0.06, 0.66) },
      { r: rE.current, m: mE.current, f: FLY[2], t: lp(p, 0.12, 0.70) },
      { r: rA.current, m: mA.current, f: FLY[3], t: lp(p, 0.18, 0.75) },
    ];

    letters.forEach(({ r, m, f, t }) => {
      if (r) {
        r.position.set(f[0] * t, f[1] * t, f[2] * t);
        r.rotation.x =  t * 0.5;
        r.rotation.z = (f[0] > 0 ? 1 : -1) * t * 0.4;
      }
      if (m) m.opacity = Math.max(0, 1 - t * 1.8);
    });

    if (rX.current) {
      const xt = eio(Math.max(0, Math.min(1, (p - 0.18) / 0.72)));
      rX.current.position.x = xStartX * (1 - xt);
      rX.current.position.y = xStartY * (1 - xt);
      rX.current.position.z = xt * 1.8;
      rX.current.scale.setScalar(1 + xt * 1.6);
    }

  });

  const sharedMetal = { metalness: 0.95, roughness: 0.08, envMapIntensity: 1.6 };

  // El logo SNEAX mide ~9 u de ancho; en mobile portrait no cabe en pantalla,
  // así que se escala el grupo entero para que entre completo.
  const { size } = useThree();
  const groupScale =
    size.width > 768
      ? 1
      : Math.min(1, Math.max(0.3, (0.82 * 8.45 * (size.width / size.height)) / 9));

  return (
    <group scale={groupScale}>
      <mesh ref={rS} geometry={gS}>
        <meshStandardMaterial ref={mS} color="#B8B4AC" transparent {...sharedMetal} />
      </mesh>
      <mesh ref={rN} geometry={gN}>
        <meshStandardMaterial ref={mN} color="#B8B4AC" transparent {...sharedMetal} />
      </mesh>
      <mesh ref={rE} geometry={gE}>
        <meshStandardMaterial ref={mE} color="#B8B4AC" transparent {...sharedMetal} />
      </mesh>
      <mesh ref={rA} geometry={gA}>
        <meshStandardMaterial ref={mA} color="#B8B4AC" transparent {...sharedMetal} />
      </mesh>

      <mesh ref={rX} geometry={gX}>
        <meshStandardMaterial
          color="#1C1A16"
          metalness={0.98}
          roughness={0.05}
          envMapIntensity={2.2}
        />
      </mesh>
    </group>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────
export default function Act1LaX() {
  const trackRef    = useRef<HTMLDivElement>(null);
  const textRef     = useRef<HTMLParagraphElement>(null);
  const cueRef      = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);

  useEffect(() => {
    if (!trackRef.current || !textRef.current) return;

    const mm = gsap.matchMedia();

    // ── Mobile — scrub suave + snap lento: el usuario controla la animación
    //    con el scroll y al detenerse se autocompleta sin salto brusco.
    //    La sección es sticky → el snap mueve el scroll "por detrás" mientras
    //    la sección queda fija; el usuario solo ve la animación completarse.
    mm.add("(max-width: 768px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: trackRef.current,
          start:   "top top",
          end:     "bottom bottom",
          scrub:   0.5,
          snap: {
            snapTo:   (progress: number) => progress > 0.15 ? 1 : 0,
            duration: { min: 2.5, max: 4.0 },
            delay:    0.15,
            ease:     "power2.inOut",
          },
          onUpdate(self) {
            progressRef.current = self.progress;
          },
        },
      });

      // Texto aparece cuando la X queda sola — se mantiene visible (no desaparece)
      tl.fromTo(
        textRef.current,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, ease: "power2.out", duration: 0.12 },
        0.62,
      );
      // Indicador de scroll aparece casi al finalizar la animación
      if (cueRef.current) {
        tl.fromTo(
          cueRef.current,
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, ease: "power2.out", duration: 0.08 },
          0.88,
        );
      }
    });

    // ── Desktop — scrub + snap igual que mobile ───────────────────────────────
    mm.add("(min-width: 769px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: trackRef.current,
          start:   "top top",
          end:     "bottom bottom",
          scrub:   0.5,
          snap: {
            snapTo:   (progress: number) => progress > 0.15 ? 1 : 0,
            duration: { min: 2.5, max: 4.0 },
            delay:    0.15,
            ease:     "power2.inOut",
          },
          onUpdate(self) {
            progressRef.current = self.progress;
          },
        },
      });

      // "No es solo una X." — appears when X is alone and centered
      tl.fromTo(
        textRef.current,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, ease: "power2.out", duration: 0.18 },
        0.62,
      );
      tl.to(textRef.current, { opacity: 0, ease: "power1.in", duration: 0.10 }, 0.86);
    });

    return () => mm.revert();
  }, []);

  return (
    <div ref={trackRef} className="act1-track" style={{ height: "175dvh" }}>
      <section
        data-nav-theme="dark"
        style={{
          position:   "sticky",
          top:        0,
          height:     "100dvh",
          background: "#0A0A0A",
          overflow:   "hidden",
        }}
      >
        <Canvas
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
          camera={{ position: [0, 0.3, 11], fov: 42 }}
          gl={{ antialias: true, alpha: false }}
          dpr={[1, 2]}
        >
          <color attach="background" args={["#0A0A0A"]} />

          <ambientLight intensity={0.05} />
          <directionalLight color="#F2BF1A" intensity={4}   position={[ 4,  6,  5]} />
          <directionalLight color="#ffffff"  intensity={0.8} position={[-5, -3, -4]} />
          <pointLight       color="#F2BF1A" intensity={2.5} distance={18} position={[0, 0, 9]} />

          <Suspense fallback={null}>
            <LogoScene progressRef={progressRef} />
            <Environment preset="studio" />
          </Suspense>
        </Canvas>

        {/* ── Detalle ambiental ───────────────────────────────────────────── */}
        {/* Textura de X repetida, muy sutil, sobre el fondo negro */}
        <div
          aria-hidden="true"
          style={{
            position:         "absolute",
            inset:            0,
            backgroundImage:  "url('/images/x-sneax.svg')",
            backgroundRepeat: "repeat",
            backgroundSize:   "clamp(70px, 17vw, 104px) clamp(70px, 17vw, 104px)",
            opacity:          0.05,
            filter:           "invert(1)",
            pointerEvents:    "none",
            zIndex:           1,
          }}
        />
        {/* Contador — esquina inferior derecha */}
        <span
          className="font-body"
          style={{
            position:      "absolute",
            bottom:        24,
            right:         20,
            fontSize:      9,
            letterSpacing: "0.22em",
            color:         "rgba(240,237,232,0.3)",
            zIndex:        3,
            pointerEvents: "none",
          }}
        >
          01 / 05
        </span>
        {/* Indicador de scroll — centrado abajo, aparece al terminar */}
        <div
          className="md:hidden flex justify-center"
          style={{
            position:      "absolute",
            bottom:        26,
            left:          0,
            right:         0,
            zIndex:        3,
            pointerEvents: "none",
          }}
        >
          <div
            ref={cueRef}
            className="flex flex-col items-center font-body"
            style={{ gap: 5, opacity: 0 }}
          >
            <span style={{
              fontSize:      9,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color:         "rgba(240,237,232,0.5)",
            }}>
              Seguí
            </span>
            <span style={{
              fontSize:  13,
              color:     "#F2BF1A",
              animation: "act1-cue 1.6s ease-in-out infinite",
            }}>
              ↓
            </span>
          </div>
        </div>

        {/* Aparece cuando solo queda la X centrada */}
        <p
          ref={textRef}
          className="font-display"
          style={{
            position:       "absolute",
            inset:          0,
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
            fontSize:       "clamp(2.5rem, 6vw, 5rem)",
            letterSpacing:  "0.04em",
            color:          "#F0EDE8",
            textAlign:      "center",
            opacity:        0,
            pointerEvents:  "none",
            userSelect:     "none",
            zIndex:         4,
            textShadow:     "0 2px 32px rgba(0,0,0,0.9), 0 0 80px rgba(0,0,0,0.7)",
          }}
          aria-hidden="true"
        >
          No es solo una X.
        </p>
      </section>
    </div>
  );
}
