---
name: SNEAX
description: Premium Costa Rican sneaker store — concrete aesthetic, editorial typography, accessible streetwear.
colors:
  concrete: "#E8E6E1"
  surface: "#D4D0C8"
  border: "#B8B4AC"
  ink-muted: "#5A5850"
  ink: "#0A0A0A"
  dark-bg: "#111111"
  dark-surface: "#1C1C1C"
  dark-border: "#2E2E2E"
  dark-text: "#F0EEE9"
  dark-text-muted: "#9A978F"
  accent: "#F2BF1A"
typography:
  display:
    fontFamily: "Bebas Neue, sans-serif"
    fontSize: "clamp(4rem, 12vw, 10rem)"
    fontWeight: 400
    lineHeight: 0.95
    letterSpacing: "0.02em"
  headline:
    fontFamily: "Bebas Neue, sans-serif"
    fontSize: "clamp(2.5rem, 6vw, 6rem)"
    fontWeight: 400
    lineHeight: 0.95
    letterSpacing: "0.02em"
  title:
    fontFamily: "Bebas Neue, sans-serif"
    fontSize: "clamp(1.75rem, 4vw, 3.5rem)"
    fontWeight: 400
    lineHeight: 1.0
    letterSpacing: "0.02em"
  body:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "clamp(0.875rem, 1.5vw, 1rem)"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.15em"
rounded:
  none: "0px"
  sm: "2px"
  md: "4px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "40px"
  2xl: "64px"
  3xl: "96px"
  section: "clamp(64px, 10vw, 128px)"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.concrete}"
    rounded: "{rounded.none}"
    padding: "14px 32px"
  button-primary-hover:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.ink}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "13px 31px"
  button-ghost-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.concrete}"
  size-chip:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "8px 12px"
  size-chip-selected:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.concrete}"
  nav-link:
    backgroundColor: "transparent"
    textColor: "#FFFFFF"
    padding: "0"
---

# Design System: SNEAX

## 1. Overview

**Creative North Star: "The Concrete Zine"**

SNEAX's visual system is built from the materials of its own stores. The primary background is not a design choice made at a computer — it is the color of the concrete walls at Multiplaza Escazú. The ink is the same near-black as the shelving brackets. The accent yellow marks the moments that matter, the same way a price tag does in a well-curated shop. The system is brutalist in structure and editorial in execution: industrial bones, human warmth.

This is not a luxury brand website, and it should never feel like one. The restraint here is not a flex — it is honesty. SNEAX is "Para TODXS." Every typographic and spatial decision should reinforce that the brand is accessible, confident, and real. Large Bebas Neue headlines create impact through scale, not through inaccessibility. The body type (DM Sans) is functional and warm. The two together read like a city billboard next to a handwritten note.

Motion is narrative, not decoration. GSAP ScrollTrigger animations tell the story of the physical stores transitioning into the digital experience. Framer Motion handles product presentation with measured elegance. React Three Fiber powers the 3D product viewer — a technical achievement worn lightly. Nothing moves for the sake of moving.

**Key Characteristics:**
- Warm concrete tones as primary palette — never pure white, never pure black
- Single accent color (golden yellow) used at maximum 10% surface coverage
- Display type at extreme scale; body type at strict column width
- Flat surfaces with no shadows — depth through layering and overlap, not elevation
- Scroll-driven narrative connecting physical stores to digital experience
- Dark mode inverts the hierarchy: warm off-white on dark charcoal, accent unchanged
- Custom X cursor reinforces brand identity at every interaction

## 2. Colors: The Concrete Palette

All surface colors are pulled from the real material of SNEAX's physical locations. The palette has no invented neutrals — only tones that exist in the actual stores.

### Primary
- **Accent Yellow** (`#F2BF1A` / `oklch(83.0% 0.170 85)`): The only color in the system with chroma. Used for price highlights, active states, hover treatments on primary buttons, the X cursor on interactive elements, and text selection. Never decorative. Maximum 10% of any given screen surface.

