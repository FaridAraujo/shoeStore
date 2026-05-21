# Product

## Register

brand

## Users

Sneaker enthusiasts and casual shoppers in Costa Rica, primarily 18–35. Mall-goers who already know SNEAX from its five physical locations: Multiplaza Escazú, Multiplaza del Este, Lincoln Plaza, City Mall Alajuela, Mall Oxígeno. They discover the brand through Instagram (@sneax_cr, 15k followers) and expect a digital presence that matches the quality of the real stores. These are not sneaker-nerd collectors chasing limited drops — they are everyday people who want good shoes with personality. The job to be done: discover what's new, browse the curated selection, and find which store has what they want.

## Product Purpose

A premium visual portfolio piece built to pitch as SNEAX's official website. The site is not backed by a real checkout or inventory system — it is an immersive web experience that communicates brand identity, showcases the curated sneaker catalog, and directs users to the physical stores. Success looks like: someone views this site and immediately understands SNEAX is a real, established Costa Rican brand worth visiting in person.

The site has seven planned sections: Hero (fullscreen video of real stores), Featured Drop (floating product hero with Framer Motion), Collection (product grid with brand filters), Product Detail (React Three Fiber 3D viewer), Brand Story (scroll storytelling editorial), Sucursales (5 store locations with Google Maps), Footer.

Register varies by section — Hero and Brand Story are brand surfaces (the design IS the experience); Collection, Product Detail, and Cart are product surfaces (the design serves the product). Featured Drop is hybrid. Default register is brand; override per task as needed.

## Brand Personality

Accessible. Concrete. Real.

SNEAX is streetwear for everyone — "Para TODXS." Not a luxury brand, not a hypebeast platform. The tone is curated but unpretentious: "Curados. Sin prisa." Slow, deliberate curation. The brand symbol is the X from the SNEAX logo — used as a standalone mark and as the site-wide custom cursor. The personality lives in materials: concrete floors, industrial shelving, actual light falling on actual sneakers. The voice is confident without being exclusive, editorial without being cold.

Taglines in active use: "Para TODXS", "Curados. Sin prisa.", "New In." — short, declarative, no punctuation theater.

## Anti-references

- **Generic Shopify sneaker templates.** Templated product grids, standard carousel sliders, stock-photo-on-white heroes. SNEAX has a visual identity. It should not look like a default theme.
- **Luxury fashion digital experiences** (Balenciaga.com, Off-White). Dark minimalism with extreme typography and $800 price points. SNEAX is accessible. The aesthetic is brutalist-concrete, not brutal-luxury.
- **Neon streetwear / hypebeast exclusivity** (Supreme, KITH). Aggressive color, countdown timers, artificial scarcity mechanics. The opposite of "Para TODXS."
- **Glassmorphism and purple-glow AI aesthetic.** The dominant visual language that has infected SaaS and consumer products alike. No blurred cards, no gradient glows, no neon accents on dark backgrounds.
- **Corporate Nike/Adidas campaign sites.** Hero-metric templates, full-screen video with animated stat overlays, logo-as-wallpaper. SNEAX sells these brands but is not one of them.
- **Cold Scandinavian minimalism.** White space as aesthetic flex, sans warmth or texture. SNEAX's minimal moments are earned by contrast, not a resting state.

## Design Principles

1. **Physical first.** The site opens with real footage of real stores. Every design decision should feel like it could exist in a physical space — concrete, honest, touchable. Digital effects earn their presence by serving the narrative of the real stores, not decorating around them.

2. **Restraint earns the accent.** The yellow (#F2BF1A) appears only where it carries meaning: a price highlight, an active state, a detail that demands attention. If the accent is everywhere, it means nothing. When in doubt, remove it.

3. **Para TODXS.** The brutalist aesthetic must remain welcoming, never intimidating. Large display type is used for impact, not to overwhelm. Accessibility is not optional — the store is for everyone. WCAG 2.1 AA minimum, always.

4. **Every scroll tells a story.** Motion is narrative, not decoration. The hero video transitions to concrete because concrete IS the brand. The Sucursales section echoes the hero video. Each section should feel like turning a page in a city zine — deliberate, not automatic.

5. **The store is the point.** The five physical locations are not footnotes. They are the destination. Every digital moment should build toward: find us in person.

## Accessibility & Inclusion

WCAG 2.1 AA minimum. The accent yellow (#F2BF1A) must meet contrast requirements when used on text — always test against both ink (#0A0A0A) and concrete (#E8E6E1) backgrounds. Custom X cursor must fall back gracefully to the system cursor. All GSAP and Framer Motion animations must respect `prefers-reduced-motion: reduce` — provide static fallbacks. Videos are muted, autoplay, background-only; no content-critical information lives in video alone. Spanish is the primary language (lang="es"); UI copy should be in Spanish unless the brand term is in English (drop names, brand names, "New In.", "SS 2025").
