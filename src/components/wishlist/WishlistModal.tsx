"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import {
  X,
  Heart,
  ShoppingBag,
  Trash2,
  BatteryFull,
  ArrowRight,
  Sparkles,
  Check,
} from "lucide-react";
import { useStore } from "@/store/useStore";
import { products, deals, formatPrice, savingsPct } from "@/lib/products";

export default function WishlistModal() {
  const wishlist = useStore((s) => s.wishlist);
  const wishlistOpen = useStore((s) => s.wishlistOpen);
  const setWishlistOpen = useStore((s) => s.setWishlistOpen);
  const toggleWishlist = useStore((s) => s.toggleWishlist);
  const clearWishlist = useStore((s) => s.clearWishlist);
  const addToCart = useStore((s) => s.addToCart);
  const setCartOpen = useStore((s) => s.setCartOpen);

  const [mounted, setMounted] = useState(false);
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  useEffect(() => setMounted(true), []);

  // Close on Escape
  useEffect(() => {
    if (!wishlistOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setWishlistOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [wishlistOpen, setWishlistOpen]);

  if (!mounted) return null;

  // Match items from both products and deals
  const allCatalog = [
    ...products,
    ...deals.filter((d) => !products.some((p) => p.id === d.id)),
  ];
  const savedItems = allCatalog.filter((p) => wishlist.includes(p.id));
  const suggestedPhones = products.filter((p) => p.category === "phones" && !wishlist.includes(p.id)).slice(0, 3);

  const handleMoveToCart = (p: (typeof allCatalog)[number]) => {
    addToCart(p, 1);
    setJustAddedId(p.id);
    setTimeout(() => setJustAddedId(null), 1200);
  };

  const handleMoveAllToCart = () => {
    savedItems.forEach((p) => addToCart(p, 1));
    setWishlistOpen(false);
    setCartOpen(true);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Saved Favorites"
      className={clsx(
        "fixed inset-0 z-[85] transition-all duration-500",
        wishlistOpen ? "visible" : "invisible pointer-events-none",
      )}
    >
      {/* Backdrop */}
      <div
        onClick={() => setWishlistOpen(false)}
        className={clsx(
          "absolute inset-0 bg-navy-950/60 backdrop-blur-sm transition-opacity duration-500",
          wishlistOpen ? "opacity-100" : "opacity-0",
        )}
      />

      {/* Slide-over Drawer / Responsive Modal */}
      <aside
        className={clsx(
          "absolute right-0 top-0 flex h-dvh w-full max-w-full flex-col bg-[#F5F8FF] shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:max-w-[440px]",
          wishlistOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        {/* Sticky Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-line bg-white px-4 py-3.5 sm:px-5 sm:py-4">
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl bg-rose-50 text-rose-500">
              <Heart className="size-4 fill-rose-500" />
            </span>
            <div>
              <h2 className="text-base font-extrabold text-ink sm:text-lg">
                Saved Favorites ({savedItems.length})
              </h2>
              <p className="text-[11px] text-muted">Prices &amp; live stock updated in real time</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {savedItems.length > 0 && (
              <button
                onClick={clearWishlist}
                className="rounded-full px-2.5 py-1 text-[11px] font-bold text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
              >
                Clear all
              </button>
            )}
            <button
              onClick={() => setWishlistOpen(false)}
              aria-label="Close favorites modal"
              className="grid size-9 place-items-center rounded-full bg-surface text-slate-600 transition hover:bg-rose-50 hover:text-rose-600"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 space-y-3 overflow-y-auto p-4 sm:p-5">
          {savedItems.length === 0 ? (
            <div className="space-y-6">
              <div className="rounded-3xl bg-white p-6 text-center shadow-xs ring-1 ring-line">
                <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-rose-50 text-rose-500">
                  <Heart className="size-6" />
                </div>
                <h3 className="mt-3 text-base font-extrabold text-ink">Your Favorites list is empty</h3>
                <p className="mt-1 text-xs text-muted">
                  Tap the heart icon on any phone or gadget to bookmark it here and compare battery health &amp; savings.
                </p>
                <Link
                  href="/shop"
                  onClick={() => setWishlistOpen(false)}
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand-600 px-5 py-2.5 text-xs font-extrabold text-white shadow-lg shadow-brand-600/30 transition hover:bg-brand-700"
                >
                  Explore Full Phone Inventory
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>

              {/* Popular suggestions */}
              <div>
                <p className="mb-2.5 flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-muted">
                  <Sparkles className="size-3.5 text-brand-600" /> Popular Phones to Save
                </p>
                <div className="space-y-2.5">
                  {suggestedPhones.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between gap-3 rounded-2xl bg-white p-3 ring-1 ring-line"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="relative size-12 shrink-0 overflow-hidden rounded-xl bg-surface">
                          <Image src={p.image} alt={p.name} fill sizes="48px" className="object-cover" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-xs font-extrabold text-ink">{p.name}</p>
                          <p className="truncate text-[11px] text-muted">{p.variant}</p>
                          <p className="text-xs font-extrabold text-brand-600">{formatPrice(p.price)}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleWishlist(p.id)}
                        className="inline-flex shrink-0 items-center gap-1 rounded-full bg-rose-50 px-3 py-1.5 text-xs font-extrabold text-rose-600 transition hover:bg-rose-500 hover:text-white"
                      >
                        <Heart className="size-3.5" /> Save
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            savedItems.map((item) => {
              const pct = savingsPct(item.price, item.retail);
              const isAdded = justAddedId === item.id;
              return (
                <div
                  key={item.id}
                  className="flex items-center gap-3.5 rounded-2xl bg-white p-3 shadow-xs ring-1 ring-line transition hover:ring-brand-200"
                >
                  <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-surface">
                    <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />
                    <span className="absolute bottom-1 left-1 rounded-md bg-white/90 px-1.5 py-0.5 text-[9px] font-extrabold text-ink backdrop-blur">
                      {item.condition}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600">
                          {item.brand}
                        </span>
                        <h3 className="truncate text-sm font-extrabold text-ink">{item.name}</h3>
                        <p className="truncate text-[11px] text-muted">{item.variant}</p>
                      </div>
                      <button
                        onClick={() => toggleWishlist(item.id)}
                        aria-label="Remove from favorites"
                        className="rounded-lg p-1 text-slate-400 transition hover:bg-rose-50 hover:text-rose-500"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>

                    <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-base font-extrabold text-ink">{formatPrice(item.price)}</span>
                          <span className="text-[11px] text-slate-400 line-through">{formatPrice(item.retail)}</span>
                          <span className="text-[10px] font-extrabold text-emerald-600">-{pct}%</span>
                        </div>
                        {item.battery && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                            <BatteryFull className="size-3" /> {item.battery}% Battery
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => handleMoveToCart(item)}
                        className={clsx(
                          "inline-flex h-8 items-center gap-1.5 rounded-xl px-3 text-xs font-extrabold text-white transition",
                          isAdded ? "bg-emerald-500" : "bg-brand-600 hover:bg-brand-700",
                        )}
                      >
                        {isAdded ? (
                          <>
                            <Check className="size-3.5" /> Added
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="size-3.5" /> Add to Bag
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Sticky Footer */}
        <div className="shrink-0 border-t border-line bg-white p-4 sm:p-5">
          {savedItems.length > 0 ? (
            <div className="space-y-2.5">
              <button
                onClick={handleMoveAllToCart}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-600 text-sm font-extrabold text-white shadow-lg shadow-brand-600/35 transition hover:bg-brand-700"
              >
                <ShoppingBag className="size-4" />
                Add All ({savedItems.length}) to Cart
              </button>
              <Link
                href="/shop"
                onClick={() => setWishlistOpen(false)}
                className="flex h-10 w-full items-center justify-center gap-1.5 rounded-full bg-surface text-xs font-extrabold text-ink transition hover:bg-brand-50 hover:text-brand-600"
              >
                Browse Full Phone Inventory <ArrowRight className="size-3.5" />
              </Link>
            </div>
          ) : (
            <Link
              href="/shop"
              onClick={() => setWishlistOpen(false)}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-navy-950 text-sm font-extrabold text-white transition hover:bg-brand-600"
            >
              View All Phones &amp; Gadgets <ArrowRight className="size-4" />
            </Link>
          )}
        </div>
      </aside>
    </div>
  );
}
