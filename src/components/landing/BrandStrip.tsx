"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import SectionHeading from "@/components/ui/SectionHeading";

const brands = [
  {
    name: "Apple",
    count: "480+ devices",
    badge: "Most Popular",
    logo: (
      <svg viewBox="0 0 24 24" className="size-7 fill-current">
        <path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.12 0-.23-.02-.3-.03-.01-.06-.04-.22-.04-.39 0-1.15.572-2.27 1.206-2.98.804-.94 2.142-1.64 3.248-1.68.03.13.05.28.05.43zm4.565 15.71c-.03.07-.463 1.58-1.518 3.12-.945 1.34-1.94 2.71-3.43 2.71-1.517 0-1.9-.88-3.63-.88-1.698 0-2.302.91-3.67.91-1.377 0-2.332-1.26-3.428-2.8-1.287-1.82-2.323-4.63-2.323-7.28 0-4.28 2.797-6.55 5.552-6.55 1.448 0 2.675.95 3.6.95.865 0 2.222-1.01 3.902-1.01.613 0 2.886.06 4.374 2.19-.13.09-2.383 1.37-2.383 4.19 0 3.26 2.854 4.42 2.955 4.45z" />
      </svg>
    ),
  },
  {
    name: "Samsung",
    count: "350+ devices",
    badge: "Top Android",
    logo: (
      <span className="text-sm font-black tracking-[0.18em] text-[#1428A0]">SAMSUNG</span>
    ),
  },
  {
    name: "Google",
    count: "140+ devices",
    badge: "Pixel Pro",
    logo: (
      <span className="text-xl font-extrabold tracking-tight">
        <span className="text-[#4285F4]">G</span>
        <span className="text-[#EA4335]">o</span>
        <span className="text-[#FBBC05]">o</span>
        <span className="text-[#4285F4]">g</span>
        <span className="text-[#34A853]">l</span>
        <span className="text-[#EA4335]">e</span>
      </span>
    ),
  },
  {
    name: "OnePlus",
    count: "95+ devices",
    badge: "Fast Charge",
    logo: (
      <span className="inline-flex items-center gap-1 font-extrabold text-[#EB0028]">
        <span className="grid size-6 place-items-center border-2 border-[#EB0028] text-xs font-black">1+</span>
        <span className="text-sm tracking-tight">OnePlus</span>
      </span>
    ),
  },
  {
    name: "Xiaomi",
    count: "180+ devices",
    badge: "Value King",
    logo: (
      <span className="grid size-8 place-items-center rounded-xl bg-[#FF6900] text-sm font-black text-white">
        mi
      </span>
    ),
  },
  {
    name: "Sony",
    count: "120+ devices",
    badge: "Audio & PS5",
    logo: (
      <span className="font-serif text-base font-bold tracking-[0.22em] text-ink">SONY</span>
    ),
  },
];

export default function BrandStrip() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        "[data-brand-card]",
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.06,
          duration: 0.8,
          ease: "expo.out",
          scrollTrigger: { trigger: ref.current, start: "top 86%" },
        },
      );
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="container-x py-10 md:py-14">
      <SectionHeading
        eyebrow="Authorized Refurbisher"
        title="Shop by"
        highlight="Brand"
        subtitle="Every brand unlocked, IMEI-verified clean, and backed by our 12-month warranty."
        action={
          <Link
            href="/shop"
            className="group inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 transition hover:text-brand-700"
          >
            View All Brands
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        }
      />

      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-6">
        {brands.map((b) => (
          <Link
            key={b.name}
            href={`/shop?brand=${encodeURIComponent(b.name)}`}
            data-brand-card
            className="group relative flex flex-col items-center justify-center rounded-2xl bg-white p-5 text-center ring-1 ring-line transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-brand-900/10 hover:ring-brand-300"
          >
            <span className="mb-1 rounded-full bg-surface px-2.5 py-0.5 text-[10px] font-bold text-muted transition group-hover:bg-brand-50 group-hover:text-brand-600">
              {b.badge}
            </span>
            <div className="my-3 flex h-10 items-center justify-center transition-transform duration-300 group-hover:scale-110">
              {b.logo}
            </div>
            <p className="text-sm font-bold text-ink">{b.name}</p>
            <p className="text-[11px] text-muted">{b.count}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