### Neutral — Light Mode
- **Concrete** (`#E8E6E1` / `oklch(91.2% 0.005 80)`): Main page background. The color of the store walls. Every section defaults to this.
- **Surface** (`#D4D0C8` / `oklch(83.1% 0.007 80)`): Cards, product tiles, secondary containers. One step darker than concrete.
- **Border** (`#B8B4AC` / `oklch(72.5% 0.008 80)`): Dividers, outlines, structural lines. Not decorative — only where physical separation is functionally required.
- **Ink Muted** (`#5A5850` / `oklch(39.8% 0.008 80)`): Captions, metadata, secondary labels, eyebrow text.
- **Ink** (`#0A0A0A` / `oklch(7.8% 0.003 80)`): All primary text, primary buttons, default X cursor. Never pure black — always this slightly warm near-black.

### Neutral — Dark Mode
- **Dark Background** (`#111111`): Page background in dark mode. Not pure black — the same philosophy as ink, but inverted.
- **Dark Surface** (`#1C1C1C`): Cards and containers in dark mode.
- **Dark Border** (`#2E2E2E`): Dividers in dark mode.
- **Dark Text** (`#F0EEE9`): Primary text in dark mode. A warm off-white, not stark white — it reads like concrete under warm light.
- **Dark Text Muted** (`#9A978F`): Secondary text in dark mode.

### Named Rules
**The One Voice Rule.** The accent yellow is the only color in this system with meaningful chroma. It speaks once per screen, at most. Using it twice is indecision. Using it everywhere is silence.

**The Warm Neutrals Rule.** Every neutral in this system leans warm — toward yellow-brown, never toward blue-gray. Mixing warm and cool grays in the same screen is prohibited. If a shade feels cold, it does not belong here.

**The No Pure Values Rule.** `#000000` and `#FFFFFF` do not exist in this system. The darkest value is ink (`#0A0A0A`). The lightest is dark-text (`#F0EEE9`). Pure values break the material illusion.

## 3. Typography

**Display Font:** Bebas Neue (Google Fonts, weight 400)
**Body Font:** DM Sans (Google Fonts, variable weight)

**Character:** Bebas Neue is all-caps by nature — it does not need to be set in uppercase; it simply is. At large scale it reads like the lettering on a shipping crate or a building facade. DM Sans is humanist and warm, a functional companion that never competes. Together they read like a city zine: bold announcements, readable content.

### Hierarchy
- **Display** (Bebas Neue 400, `clamp(4rem, 12vw, 10rem)`, line-height 0.95): Hero headlines. Section-defining statements. "MOVE / BEYOND / LIMITS." Used once or twice per page. Never in sentences — always in fragments or single words.
- **Headline** (Bebas Neue 400, `clamp(2.5rem, 6vw, 6rem)`, line-height 0.95): Section titles. Product names at hero scale. "FEATURED DROP", "NUEVA COLECCIÓN".
- **Title** (Bebas Neue 400, `clamp(1.75rem, 4vw, 3.5rem)`, line-height 1.0): Card headings, sub-section labels, store names in Sucursales.
- **Body** (DM Sans 400, `clamp(0.875rem, 1.5vw, 1rem)`, line-height 1.6): All prose content. Nav links. Descriptions. Cart items. Max line length 65ch. Never in Bebas Neue.
- **Label** (DM Sans 500, `0.6875rem`, line-height 1.4, letter-spacing 0.15em, UPPERCASE): Eyebrow text ("SS 2025 — THE NEW DROP"), category tags, nav links, size labels, filter chips. The voice of metadata.

### Named Rules
**The No Prose in Bebas Rule.** Bebas Neue is reserved for display, headline, and title levels only. Body copy, labels in forms, error messages, cart contents, and descriptive UI text are always DM Sans. Bebas Neue in a sentence is a category error.

