"use client";

import { Suspense, useMemo, useRef, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import clsx from "clsx";
import {
  Search,
  SlidersHorizontal,
  X,
  Smartphone,
  BatteryFull,
  Sparkles,
  RotateCcw,
  BadgeCheck,
} from "lucide-react";
import AnnouncementBar from "@/components/landing/AnnouncementBar";
import Navbar from "@/components/landing/Navbar";
import NewsletterFooter from "@/components/landing/NewsletterFooter";
import ProductCard from "@/components/product/ProductCard";
import {
  products,
  categories,
  brandList,
  formatPrice,
  type Category,
  type Condition,
} from "@/lib/products";
import { gsap, useGSAP } from "@/lib/gsap";

type SortKey = "featured" | "price-asc" | "price-desc" | "battery" | "savings";

function ShopInventoryContent() {
  const searchParams = useSearchParams();
  const gridRef = useRef<HTMLDivElement>(null);

  const initialCat = (searchParams.get("category") as Category | "all") || "all";
  const initialBrand = searchParams.get("brand") || "All";
  const initialQuery = searchParams.get("q") || "";

  const [category, setCategory] = useState<Category | "all">(
    categories.some((c) => c.key === initialCat) ? initialCat : "all",
  );
  const [brand, setBrand] = useState<string>(initialBrand);
  const [condition, setCondition] = useState<Condition | "All">("All");
  const [maxPrice, setMaxPrice] = useState<number>(1200);
  const [minBattery, setMinBattery] = useState<number>(0);
  const [query, setQuery] = useState<string>(initialQuery);
  const [sortBy, setSortBy] = useState<SortKey>("featured");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Sync URL query params when navigating from Navbar mega-menu or BrandStrip
  useEffect(() => {
    const c = searchParams.get("category") as Category | "all" | null;
    const b = searchParams.get("brand");
    const q = searchParams.get("q");
    if (c && categories.some((item) => item.key === c)) setCategory(c);
    if (b) setBrand(b);
    if (q !== null) setQuery(q);
  }, [searchParams]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = products.filter((p) => {
      if (category !== "all" && p.category !== category) return false;
      if (brand !== "All" && p.brand.toLowerCase() !== brand.toLowerCase()) return false;
      if (condition !== "All" && p.condition !== condition) return false;
      if (p.price > maxPrice) return false;
      if (minBattery > 0 && (p.battery ?? 100) < minBattery) return false;
      if (q) {
        const hay = `${p.name} ${p.brand} ${p.variant} ${p.category}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    return [...list].sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "battery") return (b.battery ?? 0) - (a.battery ?? 0);
      if (sortBy === "savings") return (b.retail - b.price) - (a.retail - a.price);
      return 0;
    });
  }, [category, brand, condition, maxPrice, minBattery, query, sortBy]);

  useGSAP(
    () => {
      if (!gridRef.current) return;
      const cards = gridRef.current.querySelectorAll("[data-card]");
      if (!cards.length) return;
      gsap.fromTo(
        cards,
        { y: 28, opacity: 0, scale: 0.97 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          stagger: 0.04,
          duration: 0.65,
          ease: "expo.out",
          overwrite: "auto",
        },
      );
    },
    { scope: gridRef, dependencies: [category, brand, condition, maxPrice, minBattery, query, sortBy] },
  );

  const resetFilters = () => {
    setCategory("all");
    setBrand("All");
    setCondition("All");
    setMaxPrice(1200);
    setMinBattery(0);
    setQuery("");
    setSortBy("featured");
  };

  const phoneCount = products.filter((p) => p.category === "phones").length;

  const FilterControls = (
    <div className="space-y-6">
      {/* Phones quick filter callout */}
      <div className="rounded-2xl bg-gradient-to-br from-navy-950 to-brand-800 p-4 text-white">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-brand-200">
            <Smartphone className="size-4" /> Phone Inventory
          </span>
          <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-bold">
            {phoneCount} Models
          </span>
        </div>
        <p className="mt-1.5 text-xs text-white/75">
          Looking strictly for smartphones? Filter to unlocked iPhones, Samsung Galaxy, Pixel &amp; Xiaomi.
        </p>
        <button
          type="button"
          onClick={() => setCategory(category === "phones" ? "all" : "phones")}
          className={clsx(
            "mt-3 flex h-9 w-full items-center justify-center rounded-xl text-xs font-extrabold transition",
            category === "phones"
              ? "bg-emerald-400 text-navy-950"
              : "bg-white text-navy-950 hover:bg-brand-50",
          )}
        >
          {category === "phones" ? "✓ Showing Phones Only (Show All)" : `Show All ${phoneCount} Phones`}
        </button>
      </div>

      {/* Brand Filter */}
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-ink">Brand</h3>
          {brand !== "All" && (
            <button onClick={() => setBrand("All")} className="text-[11px] font-bold text-brand-600">
              Reset
            </button>
          )}
        </div>
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {brandList.map((b) => {
            const active = brand.toLowerCase() === b.toLowerCase();
            return (
              <button
                key={b}
                type="button"
                onClick={() => setBrand(b)}
                className={clsx(
                  "rounded-xl px-3 py-1.5 text-xs font-bold transition",
                  active
                    ? "bg-brand-600 text-white shadow-sm shadow-brand-600/30"
                    : "bg-surface text-slate-600 ring-1 ring-line hover:bg-brand-50 hover:text-brand-600",
                )}
              >
                {b}
              </button>
            );
          })}
        </div>
      </div>

      {/* Cosmetic Condition */}
      <div>
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-ink">Cosmetic Condition</h3>
        <div className="mt-2.5 grid grid-cols-2 gap-2">
          {(["All", "Mint", "Excellent", "Good"] as const).map((cond) => {
            const active = condition === cond;
            return (
              <button
                key={cond}
                type="button"
                onClick={() => setCondition(cond)}
                className={clsx(
                  "flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold transition",
                  active
                    ? "bg-brand-600 text-white shadow-sm"
                    : "bg-surface text-slate-600 ring-1 ring-line hover:text-ink",
                )}
              >
                {cond !== "All" && (
                  <span
                    className={clsx(
                      "size-2 rounded-full",
                      cond === "Mint" && "bg-emerald-400",
                      cond === "Excellent" && "bg-brand-300",
                      cond === "Good" && "bg-amber-400",
                    )}
                  />
                )}
                {cond}
              </button>
            );
          })}
        </div>
      </div>

      {/* Max Price Slider */}
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-ink">Max Price</h3>
          <span className="text-sm font-extrabold text-brand-600">{formatPrice(maxPrice)}</span>
        </div>
        <input
          type="range"
          min={150}
          max={1200}
          step={25}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="mt-2.5 w-full accent-brand-600"
        />
        <div className="mt-1 flex justify-between text-[11px] font-semibold text-muted">
          <span>$150</span>
          <span>$600</span>
          <span>$1,200</span>
        </div>
      </div>

      {/* Minimum Battery Health */}
      <div>
        <h3 className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-ink">
          <BatteryFull className="size-4 text-emerald-600" /> Minimum Battery Health
        </h3>
        <div className="mt-2.5 grid grid-cols-4 gap-1.5">
          {[
            { label: "Any", val: 0 },
            { label: "85%+", val: 85 },
            { label: "90%+", val: 90 },
            { label: "95%+", val: 95 },
          ].map((b) => (
            <button
              key={b.label}
              type="button"
              onClick={() => setMinBattery(b.val)}
              className={clsx(
                "rounded-xl py-2 text-xs font-extrabold transition",
                minBattery === b.val
                  ? "bg-emerald-600 text-white"
                  : "bg-surface text-slate-600 ring-1 ring-line hover:text-ink",
              )}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

      {/* Reset All */}
      <button
        type="button"
        onClick={resetFilters}
        className="flex h-10 w-full items-center justify-center gap-1.5 rounded-xl bg-surface text-xs font-extrabold text-slate-600 ring-1 ring-line transition hover:bg-rose-50 hover:text-rose-600"
      >
        <RotateCcw className="size-3.5" /> Reset All Filters
      </button>
    </div>
  );

  return (
    <main className="container-x flex-1 py-6 md:py-10">
      {/* Inventory Header Banner */}
      <div className="noise relative overflow-hidden rounded-[28px] bg-gradient-to-r from-navy-950 via-navy-900 to-brand-700 p-6 text-white shadow-xl md:p-10">
        <div className="pointer-events-none absolute -right-12 -top-20 size-80 rounded-full bg-brand-400/25 blur-3xl" />
        <div className="relative z-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-extrabold uppercase tracking-widest text-brand-200 ring-1 ring-white/15">
              <BadgeCheck className="size-3.5 text-emerald-300" /> Certified Pre-Owned Inventory
            </span>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-5xl">
              All Available <span className="text-shimmer">Phones &amp; Gadgets</span>
            </h1>
            <p className="mt-2 max-w-xl text-sm text-white/75 sm:text-base">
              Every device in our live catalog is unlocked, IMEI-verified clean, tested across 72 hardware points, and backed by a 12-month warranty.
            </p>
          </div>

          {/* Search input inside banner */}
          <div className="w-full max-w-md">
            <div className="relative flex items-center">
              <Search className="pointer-events-none absolute left-4 size-4 text-white/60" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search iPhone 15, Galaxy S23, Pixel, 256GB…"
                className="h-12 w-full rounded-2xl bg-white/12 pl-11 pr-10 text-sm font-medium text-white placeholder:text-white/55 ring-1 ring-white/20 backdrop-blur outline-none focus:bg-white/18 focus:ring-2 focus:ring-brand-300"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="absolute right-3 rounded-full p-1 text-white/70 hover:text-white"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Category Pills + Sort Bar */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div className="no-scrollbar flex max-w-full items-center gap-2 overflow-x-auto pb-1">
          {categories.map((c) => {
            const active = category === c.key;
            const count =
              c.key === "all"
                ? products.length
                : products.filter((p) => p.category === c.key).length;
            return (
              <button
                key={c.key}
                onClick={() => setCategory(c.key)}
                className={clsx(
                  "shrink-0 rounded-full px-4 py-2 text-xs font-extrabold transition md:text-sm",
                  active
                    ? "bg-brand-600 text-white shadow-lg shadow-brand-600/30"
                    : "bg-white text-slate-600 ring-1 ring-line hover:bg-brand-50 hover:text-brand-600",
                )}
              >
                {c.label} <span className="opacity-70">({count})</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(true)}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-white px-4 text-xs font-extrabold text-ink ring-1 ring-line lg:hidden"
          >
            <SlidersHorizontal className="size-3.5 text-brand-600" />
            Filters
          </button>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortKey)}
            aria-label="Sort inventory"
            className="h-10 rounded-full bg-white px-4 text-xs font-extrabold text-ink ring-1 ring-line outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="featured">Sort: Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="battery">Battery Health: Highest</option>
            <option value="savings">Biggest Savings</option>
          </select>
        </div>
      </div>

      {/* Main Layout: Sidebar Filters + Product Grid */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[270px_1fr]">
        {/* Desktop Sidebar */}
        <aside className="hidden h-fit rounded-[26px] bg-white p-5 shadow-xs ring-1 ring-line lg:sticky lg:top-24 lg:block">
          {FilterControls}
        </aside>

        {/* Product Grid Area */}
        <div>
          {/* Active filter summary bar */}
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-white px-4 py-3 text-xs ring-1 ring-line">
            <span className="font-bold text-ink">
              Showing <strong className="text-brand-600">{filtered.length}</strong> of {products.length} certified devices
            </span>
            <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-700">
              <Sparkles className="size-3.5 text-emerald-600" /> Tap any device photo for full specs
            </span>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-[28px] bg-white p-12 text-center ring-1 ring-line">
              <Smartphone className="mx-auto size-10 text-brand-500" />
              <h2 className="mt-3 text-lg font-extrabold text-ink">No devices match those exact filters</h2>
              <p className="mt-1 text-xs text-muted">
                Try broadening your price range or resetting the brand/condition filters.
              </p>
              <button
                onClick={resetFilters}
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand-600 px-6 py-2.5 text-xs font-extrabold text-white shadow-lg shadow-brand-600/30"
              >
                <RotateCcw className="size-3.5" /> Show All {products.length} Devices
              </button>
            </div>
          ) : (
            <div ref={gridRef} className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <div
        className={clsx(
          "fixed inset-0 z-[75] transition-all duration-300 lg:hidden",
          mobileFiltersOpen ? "visible" : "invisible pointer-events-none",
        )}
      >
        <div
          onClick={() => setMobileFiltersOpen(false)}
          className={clsx(
            "absolute inset-0 bg-navy-950/60 backdrop-blur-sm transition-opacity",
            mobileFiltersOpen ? "opacity-100" : "opacity-0",
          )}
        />
        <div
          className={clsx(
            "absolute inset-x-0 bottom-0 max-h-[85dvh] overflow-y-auto rounded-t-[28px] bg-white p-5 shadow-2xl transition-transform duration-300",
            mobileFiltersOpen ? "translate-y-0" : "translate-y-full",
          )}
        >
          <div className="mb-4 flex items-center justify-between border-b border-line pb-3">
            <h3 className="text-base font-extrabold text-ink">Filter Inventory ({filtered.length})</h3>
            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="grid size-8 place-items-center rounded-full bg-surface text-slate-600"
            >
              <X className="size-4" />
            </button>
          </div>
          {FilterControls}
          <button
            onClick={() => setMobileFiltersOpen(false)}
            className="mt-5 flex h-12 w-full items-center justify-center rounded-full bg-brand-600 text-sm font-extrabold text-white"
          >
            View {filtered.length} Matching Devices
          </button>
        </div>
      </div>
    </main>
  );
}

export default function ShopPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F4F7FE]">
      <AnnouncementBar />
      <Navbar />
      <Suspense
        fallback={
          <div className="container-x flex-1 py-12 text-center text-sm font-bold text-muted">
            Loading certified inventory…
          </div>
        }
      >
        <ShopInventoryContent />
      </Suspense>
      <NewsletterFooter />
    </div>
  );
}
