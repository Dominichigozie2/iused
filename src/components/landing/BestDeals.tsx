"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight, Flame } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import { deals } from "@/lib/products";
import ProductCard from "@/components/product/ProductCard";
import SectionHeading from "@/components/ui/SectionHeading";

export default function BestDeals() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        "[data-deal-item]",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.08,
          duration: 0.85,
          ease: "expo.out",
          scrollTrigger: { trigger: ref.current, start: "top 84%" },
        },
      );
    },
    { scope: ref },
  );

  return (
    <section id="deals" ref={ref} className="container-x py-10 md:py-16">
      <SectionHeading
        eyebrow="Flash Drops"
        title="Best"
        highlight="Deals"
        subtitle="Top offers, limited time only. Once a batch sells out at this price, it's gone."
        action={
          <div className="inline-flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1.5 text-xs font-extrabold text-rose-600 ring-1 ring-rose-200">
              <Flame className="size-3.5 fill-rose-500 text-rose-500" />
              High demand right now
            </span>
            <Link
              href="/shop"
              className="group inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 transition hover:text-brand-700"
            >
              View All
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {deals.map((d) => (
          <div key={d.id} data-deal-item>
            <ProductCard product={d} deal={{ dealPrice: d.dealPrice, sold: d.sold }} />
          </div>
        ))}
      </div>
    </section>
  );
}
