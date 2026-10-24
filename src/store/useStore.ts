"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Product } from "@/lib/products";

export type CartItem = {
  id: string;
  name: string;
  variant: string;
  price: number;
  image: string;
  qty: number;
};

type StoreState = {
  cart: CartItem[];
  wishlist: string[];
  cartOpen: boolean;
  introDone: boolean;
  addToCart: (p: Product, qty?: number) => void;
  removeFromCart: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clearCart: () => void;
  toggleWishlist: (id: string) => void;
  setCartOpen: (open: boolean) => void;
  setIntroDone: (done: boolean) => void;
};

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      cart: [],
      wishlist: [],
      cartOpen: false,
      introDone: false,
      addToCart: (p, qty = 1) =>
        set((s) => {
          const existing = s.cart.find((i) => i.id === p.id);
          if (existing) {
            return {
              cart: s.cart.map((i) =>
                i.id === p.id ? { ...i, qty: Math.min(i.qty + qty, p.stock) } : i,
              ),
            };
          }
          return {
            cart: [
              ...s.cart,
              { id: p.id, name: p.name, variant: p.variant, price: p.price, image: p.image, qty },
            ],
          };
        }),
      removeFromCart: (id) => set((s) => ({ cart: s.cart.filter((i) => i.id !== id) })),
      setQty: (id, qty) =>
        set((s) => ({
          cart: qty <= 0 ? s.cart.filter((i) => i.id !== id) : s.cart.map((i) => (i.id === id ? { ...i, qty } : i)),
        })),
      clearCart: () => set({ cart: [] }),
      toggleWishlist: (id) =>
        set((s) => ({
          wishlist: s.wishlist.includes(id) ? s.wishlist.filter((w) => w !== id) : [...s.wishlist, id],
        })),
      setCartOpen: (open) => set({ cartOpen: open }),
      setIntroDone: (done) => set({ introDone: done }),
    }),
    {
      name: "iused-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ cart: s.cart, wishlist: s.wishlist }),
    },
  ),
);

export const FREE_SHIPPING_THRESHOLD = 300;

export const cartCount = (cart: CartItem[]) => cart.reduce((n, i) => n + i.qty, 0);
export const cartTotal = (cart: CartItem[]) => cart.reduce((n, i) => n + i.qty * i.price, 0);
