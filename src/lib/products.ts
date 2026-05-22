// ─── Catalog ─────────────────────────────────────────────────────────────────

import { Brand, type Product } from "@/types";

export type { Product } from "@/types";
export { Brand } from "@/types";

// ─── Brands filter list ───────────────────────────────────────────────────────

export const BRANDS = [
  "TODOS",
  "NIKE",
  "JORDAN",
  "ADIDAS",
  "NEW BALANCE",
  "CONVERSE",
  "TIMBERLAND",
  "PUMA",
  "ASICS",
  "VEJA",
  "GOLA",
] as const;

export type BrandFilter = (typeof BRANDS)[number];

// ─── Price formatter ──────────────────────────────────────────────────────────

export function formatPrice(price: number): string {
  return `₡${price.toLocaleString("es-CR")}`;
}

// ─── Product lookup ────────────────────────────────────────────────────────────

/** Resolve a product by its slug (or id). Falls back to the first product. */
export function getProductBySlug(slug: string): Product {
  return PRODUCTS.find((p) => p.slug === slug || p.id === slug) ?? PRODUCTS[0];
}

// ─── Catalog ─────────────────────────────────────────────────────────────────
/*
  Order criteria for the 3-column Collection grid:
  Row 1 — Statement pieces that anchor the grid visually (high-hype, iconic silhouettes)
  Row 2 — Collab / limited  (culturally relevant, conversation starters)
  Row 3 — Lifestyle / accessible (broader audience, everyday wear)
*/

