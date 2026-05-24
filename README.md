# SNEAX — Sneaker Store

> Production-ready e-commerce storefront built for a sneaker retailer in Costa Rica.
> Designed and developed as a portfolio project with the goal of delivering a real product to a real client.

## Live Demo
[sneax.vercel.app](https://sneax.vercel.app) *(update with final domain)*

## Features

- Video hero with GSAP scroll-triggered word reveals — three oversized display words animate in as the user scrolls through a 240svh track
- FeaturedDrop section — floating sneaker animation (CSS keyframes), product carousel with thumbnail navigation, drag momentum, and per-product price/tag display
- Collection grid with brand filtering, live text search, and pagination — filters collapse with a smooth grid-template-rows transition
- Product detail page — 3-column layout (description / image / purchase), EU↔US size toggle, size guide modal (bottom sheet on mobile), related products grid
- About page with 5 cinematic acts: 3D logo animation, scroll-driven headline reveals, origin story, brand marquee, and Costa Rica store locations map
- 3D SNEAX→X logo animation — React Three Fiber + SVGLoader extrudes each letter into a metallic mesh; letters fly out on scroll to reveal the centered X
- Scroll-driven animations with GSAP `scrub` + `snap` — sections auto-complete if the user stops mid-scroll, with per-breakpoint behavior via `gsap.matchMedia()`
- Cart system — React Context with add / remove / quantity management, persistent drawer, total calculation
- Authentication flow — login, registro, and account page
- Checkout with confirmation page
- Discount UI — yellow badge with computed percentage, strikethrough original price, and amber sale price across all surfaces (grid cards, featured drop, product detail)
- New Drops section — dark-themed filtered view of `isNewDrop` products
- Brand directory page
- `svh` viewport units throughout — prevents content jump when the iOS Safari toolbar shows/hides on scroll
- Hero video autoplay recovery — manual `.play()` on mount, `canplay`, and `visibilitychange` for reliable autoplay on iOS Safari and Chrome Android
- Responsive design — mobile-first, with dedicated CSS class overrides (`fd-*`, `pd-*`) for complex layout reflows at 768px
- Adaptive favicon — SVG icon with `prefers-color-scheme` media query, dark X on light browsers and white X on dark browsers

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS + inline styles |
| Animations | GSAP + ScrollTrigger |
| Microinteractions | Framer Motion |
| 3D | Three.js + React Three Fiber + @react-three/drei |
| Fonts | Bebas Neue + DM Sans via next/font |
| Deployment | Vercel |

## Screenshots

*(Add screenshots here)*

## Run Locally

```bash
git clone https://github.com/FaridAraujo/sneax
cd sneax
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## What I Learned

- Building a 3D scroll-driven animation with React Three Fiber — loading SVG paths via `SVGLoader`, extruding them into `ExtrudeGeometry`, and driving mesh position/scale/opacity from a GSAP ScrollTrigger `progressRef` read each frame via `useFrame`
- Responsive 3D scaling — reading canvas dimensions from `useThree` to compute a `groupScale` that keeps a 9-world-unit logo fully visible on mobile portrait aspect ratios
- GSAP `scrub` + `snap` pattern for cinematic scroll sections — `scrub` ties animation progress to scroll position while `snap` auto-completes the animation when the user stops, with `duration: { min, max }` to control snap speed independently of scrub lag
- `gsap.matchMedia()` for breakpoint-specific animation behavior — separate timelines for mobile and desktop that cleanly revert on resize without leaking ScrollTrigger instances
- CSS `position: sticky` + tall track div as a scroll pin — the section stays fixed while the track scrolls behind it, making snap scroll invisible to the user (they only see the animation completing)
- `svh` vs `dvh` — `dvh` resizes dynamically as the browser chrome shows/hides, causing content jumps; `svh` locks to the stable minimum viewport height and eliminates the issue
- Hero video autoplay reliability on mobile — the HTML `autoplay` attribute is only a hint; calling `.play()` manually on mount, on `canplay`, and on `visibilitychange` ensures the video starts after slow loads and tab switches
- Discount UI architecture — a single optional `originalPrice` field on the `Product` type propagates badge and strikethrough price rendering across every surface without conditional logic scattered through each component
- Flex layout collapse — `alignItems: center` on a `flex-direction: column` container collapses child widths to auto when no explicit width is set; `width: 100%` on children restores expected behavior
- Cart state with React Context + `useReducer` — modeling add/remove/quantity as dispatched actions keeps cart logic centralized and testable outside of component trees
- Next.js App Router dynamic routes — `[slug]` segments with `generateStaticParams` for pre-rendered product pages, falling back to the first product on unknown slugs