**The Tight Crown Rule.** Display and headline line-height is 0.95 — below 1.0 on purpose. At large scale, generous line-height creates void, not rhythm. The letters are tight; the space between sections provides the breath.

**The Scale Ratio Rule.** Adjacent hierarchy levels maintain at least a 1.4× size ratio. A heading at 40px and a subheading at 38px are not a hierarchy — they are noise.

## 4. Elevation

This system is flat. Surfaces do not cast shadows on each other. Depth is created through overlap, z-index layering, and the contrast between surface tones — not through elevation.

The only exception is the hero video context: when the nav sits over the dark video, it achieves perceived elevation through the darkness of the layer below it, not through a drop shadow on the nav itself.

**Shadow vocabulary: none.** There are no `box-shadow` values in this system.

**Depth is achieved through:**
- **Tonal layering:** concrete (lightest) → surface → border → ink (darkest). Moving from background to foreground means moving from lighter to darker tone.
- **Overlap:** product images overlap their containers. Sticky elements sit in front of scroll content by z-index, not shadow.
- **Scale contrast:** large type in front, small type recedes. The display hierarchy IS the depth hierarchy.
- **Motion:** elements that move feel closer than elements that are static. GSAP scroll-driven layers at different speeds create physical depth without any shadow.

### Named Rules
**The Flat-By-Default Rule.** If you reach for `box-shadow`, stop. Ask first: can this depth be communicated through tone, overlap, or scale? It almost always can. Shadows belong in other design systems, not here.

## 5. Components

### Buttons
Buttons in this system have zero border-radius. No rounded corners — edges are structural, like a concrete corner.

- **Primary:** Ink background (`#0A0A0A`), concrete text (`#E8E6E1`), padding `14px 32px`, DM Sans Medium, letter-spacing 0.1em, UPPERCASE. On hover: background transitions to accent yellow (`#F2BF1A`), text to ink (`#0A0A0A`). Transition: `background 200ms ease-out, color 200ms ease-out`.
- **Ghost:** Transparent background, 1px solid ink border, ink text. Same padding. On hover: fills to ink, text to concrete — identical end-state as primary hover. The button types converge on the same terminal state.
- **Disabled:** 50% opacity, cursor blocked (system default overrides the X cursor for disabled states).

### Size Chips
Used in the size selector on Product Detail. Square proportion, no border-radius.
- **Unselected:** transparent background, 1px solid border (`#B8B4AC`), ink text, DM Sans 500, 12px.
- **Selected:** ink background, concrete text, no border.
- **Out of stock:** 50% opacity, a diagonal strike line drawn in CSS (not a separate element), pointer-events none.
- **Hover (in-stock, unselected):** border shifts to ink (1px solid `#0A0A0A`).

### Product Cards
Flat. No border-radius. No box-shadow.
- **Background:** surface (`#D4D0C8`).
- **Border:** none at rest. 1px solid ink on hover — the card "gains" a border, not a shadow.
- **Image area:** fixed aspect ratio (3:4), `object-fit: cover`. Product image against surface background.
- **Content area:** padding 16px. Brand label in DM Sans 500 Label style (11px, 0.15em tracking, uppercase, ink-muted). Product name in DM Sans 500, 14px, ink. Price in DM Sans 600, 14px, ink. On hover, an "Add to Cart" strip slides up from the bottom with accent yellow background.

### Navigation
Transparent background — sits directly over content. No blur, no background color unless a scroll threshold is crossed (a design decision for later implementation).
- **Logo:** "SNEAX" in Bebas Neue, 28px, letter-spacing 0.1em, white (over dark hero video), ink (over light sections). The logo color responds to the background it overlaps.
- **Nav links:** DM Sans 500, 12px, letter-spacing 0.15em, UPPERCASE, white over dark / ink over light. No underline at rest. Accent yellow underline-from-left on hover (2px, CSS transform scaleX).
- **Cart badge:** DM Sans 500, 12px. Count in parentheses: "Cart (2)". No pill shape — just the text.
- **Height:** 72px fixed. `position: fixed; top: 0; width: 100%; z-index: 50`.