export const PRODUCTS: Product[] = [
  // ── Row 1 — Íconos ────────────────────────────────────────────────────────
  {
    id: "asics-gel-1130",
    slug: "asics-gel-1130",
    brand: Brand.ASICS,
    name: "Gel-1130",
    colorway: "White Pure Silver",
    price: 71900,
    originalPrice: 89900,
    image: "/images/products/asicsFeatured.png",
    description:
      "La silueta que define el momento. La Gel-1130 lleva la amortiguación GEL de ASICS a un diseño lifestyle que domina calles y feeds por igual.",
    tags: ["Lifestyle", "Amortiguación", "Unisex"],
    sizes: [36, 37, 38, 39, 40, 41, 42, 43, 44, 45],
    swatch: "#D8D4CC",
    isFeatured: true,
  },
  {
    id: "timberland-6in-wheat",
    slug: "timberland-6in-wheat",
    brand: Brand.TIMBERLAND,
    name: "6'' Premium Waterproof Boot",
    colorway: "Wheat Nubuck",
    price: 119900,
    image: "/images/products/timberland-6in-wheat.png",
    description:
      "El ícono que sobrevivió décadas de tendencias. La 6'' Premium en Wheat Nubuck es tan relevante hoy como el primer día — impermeable, indestructible, inconfundible.",
    tags: ["Lifestyle", "Outdoor", "Icónico"],
    sizes: [39, 40, 41, 42, 43, 44, 45],
    swatch: "#C8A567",
  },
  {
    id: "puma-speedcat-chocolate",
    slug: "puma-speedcat-chocolate",
    brand: Brand.PUMA,
    name: "Speedcat TTF",
    colorway: "Dark Chocolate Frosted Ivory",
    price: 84900,
    image: "/images/products/puma-speedcat-chocolate.png",
    description:
      "Heritage de pista, actitud de calle. La Speedcat TTF trae de vuelta la silueta más baja y limpia de PUMA con una paleta que lo dice todo sin decir nada.",
    tags: ["Lifestyle", "Retro", "Unisex"],
    sizes: [36, 37, 38, 39, 40, 41, 42, 43, 44, 45],
    swatch: "#4A3526",
  },

  // ── Row 2 — Los hits ──────────────────────────────────────────────────────
  {
    id: "jordan-4-sb-navy",
    slug: "jordan-4-sb-navy",
    brand: Brand.JORDAN,
    name: "Air Jordan 4 Retro SB",
    colorway: "Navy",
    price: 149900,
    image: "/images/products/jordan-4-sb-navy.png",
    description:
      "La colaboración que el skate esperaba. La Air Jordan 4 SB fusiona la herencia del básquetbol con la cultura del patín en un Navy profundo, lista para resistir lo que sea.",
    tags: ["Retro", "Basketball", "Premium"],
    sizes: [38, 39, 40, 41, 42, 43, 44, 45],
    swatch: "#2A3A52",
    isNewDrop: true,
  },
  {
    id: "nike-af1-nocta-clb",
    slug: "nike-af1-nocta-clb",
    brand: Brand.NIKE,
    name: "Air Force 1 Low",
    colorway: "Drake NOCTA Certified Lover Boy",
    price: 139900,
    image: "/images/products/nike-af1-nocta-clb.png",
    description:
      "Drake × Nike. La Certified Lover Boy lleva la silueta más vendida de la historia al territorio del arte — una pieza de colección que redefine qué significa una collab.",
    tags: ["Collab", "Lifestyle", "Limited"],
    sizes: [38, 39, 40, 41, 42, 43, 44, 45],
    swatch: "#E8E4DD",
    isNewDrop: true,
  },
  {
    id: "adidas-ballerina-bad-bunny",
    slug: "adidas-ballerina-bad-bunny",
    brand: Brand.ADIDAS,
    name: "Ballerina",
    colorway: "Bad Bunny Bold Gold",
    price: 134900,
    image: "/images/products/adidas-ballerina-bad-bunny.png",
    description:
      "Bad Bunny rompe moldes otra vez. La Ballerina Bold Gold lleva la estética de la danza clásica a las calles con una energía completamente nueva — tan inesperada como inevitable.",
    tags: ["Collab", "Lifestyle", "Limited"],
    sizes: [36, 37, 38, 39, 40, 41, 42, 43, 44],
    swatch: "#C9A24B",
    isNewDrop: true,
  },

  // ── Row 3 — Cierre ────────────────────────────────────────────────────────
  {
    id: "converse-shai-masi-blue",
    slug: "converse-shai-masi-blue",
    brand: Brand.CONVERSE,
    name: "SHAI 001",
    colorway: "Masi Blue",
    price: 79900,
    image: "/images/products/converse-shai-masi-blue.png",
    description:
      "La primera firma de Shai. La SHAI 001 en Masi Blue combina la precisión del básquetbol moderno con líneas limpias que funcionan dentro y fuera de la cancha.",
    tags: ["Basketball", "Lifestyle", "Unisex"],
    sizes: [36, 37, 38, 39, 40, 41, 42, 43, 44, 45],
    swatch: "#3E5B8C",
  },
  {
    id: "nike-rejuven8-orewood",
    slug: "nike-rejuven8-orewood",
    brand: Brand.NIKE,
    name: "ReactX Rejuven8",
    colorway: "Light Orewood Brown",
    price: 94900,
    image: "/images/products/nike-rejuven8-orewood.png",
    description:
      "Comodidad reinventada. La ReactX Rejuven8 entrega el retorno de energía más eficiente de Nike en una silueta lifestyle pensada para el día completo.",
    tags: ["Lifestyle", "Running", "Unisex"],
    sizes: [37, 38, 39, 40, 41, 42, 43, 44, 45],
    swatch: "#C7B79E",
  },
  {
    id: "jordan-11-legend-blue",
    slug: "jordan-11-legend-blue",
    brand: Brand.JORDAN,
    name: "Air Jordan 11 Retro",
    colorway: "Legend Blue 2024",
    price: 164900,
    image: "/images/products/jordan-11-legend-blue.png",
    description:
      "El regreso más esperado del año. La Air Jordan 11 Legend Blue combina cuero patente y malla balística — el lujo y el legado en una sola silueta.",
    tags: ["Retro", "Basketball", "Icónico"],
    sizes: [38, 39, 40, 41, 42, 43, 44, 45],
    swatch: "#4F6FB0",
  },
];
