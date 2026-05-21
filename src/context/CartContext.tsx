"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from "react";
import type { CartAction, CartItem, CartState, Product } from "@/types";
import type { ShoeSizeUS } from "@/types";

// ─── Reducer ──────────────────────────────────────────────────────────────────

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const { product, size } = action.payload;
      const existingIndex = state.items.findIndex(
        (i) => i.product.id === product.id && i.selectedSize === size
      );

      const items =
        existingIndex >= 0
          ? state.items.map((item, idx) =>
              idx === existingIndex
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          : [...state.items, { product, selectedSize: size, quantity: 1 }];

      return { ...state, items, ...computeTotals(items) };
    }

    case "REMOVE_ITEM": {
      const items = state.items.filter(
        (i) =>
          !(i.product.id === action.payload.productId &&
            i.selectedSize === action.payload.size)
      );
      return { ...state, items, ...computeTotals(items) };
    }

    case "UPDATE_QUANTITY": {
      const { productId, size, quantity } = action.payload;

      if (quantity <= 0) {
        const items = state.items.filter(
          (i) => !(i.product.id === productId && i.selectedSize === size)
        );
        return { ...state, items, ...computeTotals(items) };
      }

      const items = state.items.map((item) =>
        item.product.id === productId && item.selectedSize === size
          ? { ...item, quantity }
          : item
      );
      return { ...state, items, ...computeTotals(items) };
    }

    case "OPEN_CART":
      return { ...state, isOpen: true };

    case "CLOSE_CART":
      return { ...state, isOpen: false };

    case "TOGGLE_CART":
      return { ...state, isOpen: !state.isOpen };

    case "CLEAR_CART":
      return { ...initialState };

    default:
      return state;
  }
}

function computeTotals(items: CartItem[]): {
  totalItems: number;
  totalPrice: number;
} {
  return {
    totalItems: items.reduce((sum, i) => sum + i.quantity, 0),
    totalPrice: items.reduce(
      (sum, i) => sum + i.product.price * i.quantity,
      0
    ),
  };
}

const initialState: CartState = {
  items: [],
  isOpen: false,
  totalItems: 0,
  totalPrice: 0,
};

// ─── Context ──────────────────────────────────────────────────────────────────

interface CartContextValue extends CartState {
  addItem: (product: Product, size: ShoeSizeUS) => void;
  removeItem: (productId: string, size: ShoeSizeUS) => void;
  updateQuantity: (productId: string, size: ShoeSizeUS, quantity: number) => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addItem = useCallback(
    (product: Product, size: ShoeSizeUS) =>
      dispatch({ type: "ADD_ITEM", payload: { product, size } }),
    []
  );

  const removeItem = useCallback(
    (productId: string, size: ShoeSizeUS) =>
      dispatch({ type: "REMOVE_ITEM", payload: { productId, size } }),
    []
  );

  const updateQuantity = useCallback(
    (productId: string, size: ShoeSizeUS, quantity: number) =>
      dispatch({ type: "UPDATE_QUANTITY", payload: { productId, size, quantity } }),
    []
  );

  const openCart = useCallback(() => dispatch({ type: "OPEN_CART" }), []);
  const closeCart = useCallback(() => dispatch({ type: "CLOSE_CART" }), []);
  const toggleCart = useCallback(() => dispatch({ type: "TOGGLE_CART" }), []);
  const clearCart = useCallback(() => dispatch({ type: "CLEAR_CART" }), []);

  const value = useMemo<CartContextValue>(
    () => ({
      ...state,
      addItem,
      removeItem,
      updateQuantity,
      openCart,
      closeCart,
      toggleCart,
      clearCart,
    }),
    [state, addItem, removeItem, updateQuantity, openCart, closeCart, toggleCart, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a <CartProvider>");
  }
  return ctx;
}
