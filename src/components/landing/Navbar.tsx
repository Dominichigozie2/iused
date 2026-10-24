"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import {
  Search,
  Heart,
  ShoppingBag,
  ChevronDown,
  Menu,
  X,
  Smartphone,
  Laptop,
  Tablet,
  Watch,
  Headphones,
  Gamepad2,
  ArrowRight,
} from "lucide-react";
import Logo from "@/components/ui/Logo";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useStore, cartCount } from "@/store/useStore";

const links = [
  { label: "Home", href: "/" },
  { label: "Inventory", href: "/shop", mega: true },
  { label: "Deals", href: "/#deals" },
  { label: "Trade-in", href: "/#trade-in" },
  { label: "Why iUsed", href: "/#promise" },
];

const megaCats = [
  { icon: Smartphone, label: "Phones", key: "phones", count: "1,240+" },
  { icon: Laptop, label: "Laptops", key: "laptops", count: "380+" },
  { icon: Tablet, label: "Tablets", key: "tablets", count: "290+" },
  { icon: Watch, label: "Wearables", key: "wearables", count: "410+" },
  { icon: Headphones, label: "Audio", key: "audio", count: "560+" },
  { icon: Gamepad2, label: "Gaming", key: "gaming", count: "170+" },
];

export default function Navbar() {
  const ref = useRef<HTMLElement>(null);
  const badgeRef = useRef<HTMLSpanElement>(null);
  const wishBadgeRef = useRef<HTMLSpanElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);

  const cart = useStore((s) => s.cart);
  const wishlist = useStore((s) => s.wishlist);
  const setCartOpen = useStore((s) => s.setCartOpen);
  const setWishlistOpen = useStore((s) => s.setWishlistOpen);
  const introDone = useStore((s) => s.introDone);
  const count = mounted ? cartCount(cart) : 0;
  const wishCount = mounted ? wishlist.length : 0;

  useEffect(() => setMounted(true), []);

  // Hide on scroll down, reveal on scroll up
  useGSAP(
    () => {
      const st = ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          const y = self.scroll();
          setScrolled(y > 40);
          if (y < 200) gsap.to(ref.current, { yPercent: 0, duration: 0.4, overwrite: "auto" });
          else gsap.to(ref.current, { yPercent: self.direction === 1 ? -130 : 0, duration: 0.5, ease: "power3.out", overwrite: "auto" });
        },
      });
      return () => st.kill();
    },
    { scope: ref },
  );

  // Intro entrance
  useGSAP(
    () => {
      if (!introDone) return;
      gsap.from("[data-nav-item]", { y: -24, opacity: 0, stagger: 0.05, duration: 0.8, ease: "expo.out", delay: 0.2 });
    },
    { scope: ref, dependencies: [introDone] },
  );

  // Badge bounce when cart count changes
  useEffect(() => {
    if (!badgeRef.current || count === 0) return;
    gsap.fromTo(badgeRef.current, { scale: 0.4 }, { scale: 1, duration: 0.6, ease: "elastic.out(1.2, 0.4)" });
  }, [count]);

  // Badge bounce when wishlist count changes
  useEffect(() => {
    if (!wishBadgeRef.current || wishCount === 0) return;
    gsap.fromTo(wishBadgeRef.current, { scale: 0.4 }, { scale: 1, duration: 0.6, ease: "elastic.out(1.2, 0.4)" });
  }, [wishCount]);

  // Mobile menu stagger
  useEffect(() => {
    if (!mobileOpen) return;
    gsap.fromTo("[data-mobile-link]", { y: 40, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.06, duration: 0.7, ease: "expo.out" });
  }, [mobileOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    router.push(q ? `/shop?q=${encodeURIComponent(q)}` : "/shop");
    setSearchOpen(false);
  };

  return (
    <>
      <header ref={ref} className="sticky top-0 z-40 px-2 pt-2 md:px-4 md:pt-3">
        <nav
          className={clsx(
            "container-x relative flex h-16 items-center justify-between rounded-2xl transition-all duration-500",
            scrolled ? "glass shadow-[0_10px_40px_-12px_rgba(13,33,112,0.25)] ring-1 ring-white/60" : "bg-white shadow-sm ring-1 ring-line",
          )}
        >
          <div data-nav-item>
            <Logo />
          </div>

          <ul className="hidden items-center gap-1 lg:flex">
            {links.map((l) => {
              const isActive =
                (l.href === "/" && pathname === "/") ||
                (l.href === "/shop" && pathname.startsWith("/shop"));
              return (
                <li
                  key={l.label}
                  data-nav-item
                  onMouseEnter={() => l.mega && setMegaOpen(true)}
                  onMouseLeave={() => l.mega && setMegaOpen(false)}
                  className="relative"
                >
                  <Link
                    href={l.href}
                    className={clsx(
                      "group relative flex items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                      isActive ? "bg-brand-50 text-brand-600" : "text-slate-600 hover:text-brand-600",
                    )}
                  >
                    {l.label}
                    {l.mega && <ChevronDown className={clsx("size-3.5 transition-transform", megaOpen && "rotate-180")} />}
                    {!isActive && (
                      <span className="absolute inset-x-4 -bottom-0.5 h-0.5 origin-left scale-x-0 rounded-full bg-brand-500 transition-transform duration-300 group-hover:scale-x-100" />
                    )}
                  </Link>

                  {l.mega && (
                    <div
                      className={clsx(
                        "absolute left-1/2 top-full w-[620px] -translate-x-1/2 pt-4 transition-all duration-300",
                        megaOpen ? "visible translate-y-0 opacity-100" : "invisible translate-y-2 opacity-0",
                      )}
                    >
                      <div className="grid grid-cols-[1fr_220px] gap-4 rounded-3xl bg-white p-4 shadow-2xl shadow-brand-900/15 ring-1 ring-line">
                        <div className="grid grid-cols-2 gap-1">
                          {megaCats.map(({ icon: Icon, label, key, count: c }) => (
                            <Link
                              key={label}
                              href={`/shop?category=${key}`}
                              onClick={() => setMegaOpen(false)}
                              className="group/item flex items-center gap-3 rounded-2xl p-3 transition-colors hover:bg-brand-50"
                            >
                              <span className="grid size-10 place-items-center rounded-xl bg-surface text-brand-600 transition-all group-hover/item:bg-brand-600 group-hover/item:text-white">
                                <Icon className="size-5" />
                              </span>
                              <span>
                                <span className="block text-sm font-bold text-ink">{label}</span>
                                <span className="text-xs text-muted">{c} in stock</span>
                              </span>
                            </Link>
                          ))}
                        </div>
                        <Link
                          href="/shop"
                          onClick={() => setMegaOpen(false)}
                          className="group/card relative overflow-hidden rounded-2xl bg-navy-900 p-4 text-white"
                        >
                          <Image src="/images/hero-phone.jpg" alt="" fill sizes="220px" className="object-cover object-right opacity-70 transition-transform duration-700 group-hover/card:scale-110" />
                          <div className="relative flex h-full flex-col justify-between">
                            <span className="w-fit rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur">Full Catalog</span>
                            <div>
                              <p className="text-lg font-extrabold leading-tight">Browse all phones &amp; gadgets</p>
                              <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-brand-200">
                                Open Inventory <ArrowRight className="size-3 transition-transform group-hover/card:translate-x-1" />
                              </span>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-1 md:gap-2">
            <form onSubmit={handleSearchSubmit} data-nav-item className="relative hidden items-center md:flex">
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search iPhone 15, S23, MacBook…"
                onBlur={() => !searchQuery && setSearchOpen(false)}
                className={clsx(
                  "h-10 rounded-full bg-surface pl-10 pr-4 text-sm outline-none ring-brand-500/30 transition-all duration-500 focus:ring-4",
                  searchOpen ? "w-64 opacity-100" : "w-10 cursor-pointer opacity-100",
                )}
                onFocus={() => setSearchOpen(true)}
                aria-label="Search products"
              />
              <Search className="pointer-events-none absolute left-3 size-4 text-slate-500" />
            </form>

            {/* Favorites / Wishlist Modal Trigger */}
            <button
              data-nav-item
              type="button"
              aria-label="Open Favorites"
              onClick={() => setWishlistOpen(true)}
              className="relative grid size-10 place-items-center rounded-full text-slate-600 transition hover:bg-rose-50 hover:text-rose-500"
            >
              <Heart className={clsx("size-[18px] transition-colors", wishCount > 0 && "fill-rose-500 text-rose-500")} />
              <span
                ref={wishBadgeRef}
                className={clsx(
                  "absolute right-0.5 top-0.5 grid min-w-[18px] place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-bold leading-[18px] text-white ring-2 ring-white transition-opacity",
                  wishCount === 0 && "opacity-0",
                )}
              >
                {wishCount}
              </span>
            </button>

            {/* Cart Drawer Trigger */}
            <button
              data-nav-item
              id="cart-target"
              type="button"
              aria-label="Open cart"
              onClick={() => setCartOpen(true)}
              className="relative grid size-10 place-items-center rounded-full text-slate-600 transition hover:bg-brand-50 hover:text-brand-600"
            >
              <ShoppingBag className="size-[18px]" />
              <span
                ref={badgeRef}
                className={clsx(
                  "absolute right-0.5 top-0.5 grid min-w-[18px] place-items-center rounded-full bg-brand-600 px-1 text-[10px] font-bold leading-[18px] text-white ring-2 ring-white transition-opacity",
                  count === 0 && "opacity-0",
                )}
              >
                {count}
              </span>
            </button>

            <Link
              data-nav-item
              href="/dashboard"
              aria-label="My account"
              className="ml-1 hidden size-9 overflow-hidden rounded-full bg-gradient-to-br from-brand-400 to-brand-700 ring-2 ring-white shadow-md sm:grid sm:place-items-center"
            >
              <span className="text-xs font-bold text-white">SA</span>
            </Link>
            <button
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
              className="grid size-10 place-items-center rounded-full text-ink lg:hidden"
            >
              <Menu className="size-5" />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu */}
      <div
        className={clsx(
          "fixed inset-0 z-[60] bg-navy-950/95 backdrop-blur-xl transition-all duration-500 lg:hidden",
          mobileOpen ? "visible opacity-100" : "invisible opacity-0",
        )}
      >
        <div className="flex h-20 items-center justify-between px-5">
          <Logo light />
          <button aria-label="Close menu" onClick={() => setMobileOpen(false)} className="grid size-11 place-items-center rounded-full bg-white/10 text-white">
            <X className="size-5" />
          </button>
        </div>
        <ul className="mt-6 space-y-2 px-6">
          {links.map((l) => (
            <li key={l.label} data-mobile-link className="overflow-hidden">
              <Link href={l.href} onClick={() => setMobileOpen(false)} className="flex items-center justify-between border-b border-white/10 py-4 text-3xl font-extrabold text-white">
                {l.label}
                <ArrowRight className="size-6 text-brand-400" />
              </Link>
            </li>
          ))}
          <li data-mobile-link className="grid grid-cols-2 gap-3 pt-6">
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                setWishlistOpen(true);
              }}
              className="flex h-13 items-center justify-center gap-2 rounded-2xl bg-white/10 font-bold text-white"
            >
              <Heart className="size-4 text-rose-400" /> Favorites ({wishCount})
            </button>
            <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="flex h-13 items-center justify-center rounded-2xl bg-brand-600 font-bold text-white">
              My Account
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
}
