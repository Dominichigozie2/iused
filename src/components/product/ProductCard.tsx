"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import clsx from "clsx";
import { Heart, ShoppingBag, Check, BatteryFull, Eye, Flame } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useStore } from "@/store/useStore";
import { formatPrice, savingsPct, type Product } from "@/lib/products";
import Stars from "@/components/ui/Stars";

const conditionStyle: Record<Product["condition"], string> = {
  Mint: "bg-emerald-500",
  Excellent: "bg-brand-500",
  Good: "bg-amber-500",
};

type Props = {
  product: Product;
  deal?: { dealPrice: number; sold: number };
};

/** Flies a ghost image of the product into the cart icon in the navbar. */
function flyToCart(source: HTMLElement, src: string, onArrive: () => void) {
  const target = document.getElementById("cart-target");
  if (!target) return onArrive();
  const s = source.getBoundingClientRect();
  const t = target.getBoundingClientRect();
  const ghost = document.createElement("img");
  ghost.src = src;
  Object.assign(ghost.style, {
    position: "fixed",
    left: `${s.left}px`,
    top: `${s.top}px`,
    width: `${s.width}px`,
    height: `${s.height}px`,
    objectFit: "cover",
    borderRadius: "20px",
    zIndex: "200",
    pointerEvents: "none",
    boxShadow: "0 20px 50px -10px rgba(29,79,240,.55)",
  } as CSSStyleDeclaration);
  document.body.appendChild(ghost);

  const dx = t.left + t.width / 2 - (s.left + s.width / 2);
  const dy = t.top + t.height / 2 - (s.top + s.height / 2);

  gsap
    .timeline({
      onComplete: () => {
        ghost.remove();
        onArrive();
        gsap.fromTo(target, { scale: 1.35 }, { scale: 1, duration: 0.7, ease: "elastic.out(1.2, 0.35)" });
      },
    })
    .to(ghost, { scale: 0.55, borderRadius: "50%", duration: 0.25, ease: "power2.out" })
    .to(ghost, { x: dx, duration: 0.85, ease: "power1.inOut" }, 0.15)
    .to(ghost, { y: dy, duration: 0.85, ease: "back.in(1.4)" }, 0.15)
    .to(ghost, { scale: 0.08, opacity: 0.6, rotation: 25, duration: 0.85, ease: "power2.in" }, 0.15);
}

