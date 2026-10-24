"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import {
  X,
  Heart,
  ShoppingBag,
  Check,
  BatteryFull,
  ShieldCheck,
  Plus,
  Minus,
  BadgeCheck,
} from "lucide-react";
import { useStore } from "@/store/useStore";
import { formatPrice, savingsPct } from "@/lib/products";
import Stars from "@/components/ui/Stars";

const swatches = [
  { name: "Titanium Blue", hex: "#243b6b" },
  { name: "Graphite", hex: "#2f333a" },
  { name: "Silver", hex: "#d9dde4" },
  { name: "Midnight", hex: "#0b1324" },
];

export default function ProductQuickView() {
  const product = useStore((s) => s.quickViewProduct);
  const setQuickViewProduct = useStore((s) => s.setQuickViewProduct);
  const addToCart = useStore((s) => s.addToCart);
  const setCartOpen = useStore((s) => s.setCartOpen);
  const toggleWishlist = useStore((s) => s.toggleWishlist);
  const wishlist = useStore((s) => s.wishlist);

  const [qty, setQty] = useState(1);
  const [selectedColor, setSelectedColor] = useState(0);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setQty(1);
    setSelectedColor(0);
    setAdded(false);
  }, [product]);

  useEffect(() => {
    if (!product) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setQuickViewProduct(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [product, setQuickViewProduct]);

  if (!product) return null;

  const wished = wishlist.includes(product.id);
  const pct = savingsPct(product.price, product.retail);
  const specs = product.specs ?? {
    display: '6.3" OLED',
    storage: "256GB",
    chip: "Pro Chip",
    network: "5G Ready",
  };

  const handleAdd = () => {
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      setQuickViewProduct(null);
      setCartOpen(true);
    }, 600);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[90] flex items-end justify-center p-0 sm:items-center sm:p-4"
    >
      <div
        onClick={() => setQuickViewProduct(null)}
        className="absolute inset-0 bg-navy-950/65 backdrop-blur-sm"
      />

      {/* Modal Card — matching top-middle product detail screen in the reference */}
      <div className="relative z-10 flex max-h-[92dvh] w-full max-w-2xl flex-col overflow-hidden rounded-t-[28px] bg-white shadow-2xl ring-1 ring-line sm:rounded-[32px]">
        <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
          <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-brand-600">
            <BadgeCheck className="size-4" /> 72-Point Certified Device Spec Sheet
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleWishlist(product.id)}
              aria-label="Toggle favorite"
              className="grid size-9 place-items-center rounded-full bg-surface text-slate-600 hover:text-rose-500"
            >
              <Heart className={clsx("size-4", wished && "fill-rose-500 text-rose-500")} />
            </button>
            <button
              onClick={() => setQuickViewProduct(null)}
              aria-label="Close quick view"
              className="grid size-9 place-items-center rounded-full bg-surface text-slate-600 hover:bg-rose-50 hover:text-rose-600"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        <div className="grid flex-1 gap-6 overflow-y-auto p-5 sm:grid-cols-[0.95fr_1.05fr] sm:p-6">
          {/* Left: Image & Condition */}
          <div className="flex flex-col gap-3">
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-surface ring-1 ring-line">
              <Image src={product.image} alt={product.name} fill sizes="340px" className="object-cover" />
              <div className="absolute left-3 top-3 flex gap-1.5">
                <span className="rounded-full bg-brand-600 px-2.5 py-1 text-[11px] font-extrabold text-white">
                  {product.condition} Grade
                </span>
                {product.battery && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-extrabold text-emerald-600 shadow">
                    <BatteryFull className="size-3.5" /> {product.battery}%
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-emerald-50/80 px-3.5 py-2.5 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-200">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="size-4 text-emerald-600" /> 12-Month Warranty Included
              </span>
              <span className="font-extrabold">Only {product.stock} left</span>
            </div>
          </div>

          {/* Right: Specs & Controls (matching reference screen) */}
          <div className="flex flex-col">
            <span className="text-xs font-extrabold uppercase tracking-wider text-brand-600">
              {product.brand}
            </span>
            <h2 className="mt-0.5 text-2xl font-extrabold tracking-tight text-ink">{product.name}</h2>
            <p className="text-xs font-medium text-muted">{product.variant}</p>

            <div className="mt-2">
              <Stars rating={product.rating} reviews={product.reviews} size={13} />
            </div>

            <div className="mt-3 flex items-baseline gap-2.5">
              <span className="text-3xl font-extrabold text-ink">{formatPrice(product.price)}</span>
              <span className="text-sm text-slate-400 line-through">{formatPrice(product.retail)}</span>
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-extrabold text-emerald-700">
                Save {pct}%
              </span>
            </div>

            <p className="mt-3 text-xs leading-relaxed text-muted">
              The {product.name} delivers flagship performance, ultrasonically cleaned and verified across 72 hardware checkpoints with a guaranteed healthy battery.
            </p>

            {/* 4-column spec grid matching reference */}
            <div className="mt-4 grid grid-cols-4 gap-2">
              {[
                { val: specs.display, label: "Display" },
                { val: specs.storage, label: "Storage" },
                { val: specs.chip, label: "Processor" },
                { val: specs.network, label: "Network" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl bg-surface p-2 text-center ring-1 ring-line"
                >
                  <p className="truncate text-xs font-extrabold text-ink">{s.val}</p>
                  <p className="text-[10px] text-muted">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Color Swatches */}
            <div className="mt-4">
              <p className="text-xs font-bold text-ink">
                Finish: <span className="font-normal text-muted">{swatches[selectedColor].name}</span>
              </p>
              <div className="mt-2 flex items-center gap-2.5">
                {swatches.map((sw, idx) => (
                  <button
                    key={sw.name}
                    type="button"
                    onClick={() => setSelectedColor(idx)}
                    aria-label={sw.name}
                    className={clsx(
                      "size-6 rounded-full transition-transform",
                      selectedColor === idx ? "scale-110 ring-2 ring-brand-600 ring-offset-2" : "opacity-75 hover:opacity-100",
                    )}
                    style={{ backgroundColor: sw.hex }}
                  />
                ))}
              </div>
            </div>

            {/* Quantity + Add to Cart Bar */}
            <div className="mt-auto flex items-center gap-3 pt-5">
              <div className="flex h-12 items-center gap-3 rounded-full bg-surface px-3.5 ring-1 ring-line">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="grid size-7 place-items-center rounded-full bg-white text-ink shadow-xs"
                >
                  <Minus className="size-3.5" />
                </button>
                <span className="min-w-4 text-center text-sm font-extrabold text-ink">{qty}</span>
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                  aria-label="Increase quantity"
                  className="grid size-7 place-items-center rounded-full bg-white text-ink shadow-xs"
                >
                  <Plus className="size-3.5" />
                </button>
              </div>

              <button
                type="button"
                onClick={handleAdd}
                className={clsx(
                  "flex h-12 flex-1 items-center justify-center gap-2 rounded-full text-sm font-extrabold text-white shadow-lg transition",
                  added ? "bg-emerald-500" : "bg-brand-600 shadow-brand-600/35 hover:bg-brand-700",
                )}
              >
                {added ? (
                  <>
                    <Check className="size-4" /> Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingBag className="size-4" /> Add to Cart · {formatPrice(product.price * qty)}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
