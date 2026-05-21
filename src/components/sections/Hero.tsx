import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import HeroVideo from "./HeroVideo";
import HeroAnimations from "./HeroAnimations";
import HeroMagnetic from "./HeroMagnetic";
import HeroLocationsSheet from "./HeroLocationsSheet";

const HEADLINE_WORDS = ["TU", "PRÓXIMO", "PAR"] as const;
type HeadlineWord = (typeof HEADLINE_WORDS)[number];

const WORD_STYLES: Record<HeadlineWord, CSSProperties> = {
  TU: {
    fontSize: "clamp(5rem, 19vw, 15rem)",
    lineHeight: 0.92,
    letterSpacing: "-0.02em",
    color: "white",
    textShadow: "0 2px 14px rgba(0,0,0,0.65), 0 10px 50px rgba(0,0,0,0.4)",
  },
  PRÓXIMO: {
    fontSize: "clamp(3.6rem, 13.5vw, 10.5rem)",
    lineHeight: 0.92,
    letterSpacing: "0.1em",
    color: "white",
    textShadow: "0 2px 14px rgba(0,0,0,0.65), 0 10px 50px rgba(0,0,0,0.4)",
  },
  PAR: {
    fontSize: "clamp(5rem, 19vw, 15rem)",
    lineHeight: 0.92,
    letterSpacing: "-0.02em",
    color: "white",
    textShadow: "0 2px 14px rgba(0,0,0,0.65), 0 10px 50px rgba(0,0,0,0.4)",
  },
};

/*
  PRÓXIMO is pre-split into individual character <span>s with the logo X
  as an inline image. HeroMagnetic detects existing children and uses them
  directly as magnetic units instead of splitting textContent (which would
  destroy the img element).
*/
function ProximoContent({ style }: { style: CSSProperties }) {
  const charStyle: CSSProperties = { display: "inline-block" };
  return (
    <>
      {"PRÓ".split("").map((ch, i) => (
        <span key={i} style={charStyle}>{ch}</span>
      ))}
      <Image
        src="/images/x-white.png"
        alt=""
        aria-hidden="true"
        width={120}
        height={120}
        className="hero-x-logo"
        style={{
          display: "inline-block",
          height: "0.9em",
          width: "auto",
          verticalAlign: "middle",
          marginInline: "-0.18em",
          transform: "scale(1.5) translateX(-0.08em)",
          transformOrigin: "center",
        }}
      />
      {"IMO".split("").map((ch, i) => (
        <span key={`b${i}`} style={charStyle}>{ch}</span>
      ))}
    </>
  );
}

export default function Hero() {
  return (
    <>
      {/*
        Scroll track — 240dvh tall. The hero section sticks inside it for
        140dvh of travel (240 − 100), driving the word-reveal timeline.
        CSS `position: sticky` replaces GSAP `pin: true`: it produces the
        same fixed-while-scrolling effect WITHOUT injecting a pin-spacer
        <div> into the DOM. GSAP's pin-spacer is invisible to React's fiber
        tree and causes "removeChild: node is not a child" crashes when the
        page unmounts on navigation.
      */}
      <section
        id="hero"
        data-hero-section
        data-nav-theme="dark"
        className="h-[100dvh] w-full bg-[#0A0A0A] overflow-hidden flex flex-col items-center justify-center"
      >
        {/* Video layer */}
        <HeroVideo />

        {/* 1. Base dimmer */}
        <div
          aria-hidden="true"
          className="absolute inset-0 z-[1] pointer-events-none bg-black/25"
        />

        {/* 2. Top gradient — nav legible sobre cualquier frame */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-40 z-[1] pointer-events-none"
          style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.55), transparent)" }}
        />

        {/* 3a. Bottom fade */}
        <div
          data-hero-bottom-grad
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-[75%] z-[1] pointer-events-none bg-[#0A0A0A]"
          style={{
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0%, black 88%, black 100%)",
            maskImage:
              "linear-gradient(to bottom, transparent 0%, black 88%, black 100%)",
          }}
        />

        {/* 3b. Solid safety strip */}
        <div
          data-hero-bottom-solid
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-16 z-[1] pointer-events-none bg-[#0A0A0A]"
        />

        {/* Content */}
        <div className="relative z-[2] flex flex-col items-center text-center w-full select-none">
          {/* Headline */}
          <div
            className="flex flex-col items-center"
            aria-label="Tu próximo par"
          >
            {HEADLINE_WORDS.map((word) => (
              <div
                data-hero-word
                key={word}
                className="font-display"
                style={WORD_STYLES[word]}
                aria-hidden="true"
              >
                <span
                  data-hero-word-magnetic
                  style={{ display: "inline-block" }}
                >
                  {word === "PRÓXIMO"
                    ? <ProximoContent style={WORD_STYLES[word]} />
                    : word}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA — fijo al fondo del hero sticky, visible durante todo el scroll del hero */}
        <div
          className="absolute bottom-8 left-1/2 z-[3]"
          style={{ transform: "translateX(-50%)" }}
        >
          <HeroLocationsSheet />
        </div>

        <HeroAnimations />
        <HeroMagnetic />
      </section>

      <div
        data-hero-outro
        className="-mt-[3px] h-[4px] w-full bg-[#0A0A0A] pointer-events-none"
        aria-hidden="true"
      />
    </>
  );
}
