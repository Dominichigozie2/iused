"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowRight, Sparkles, Timer } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import Magnetic from "@/components/ui/Magnetic";

export default function PromoBanner() {
  const ref = useRef<HTMLElement>(null);
  const [timeLeft, setTimeLeft] = useState({ h: 11, m: 42, s: 18 });

  useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft((prev) => {
        let { h, m, s } = prev;
        if (s > 0) s -= 1;
        else {
          s = 59;
          if (m > 0) m -= 1;
          else {
            m = 59;
            h = h > 0 ? h - 1 : 11;
          }
        }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  useGSAP(
    () => {
      gsap.fromTo(
        "[data-promo-reveal]",
        { y: 36, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.9,
          ease: "expo.out",
          scrollTrigger: { trigger: ref.current, start: "top 82%" },
        },
      );
      gsap.fromTo(
        "[data-promo-img]",
        { scale: 1.15, x: 30 },
        {
          scale: 1,
          x: 0,
          duration: 1.4,
          ease: "expo.out",
          scrollTrigger: { trigger: ref.current, start: "top 82%" },
        },
      );
    },
    { scope: ref },
  );

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <section ref={ref} className="container-x py-6">
      <div className="noise relative overflow-hidden rounded-[32px] bg-gradient-to-r from-navy-950 via-navy-800 to-brand-700 px-6 py-10 text-white shadow-[0_30px_80px_-20px_rgba(13,33,112,0.5)] md:px-14 md:py-14">
        {/* Background glow swooshes */}
        <div className="pointer-events-none absolute -left-20 -top-24 size-96 rounded-full bg-brand-500/30 blur-3xl" />
        <div className="pointer-events-none absolute right-1/4 top-1/2 size-80 -translate-y-1/2 rounded-full bg-sky-400/25 blur-3xl" />

        <div className="relative z-10 grid items-center gap-8 lg:grid-cols-[1.15fr_1fr]">
          <div>
            <div data-promo-reveal className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest text-brand-200 ring-1 ring-white/15 backdrop-blur">
              <Sparkles className="size-3.5 text-amber-300" />
              Limited Time Offer
            </div>

            <h2 data-promo-reveal className="mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl">
              Up to <span className="text-shimmer">30% Off</span>
            </h2>
            <p data-promo-reveal className="mt-2 text-lg font-medium text-white/85 sm:text-xl">
              On Selected Certified Smartphones &amp; Flagships
            </p>

            {/* Live countdown */}
            <div data-promo-reveal className="mt-6 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 rounded-2xl bg-navy-950/60 px-4 py-2.5 ring-1 ring-white/15 backdrop-blur">
                <Timer className="size-4 text-brand-300" />
                <span className="text-xs font-semibold text-white/70">Ends in</span>
                <div className="flex items-center gap-1 font-mono text-sm font-extrabold text-white">
                  <span className="rounded bg-white/15 px-1.5 py-0.5">{pad(timeLeft.h)}h</span>:
                  <span className="rounded bg-white/15 px-1.5 py-0.5">{pad(timeLeft.m)}m</span>:
                  <span className="rounded bg-brand-500 px-1.5 py-0.5">{pad(timeLeft.s)}s</span>
                </div>
              </div>

              <Magnetic>
                <a
                  href="#deals"
                  className="group inline-flex h-12 items-center gap-2.5 rounded-full bg-white px-6 text-sm font-extrabold text-navy-950 shadow-xl transition hover:bg-brand-50"
                >
                  Shop Deals
                  <ArrowRight className="size-4 text-brand-600 transition-transform group-hover:translate-x-1" />
                </a>
              </Magnetic>
            </div>
          </div>

          {/* Right visual + Caveat script callout */}
          <div className="relative flex items-center justify-center lg:justify-end">
            <div data-promo-img className="relative h-56 w-full max-w-md overflow-hidden rounded-3xl ring-1 ring-white/15 sm:h-64">
              <Image
                src="/images/hero-phone.jpg"
                alt="Flagship smartphones on sale"
                fill
                sizes="(max-width: 1024px) 90vw, 420px"
                className="object-cover object-right"
              />
              <div className=" inset-0 absolute bg-gradient-to-t from-navy-950/60 via-transparent to-transparent" />
            </div>

            <div
              data-promo-reveal
              className="pointer-events-none absolute -bottom-3 right-2 rotate-[-8deg] rounded-2xl bg-navy-950/80 px-4 py-2 font-script text-2xl leading-none text-brand-200 ring-1 ring-white/15 backdrop-blur sm:text-3xl"
            >
              Better · Faster · Smarter ♡
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