### Inputs / Search
- **Style:** 1px solid border (`#B8B4AC`), no border-radius, background concrete. Padding 12px 16px. DM Sans 400, 14px.
- **Focus:** border shifts to ink (1px solid `#0A0A0A`). No glow, no color shift.
- **Placeholder:** ink-muted (`#5A5850`).

### Signature Component — The X Cursor
The site-wide cursor is the SNEAX X mark — the same shape as the brand logomark's X. Implemented as an SVG data-URI.
- **Default state:** Ink (`#0A0A0A`) on light mode, dark-text (`#F0EEE9`) on dark mode. Stroke width 2.5, round linecaps.
- **Interactive state (a, button, [role="button"]):** Accent yellow (`#F2BF1A`), stroke width 3. The cursor itself signals interactivity — no additional hover decoration is required for this signal alone.
- **Fallback:** `crosshair` for default, `pointer` for interactive. Both are set as the second value in the `cursor` declaration.

## 6. Do's and Don'ts

### Do:
- **Do** use concrete (`#E8E6E1`) as the default page background in light mode. The site is a concrete space first.
- **Do** set Bebas Neue headlines at extreme scale with line-height 0.95 or below. The tight leading is structural — it creates mass.
- **Do** use the accent yellow (`#F2BF1A`) as the ONE moment of chroma per screen: a price, a hover state, an active indicator. Stop there.
- **Do** keep all neutrals warm-toned (hue ~80°). If a gray reads cool or blue, it does not belong here.
- **Do** use `min-h-[100dvh]` for full-height sections. Never `h-screen` — the iOS Safari viewport bug breaks the hero layout.
- **Do** extract GSAP logic into isolated `'use client'` leaf components. Server Components render static layout only.
- **Do** verify package.json before importing any third-party library. Never assume a dependency is installed.
- **Do** set `prefers-reduced-motion: reduce` fallbacks for all GSAP and Framer Motion animations.
- **Do** test the accent yellow against both ink and concrete when used as text. Contrast must pass WCAG 2.1 AA.
- **Do** write UI copy in Spanish. English is reserved for brand terms (drop names, brand names, "New In.", "SS 2025").

### Don't:
- **Don't** add `box-shadow` to any element. This system has no shadows. Depth comes from tone, overlap, and scale.
- **Don't** use `border-radius` above 4px on interactive elements or cards. Rounded corners are a different visual vocabulary. This system uses square or very slightly softened edges only.
- **Don't** use the accent yellow decoratively — as a background fill on large areas, as a text highlight for emphasis, or as a brand-color splash. It appears only to signal state or price.
- **Don't** mix warm and cool grays. Every neutral in this system leans toward yellow-brown. A cool gray is a violation.
- **Don't** use Inter, Roboto, or any sans-serif other than DM Sans for body text. Do not substitute Bebas Neue for any other display font.
- **Don't** build generic Shopify-style product grids: three equal-width cards in a row, centered CTA below each, identical heights. This is the anti-reference. Break the grid.
- **Don't** use glassmorphism (`backdrop-filter: blur`), gradient glows, or neon accents. These are explicitly rejected aesthetics.
- **Don't** create luxury-brand coldness: extreme whitespace as aesthetic, $800-tier editorial photography, exclusivity copy. SNEAX is "Para TODXS" — the brutalist aesthetic must remain accessible and warm.
- **Don't** let the accent yellow appear in the hero section unless it is functional (a CTA, a price). The hero is dark and cinematic — yellow in the hero competes with the video.
- **Don't** animate layout properties (width, height, top, left, margin). GSAP and Framer Motion should animate transform and opacity only. Layout animation is expensive and visible.
- **Don't** use `#000000` or `#FFFFFF`. The darkest value is ink (`#0A0A0A`). The lightest is dark-text (`#F0EEE9`). Pure values break the material palette.