export default function ProductCard({ product, deal }: Props) {
  const card = useRef<HTMLDivElement>(null);
  const imgWrap = useRef<HTMLDivElement>(null);
  const heartRef = useRef<HTMLButtonElement>(null);
  const [added, setAdded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const addToCart = useStore((s) => s.addToCart);
  const toggleWishlist = useStore((s) => s.toggleWishlist);
  const setQuickViewProduct = useStore((s) => s.setQuickViewProduct);
  const wished = useStore((s) => s.wishlist.includes(product.id));

  useEffect(() => setMounted(true), []);

  const price = deal?.dealPrice ?? product.price;
  const compareAt = deal ? product.price : product.retail;
  const pct = savingsPct(price, deal ? product.price : product.retail);
  const lowStock = product.stock <= 4;

  // 3D tilt + spotlight
  useGSAP(
    (_, contextSafe) => {
      const el = card.current;
      if (!el || !contextSafe || window.matchMedia("(pointer: coarse)").matches) return;
      gsap.set(el, { transformPerspective: 900 });
      const rx = gsap.quickTo(el, "rotationX", { duration: 0.6, ease: "power3.out" });
      const ry = gsap.quickTo(el, "rotationY", { duration: 0.6, ease: "power3.out" });
      const img = el.querySelector("[data-card-img]");

      const move = contextSafe((e: MouseEvent) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        el.style.setProperty("--mx", `${px * 100}%`);
        el.style.setProperty("--my", `${py * 100}%`);
        rx((0.5 - py) * 8);
        ry((px - 0.5) * 10);
      });
      const enter = contextSafe(() => {
        gsap.to(img, { scale: 1.08, duration: 1.2, ease: "expo.out" });
        gsap.to(el.querySelectorAll("[data-hover-chip]"), { y: 0, opacity: 1, stagger: 0.05, duration: 0.5, ease: "back.out(2)" });
      });
      const leave = contextSafe(() => {
        rx(0);
        ry(0);
        gsap.to(img, { scale: 1, duration: 1, ease: "expo.out" });
        gsap.to(el.querySelectorAll("[data-hover-chip]"), { y: 10, opacity: 0, duration: 0.3 });
      });
      el.addEventListener("mousemove", move);
      el.addEventListener("mouseenter", enter);
      el.addEventListener("mouseleave", leave);
      return () => {
        el.removeEventListener("mousemove", move);
        el.removeEventListener("mouseenter", enter);
        el.removeEventListener("mouseleave", leave);
      };
    },
    { scope: card },
  );

  const handleAdd = () => {
    if (added || !imgWrap.current) return;
    setAdded(true);
    flyToCart(imgWrap.current, product.image, () => addToCart({ ...product, price }));
    setTimeout(() => setAdded(false), 1800);
  };

  const handleWish = () => {
    toggleWishlist(product.id);
    const btn = heartRef.current;
    if (!btn) return;
    gsap.fromTo(btn, { scale: 0.6 }, { scale: 1, duration: 0.7, ease: "elastic.out(1.4, 0.4)" });
    if (!wished) {
      // particle burst
      for (let i = 0; i < 8; i++) {
        const p = document.createElement("span");
        p.className = "pointer-events-none absolute left-1/2 top-1/2 size-1.5 rounded-full bg-rose-500";
        btn.appendChild(p);
        const a = (i / 8) * Math.PI * 2;
        gsap.fromTo(
          p,
          { x: -3, y: -3, scale: 1, opacity: 1 },
          { x: Math.cos(a) * 22 - 3, y: Math.sin(a) * 22 - 3, scale: 0, opacity: 0, duration: 0.6, ease: "power3.out", onComplete: () => p.remove() },
        );
      }
    }
  };

  return (
    <div data-card className="h-full">
      <div
        ref={card}
        className="spotlight group relative flex h-full flex-col rounded-[26px] bg-white p-2.5 ring-1 ring-line transition-shadow duration-500 will-change-transform hover:shadow-[0_30px_60px_-25px_rgba(13,33,112,0.35)] hover:ring-brand-200"
      >
        {/* Image */}
        <div
          ref={imgWrap}
          onClick={() => setQuickViewProduct({ ...product, price })}
          className="relative aspect-[1/1.02] cursor-pointer overflow-hidden rounded-[20px] bg-surface"
        >
          <div data-card-img className="absolute inset-0 will-change-transform">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />

          {/* Top badges */}
          <div className="absolute left-2.5 top-2.5 z-[2] flex flex-col items-start gap-1.5">
            {deal ? (
              <span className="rounded-full bg-rose-500 px-2.5 py-1 text-[11px] font-extrabold text-white shadow-lg shadow-rose-500/30">
                -{pct}%
              </span>
            ) : (
              product.badge && (
                <span className="flex items-center gap-1 rounded-full bg-brand-600 px-2.5 py-1 text-[11px] font-bold text-white shadow-lg shadow-brand-600/30">
                  {product.badge === "Hot" && <Flame className="size-3" />}
                  {product.badge}
                </span>
              )
            )}
          </div>
          <button
            ref={heartRef}
            onClick={(e) => {
              e.stopPropagation();
              handleWish();
            }}
            aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
            className="absolute right-2.5 top-2.5 z-[2] grid size-9 place-items-center rounded-full bg-white/90 text-slate-600 shadow-md backdrop-blur transition hover:text-rose-500"
          >
            <Heart className={clsx("size-4 transition-colors", mounted && wished && "fill-rose-500 text-rose-500")} />
          </button>

          {/* Bottom chips */}
          <div className="absolute inset-x-2.5 bottom-2.5 z-[2] flex items-center justify-between gap-2">
            <span className="flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-ink backdrop-blur">
              <span className={clsx("size-1.5 rounded-full", conditionStyle[product.condition])} />
              {product.condition}
            </span>
            {product.battery && (
              <span className="flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-emerald-600 backdrop-blur">
                <BatteryFull className="size-3.5" />
                {product.battery}%
              </span>
            )}
          </div>

          {/* Hover-only social proof */}
          <span
            data-hover-chip
            className="absolute left-1/2 top-1/2 z-[2] hidden -translate-x-1/2 -translate-y-1/2 translate-y-[10px] items-center gap-1.5 whitespace-nowrap rounded-full bg-navy-900/80 px-3 py-1.5 text-[11px] font-semibold text-white opacity-0 backdrop-blur md:flex"
          >
            <Eye className="size-3.5 text-brand-300" /> {product.viewers} people viewing
          </span>
        </div>

        {/* Body */}
        <div className="relative z-[2] flex flex-1 flex-col px-1.5 pb-1 pt-3.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-600">{product.brand}</span>
            <Stars rating={product.rating} reviews={product.reviews} size={11} />
          </div>
          <button
            type="button"
            onClick={() => setQuickViewProduct({ ...product, price })}
            className="mt-1.5 line-clamp-1 text-left text-[15px] font-bold text-ink transition hover:text-brand-600"
          >
            {product.name}
          </button>
          <p className="line-clamp-1 text-xs text-muted">{product.variant}</p>

          <div className="mt-3 flex flex-wrap items-baseline gap-x-2">
            <span className="text-xl font-extrabold tracking-tight text-ink">{formatPrice(price)}</span>
            <span className="text-xs text-slate-400 line-through">{formatPrice(compareAt)}</span>
            {!deal && <span className="text-[11px] font-bold text-emerald-600">Save {pct}%</span>}
          </div>

          {deal ? (
            <div className="mt-2.5">
              <div className="mb-1 flex justify-between text-[11px] font-semibold">
                <span className="text-rose-500">Only {product.stock} left!</span>
                <span className="text-muted">{deal.sold} sold</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-rose-100">
                <div
                  data-stock-bar
                  className="h-full origin-left rounded-full bg-gradient-to-r from-rose-500 to-orange-400"
                  style={{ width: `${(deal.sold / (deal.sold + product.stock)) * 100}%` }}
                />
              </div>
            </div>
          ) : (
            lowStock && (
              <p className="mt-2 flex items-center gap-1.5 text-[11px] font-semibold text-rose-500">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-rose-400 opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-rose-500" />
                </span>
                Only {product.stock} left in stock
              </p>
            )
          )}

          <div className="mt-auto pt-3.5">
            <button
              onClick={handleAdd}
              className={clsx(
                "group/btn relative flex h-11 w-full items-center justify-center gap-2 overflow-hidden rounded-xl text-sm font-bold text-white transition-all duration-300 active:scale-[0.97]",
                added ? "bg-emerald-500" : "bg-brand-600",
              )}
            >
              <span className="absolute inset-0 origin-bottom scale-y-0 bg-navy-900 transition-transform duration-500 ease-[cubic-bezier(.7,0,.2,1)] group-hover/btn:scale-y-100" />
              <span className={clsx("relative flex items-center gap-2 transition-transform duration-300", added && "-translate-y-10")}>
                <ShoppingBag className="size-4" /> Add to Cart
              </span>
              <span className={clsx("absolute flex items-center gap-2 transition-transform duration-300", added ? "translate-y-0" : "translate-y-10")}>
                <Check className="size-4" /> Added to bag
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
