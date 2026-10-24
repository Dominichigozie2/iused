"use client";

import { useRef } from "react";
import { Truck, ShieldCheck, Headset, RefreshCcw, BadgeCheck } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";

const features = [
  { icon: Truck, title: "Free Express Delivery", text: "On orders over $300" },
  { icon: ShieldCheck, title: "Secure Payment", text: "100% protected checkout" },
  { icon: BadgeCheck, title: "12-Month Warranty", text: "On every single device" },
  { icon: Headset, title: "24/7 Support", text: "Real humans, real fast" },
  { icon: RefreshCcw, title: "Easy Returns", text: "30-day money back" },
];

export default function FeatureStrip() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from("[data-feature]", {
        y: 40,
        opacity: 0,
        stagger: 0.08,
        duration: 1,
        ease: "expo.out",
        scrollTrigger: { trigger: ref.current, start: "top 90%" },
      });
    },
    { scope: ref },
  );

  return (
    <section className="container-x relative z-10 mt-5">
      <div
        ref={ref}
        className="no-scrollbar flex snap-x gap-2 overflow-x-auto rounded-3xl bg-white p-3 shadow-[0_20px_60px_-24px_rgba(13,33,112,0.2)] ring-1 ring-line md:grid md:grid-cols-5 md:gap-0 md:p-4"
      >
        {features.map(({ icon: Icon, title, text }, i) => (
          <div
            key={title}
            data-feature
            className="group flex min-w-[210px] snap-start items-center gap-3 rounded-2xl p-3 transition-colors hover:bg-brand-50 md:min-w-0 md:border-r md:border-line md:rounded-none md:last:border-0"
            style={{ borderRightStyle: i === features.length - 1 ? "none" : undefined }}
          >
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-brand-50 text-brand-600 transition-all duration-500 group-hover:rotate-[-10deg] group-hover:scale-110 group-hover:bg-brand-600 group-hover:text-white">
              <Icon className="size-5" />
            </span>
            <div>
              <p className="text-sm font-bold text-ink">{title}</p>
              <p className="text-xs text-muted">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
