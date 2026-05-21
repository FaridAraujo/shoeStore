// ─── Brands ──────────────────────────────────────────────────────────────────
/*
  Enum values are UPPERCASE so they match the BRANDS filter list in
  lib/products.ts directly (product.brand === activeFilter works without
  any case mapping).
*/
export enum Brand {
  NIKE = "NIKE",
  JORDAN = "JORDAN",
  ADIDAS = "ADIDAS",
  ASICS = "ASICS",
  NEW_BALANCE = "NEW BALANCE",
  CONVERSE = "CONVERSE",
  TIMBERLAND = "TIMBERLAND",
  VEJA = "VEJA",
  PUMA = "PUMA",
  GOLA = "GOLA",
}

// ─── Product ──────────────────────────────────────────────────────────────────

/*
  Single canonical Product type for the whole app — catalog (lib/products.ts),
  Collection grid, ProductDetail page and Cart all share this shape.
*/
export interface Product {
  id: string;
  /** URL segment for /productos/[slug] — equal to id */
  slug: string;
  brand: Brand;
  name: string;
  colorway?: string;
  /** Price in Costa Rican Colón (CRC) */
  price: number;
  /** Hero image path relative to /public */
  image: string;
  /** Short Spanish marketing description shown on the product page */
  description: string;
  /** Descriptive tags e.g. ["Lifestyle", "Retro", "Unisex"] */
  tags: string[];
  /** Available EU sizes */
  sizes: number[];
  /** Dominant hex colour of the colourway, shown as the swatch */
  swatch: string;
  isFeatured?: boolean;
  isNewDrop?: boolean;
}

// ─── Cart ─────────────────────────────────────────────────────────────────────

/** Cart stores the selected EU size as a plain number. */
export type ShoeSizeUS = number;

export interface CartItem {
  product: Product;
  selectedSize: number;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
  totalItems: number;
  totalPrice: number;
}

export type CartAction =
  | { type: "ADD_ITEM"; payload: { product: Product; size: number } }
  | { type: "REMOVE_ITEM"; payload: { productId: string; size: number } }
  | { type: "UPDATE_QUANTITY"; payload: { productId: string; size: number; quantity: number } }
  | { type: "OPEN_CART" }
  | { type: "CLOSE_CART" }
  | { type: "TOGGLE_CART" }
  | { type: "CLEAR_CART" };
