"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import Logo from "@/components/ui/Logo";

export default function NewsletterFooter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail("");
  };

  return (
    <footer className="mt-8 border-t border-line bg-white pt-10">
      {/* Stay Connected Banner — matching the reference bottom banner */}
      <div className="container-x">
        <div className="noise relative overflow-hidden rounded-[32px] bg-gradient-to-r from-navy-950 via-navy-900 to-brand-800 px-6 py-10 text-white shadow-2xl md:px-14 md:py-12">
          <div className="pointer-events-none absolute -right-10 -top-20 size-80 rounded-full bg-brand-500/30 blur-3xl" />

          <div className="relative z-10 grid items-center gap-8 lg:grid-cols-[1.15fr_1fr]">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight sm:text-4xl">Stay Connected</h2>
              <p className="mt-2 text-sm text-white/75 sm:text-base">
                Get the latest drops, restock alerts, exclusive flash offers and $20 off your first gadget.
              </p>

              <form onSubmit={handleSubmit} className="mt-6 flex max-w-md items-center rounded-full bg-white/10 p-1.5 ring-1 ring-white/20 backdrop-blur">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={subscribed ? "You're on the VIP list! Check your inbox." : "Your email address"}
                  className="h-10 flex-1 bg-transparent px-4 text-sm text-white placeholder:text-white/50 outline-none"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="grid size-10 shrink-0 place-items-center rounded-full bg-brand-500 text-white shadow-lg transition hover:bg-brand-400"
                >
                  {subscribed ? <Check className="size-4" /> : <ArrowRight className="size-4" />}
                </button>
              </form>
            </div>

            <div className="relative flex items-center justify-center lg:justify-end">
              <div className="relative h-44 w-64 overflow-hidden rounded-2xl ring-1 ring-white/15 sm:h-48 sm:w-80">
                <Image
                  src="/images/hero-phone.jpg"
                  alt="Next phone awaits"
                  fill
                  sizes="320px"
                  className="object-cover object-right"
                />
              </div>
              <p className="ml-4 font-script text-3xl leading-tight text-brand-200 sm:text-4xl">
                Your <br /> Next Phone <br /> Awaits ♡
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Columns */}
      <div className="container-x py-12 md:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1.1fr]">
          <div>
            <Logo />
            <p className="mt-3 max-w-xs text-sm text-muted">
              Better Tech. Brighter Tomorrow. Certified pre-owned smartphones, laptops, and audio — inspected across 72 points.
            </p>
            <div className="mt-5 flex items-center gap-2.5">
              {["f", "ig", "yt", "tt"].map((s) => (
                <a
                  key={s}
                  href="#top"
                  aria-label={s}
                  className="grid size-9 place-items-center rounded-full bg-surface text-xs font-extrabold uppercase text-ink transition hover:bg-brand-600 hover:text-white"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-ink">Quick Links</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-muted">
              <li><Link href="/" className="hover:text-brand-600">Home</Link></li>
              <li><Link href="/shop" className="hover:text-brand-600">Shop All Inventory</Link></li>
              <li><Link href="/shop?category=phones" className="hover:text-brand-600">All Phones</Link></li>
              <li><Link href="/checkout" className="hover:text-brand-600">Checkout</Link></li>
              <li><Link href="/dashboard" className="hover:text-brand-600">User Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-ink">Categories</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-muted">
              <li><Link href="/shop?brand=Apple" className="hover:text-brand-600">iPhone</Link></li>
              <li><Link href="/shop?brand=Samsung" className="hover:text-brand-600">Samsung Galaxy</Link></li>
              <li><Link href="/shop?category=laptops" className="hover:text-brand-600">MacBook &amp; iPad</Link></li>
              <li><Link href="/shop?category=wearables" className="hover:text-brand-600">Apple Watch</Link></li>
              <li><Link href="/shop?category=audio" className="hover:text-brand-600">AirPods &amp; Audio</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-ink">Customer Service</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-muted">
              <li><a href="#promise" className="hover:text-brand-600">72-Point Inspection</a></li>
              <li><a href="#promise" className="hover:text-brand-600">12-Month Warranty</a></li>
              <li><Link href="/dashboard" className="hover:text-brand-600">Track Your Order</Link></li>
              <li><a href="#promise" className="hover:text-brand-600">30-Day Returns</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-ink">Payment Methods</h3>
            <p className="mt-4 text-xs text-muted">
              256-bit encrypted checkout. Pay by card, Apple Pay, PayPal, or Cash on Delivery.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {["VISA", "Mastercard", "PayPal", "Apple Pay", "COD"].map((p) => (
                <span
                  key={p}
                  className="rounded-lg bg-surface px-2.5 py-1.5 text-[11px] font-extrabold text-ink ring-1 ring-line"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-line pt-6 text-xs text-muted sm:flex-row">
          <p>© 2026 iUsed Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#top" className="hover:text-ink">Privacy Policy</a>
            <a href="#top" className="hover:text-ink">Terms &amp; Conditions</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
