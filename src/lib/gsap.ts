"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/*
  Register all GSAP plugins once at module load time.
  Import from this file rather than directly from "gsap" so plugin
  registration is guaranteed before any component uses them.
*/
gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };
