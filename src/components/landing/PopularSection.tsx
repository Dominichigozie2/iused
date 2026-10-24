"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { ArrowRight, Sparkles } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import { products, categories, type Category } from "@/lib/products";
import ProductCard from "@/components/product/ProductCard";
import SectionHeading from "@/components/ui/SectionHeading";

export default function PopularSection() {
  const ref = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [activeCat, setActiveCat] = useState<Category | "all">("all");
  const [brandFilter, setBrandFilter] = useState<string | null>(null);

  const filtered = products
    .filter((p) => (activeCat === "all" ? true : p.category === activeCat))
    .filter((p) => (brandFilter ? p.brand.toLowerCase() === brandFilter.toLowerCase() : true))
    .slice(0, 8);

  useGSAP(
    () => {
      if (!gridRef.current) return;
      const cards = gridRef.current.querySelectorAll("[data-card]");
      if (!cards.length) return;
      gsap.fromTo(
        cards,
        { y: 36, opacity: 0, scale: 0.96 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          stagger: 0.06,
          duration: 0.75,
          ease: "expo.out",
          overwrite: "auto",
        },
      );
    },
    { scope: ref, dependencies: [activeCat, brandFilter] },
  );

  return (
    <section id="popular" ref={ref} className="container-x py-14 md:py-20">
      <SectionHeading
        eyebrow="Curated Inventory"
        title="Popular"
        highlight="Smartphones & Gadgets"
        subtitle="Discover the most loved certified pre-owned devices by our customers — battery health 85%+ guaranteed."
        action={
          <Link
            href={activeCat === "all" ? "/shop" : `/shop?category=${activeCat}`}
            className="group inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-bold text-brand-600 ring-1 ring-line transition hover:bg-brand-600 hover:text-white"
          >
            View All Inventory ({products.length})
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        }
      />

      {/* Category Filter Pills */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div className="no-scrollbar flex max-w-full items-center gap-2 overflow-x-auto pb-1">
          {categories.map((c) => {
            const active = activeCat === c.key;
            return (
              <button
                key={c.key}
                onClick={() => {
                  setActiveCat(c.key);
                  setBrandFilter(null);
                }}
                className={clsx(
                  "relative shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-all duration-300 md:text-sm",
                  active
                    ? "bg-brand-600 text-white shadow-lg shadow-brand-600/30"
                    : "bg-white text-slate-600 ring-1 ring-line hover:bg-brand-50 hover:text-brand-600",
                )}
              >
                {c.label}
              </button>
            );
          })}
        </div>

        <div className="hidden items-center gap-2 rounded-full bg-emerald-50 px-3.5 py-1.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200 sm:inline-flex">
          <Sparkles className="size-3.5 text-emerald-600" />
          Live stock · Ships within 24h
        </div>
      </div>

      {/* Product Grid */}
      <div ref={gridRef} className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
