"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useStore } from "@/store/useStore";
import { getLenis } from "@/components/providers/SmoothScroll";

/** Cinematic intro: counter, wordmark reveal and a split curtain. Shown once per session. */
export default function Preloader() {
  const ref = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);
  const setIntroDone = useStore((s) => s.setIntroDone);

  useGSAP(
    () => {
      const seen = sessionStorage.getItem("iused-intro");
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (seen || reduce) {
        setDone(true);
        setIntroDone(true);
        return;
      }
      document.documentElement.style.overflow = "hidden";
      window.scrollTo(0, 0);
      requestAnimationFrame(() => getLenis()?.stop());

      const counter = { v: 0 };
      const num = ref.current!.querySelector<HTMLElement>("[data-count]")!;
      const tl = gsap.timeline({
        onComplete: () => {
          sessionStorage.setItem("iused-intro", "1");
          document.documentElement.style.overflow = "";
          getLenis()?.start();
          setDone(true);
        },
      });

      tl.from("[data-letter]", { yPercent: 120, stagger: 0.06, duration: 0.9, ease: "expo.out" })
        .from("[data-tag]", { opacity: 0, y: 12, duration: 0.6 }, "-=0.4")
        .to(counter, {
          v: 100,
          duration: 1.6,
          ease: "power2.inOut",
          onUpdate: () => {
            num.textContent = String(Math.round(counter.v)).padStart(3, "0");
          },
        }, 0.2)
        .to("[data-bar]", { scaleX: 1, duration: 1.6, ease: "power2.inOut" }, 0.2)
        .to("[data-letter]", { yPercent: -120, stagger: 0.04, duration: 0.6, ease: "expo.in" }, "+=0.15")
        .to(["[data-tag]", "[data-meta]"], { opacity: 0, duration: 0.3 }, "<")
        .add(() => setIntroDone(true), "-=0.1")
        .to("[data-panel='top']", { yPercent: -100, duration: 1, ease: "expo.inOut" }, "-=0.1")
        .to("[data-panel='bottom']", { yPercent: 100, duration: 1, ease: "expo.inOut" }, "<");
    },
    { scope: ref },
  );

  if (done) return null;

  return (
    <div ref={ref} className="fixed inset-0 z-[100]" aria-hidden>
      <div data-panel="top" className="absolute inset-x-0 top-0 h-1/2 bg-navy-950" />
      <div data-panel="bottom" className="absolute inset-x-0 bottom-0 h-1/2 bg-navy-950" />
      <div className="pointer-events-none absolute inset-0 grid place-items-center">
        <div className="text-center">
          <div className="flex overflow-hidden text-6xl font-extrabold tracking-tight text-white md:text-8xl">
            {"iUsed".split("").map((l, i) => (
              <span key={i} data-letter className={i === 0 ? "inline-block text-brand-400" : "inline-block"}>
                {l}
              </span>
            ))}
          </div>
          <p data-tag className="mt-3 font-script text-2xl text-brand-300">
            loved before, ready for more.
          </p>
        </div>
      </div>
      <div data-meta className="absolute inset-x-6 bottom-8 flex items-end justify-between text-white/60 md:inset-x-12">
        <span className="text-xs uppercase tracking-[0.3em]">Certified pre-owned</span>
        <span data-count className="text-5xl font-extrabold tabular-nums text-white md:text-7xl">000</span>
      </div>
      <div data-meta className="absolute inset-x-0 bottom-0 h-1 bg-white/10">
        <div data-bar className="h-full origin-left scale-x-0 bg-gradient-to-r from-brand-500 to-brand-300" />
      </div>
    </div>
  );
}
