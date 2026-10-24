"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { ArrowRight, ChevronLeft, ChevronRight, BatteryFull, BadgeCheck, ShieldCheck, Star } from "lucide-react";
import { gsap, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";
import { useStore } from "@/store/useStore";
import Magnetic from "@/components/ui/Magnetic";
import { formatPrice } from "@/lib/products";

type Slide = {
  image: string;
  fit: "full" | "right";
  tint?: boolean;
  eyebrow: string;
  title: string;
  tagline: string;
  desc: string;
  price: number;
  retail: number;
  battery: number;
};

const slides: Slide[] = [
  {
    image: "/images/hero-phone.jpg",
    fit: "full",
    eyebrow: "Just landed · Certified pre-owned",
    title: "iPhone 15 Pro",
    tagline: "Like new. Half the price.",
    desc: "Titanium design, A17 Pro power and a pro camera — inspected across 72 points and backed by our 12-month warranty.",
    price: 799,
    retail: 1199,
    battery: 98,
  },
  {
    image: "/images/hero-laptop.jpg",
    fit: "full",
    eyebrow: "Pro performance · Pre-loved price",
    title: "MacBook Pro M2",
    tagline: "Work like a pro. Pay like a student.",
    desc: "Liquid Retina XDR, all-day battery and M2 Pro speed. Freshly restored, factory reset and ready for your next big thing.",
    price: 1149,
    retail: 1999,
    battery: 94,
  },
  {
    image: "/images/hero-s23.jpg",
    fit: "right",
    tint: true,
    eyebrow: "Android flagship · Mint condition",
    title: "Galaxy S23 Ultra",
    tagline: "200MP. Zero compromise.",
    desc: "The S Pen, a 200MP camera and a gorgeous 6.8\" display — at a price that makes upgrading a no-brainer.",
    price: 749,
    retail: 1199,
    battery: 96,
  },
];

const AUTOPLAY = 6.5;

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const goToRef = useRef<(i: number) => void>(() => {});
  const introDone = useStore((s) => s.introDone);

  useGSAP(
    (_, contextSafe) => {
      if (!introDone || !contextSafe) return;
      const q = gsap.utils.selector(root);
      const slideEls = q<HTMLElement>("[data-slide]");
      const contentEls = q<HTMLElement>("[data-content]");
      const splits = q<HTMLElement>("[data-title]").map(
        (el) => new SplitText(el, { type: "words,chars", mask: "words" }),
      );

      let current = 0;
      let busy = false;
      let progress: gsap.core.Tween | null = null;

      // initial state
      slideEls.forEach((el, i) => {
        gsap.set(el, { zIndex: i === 0 ? 2 : 0, clipPath: i === 0 ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 0% 100%)" });
        if (i !== 0) {
          gsap.set(contentEls[i].querySelectorAll("[data-line], [data-chip]"), { opacity: 0 });
          gsap.set(splits[i].chars, { yPercent: 110 });
        }
      });

      const enterText = (i: number, delay = 0) => {
        const el = contentEls[i];
        const tl = gsap.timeline({ delay });
        tl.fromTo(splits[i].chars, { yPercent: 110 }, { yPercent: 0, stagger: 0.022, duration: 1, ease: "expo.out" })
          .fromTo(
            el.querySelectorAll("[data-line]"),
            { y: 30, opacity: 0, filter: "blur(6px)" },
            { y: 0, opacity: 1, filter: "blur(0px)", stagger: 0.08, duration: 0.9, ease: "expo.out" },
            0.15,
          )
          .fromTo(
            el.querySelectorAll("[data-chip]"),
            { scale: 0.6, opacity: 0, y: 20 },
            { scale: 1, opacity: 1, y: 0, stagger: 0.12, duration: 0.9, ease: "back.out(1.8)" },
            0.35,
          );
        return tl;
      };

      const runProgress = (i: number) => {
        progress?.kill();
        const bars = q<HTMLElement>("[data-progress]");
        gsap.set(bars, { scaleX: 0 });
        progress = gsap.to(bars[i], {
          scaleX: 1,
          duration: AUTOPLAY,
          ease: "none",
          onComplete: () => goTo((i + 1) % slides.length),
        });
      };

      const goTo = contextSafe((next: number) => {
        if (busy || next === current) return;
        busy = true;
        const prevEl = slideEls[current];
        const nextEl = slideEls[next];
        const dir = next > current ? 1 : -1;

        setActive(next);
        const tl = gsap.timeline({
          onComplete: () => {
            gsap.set(prevEl, { zIndex: 0, clipPath: "inset(0% 0% 0% 100%)" });
            gsap.set(nextEl, { zIndex: 2 });
            current = next;
            busy = false;
          },
        });
        tl.to(contentEls[current].querySelectorAll("[data-line], [data-chip]"), { y: -24, opacity: 0, stagger: 0.03, duration: 0.45, ease: "power2.in" }, 0)
          .to(splits[current].chars, { yPercent: -110, stagger: 0.012, duration: 0.5, ease: "power2.in" }, 0)
          .set(nextEl, { zIndex: 3 }, 0.3)
          .fromTo(
            nextEl,
            { clipPath: dir === 1 ? "inset(0% 0% 0% 100%)" : "inset(0% 100% 0% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: "expo.inOut" },
            0.3,
          )
          .fromTo(nextEl.querySelector("[data-img]"), { scale: 1.3, xPercent: 8 * dir }, { scale: 1, xPercent: 0, duration: 1.6, ease: "expo.out" }, 0.3)
          .to(prevEl.querySelector("[data-img]"), { scale: 1.1, xPercent: -6 * dir, duration: 1.2, ease: "expo.inOut" }, 0.3)
          .add(enterText(next), 0.9);
        runProgress(next);
      });
      goToRef.current = goTo;

      // Intro
      const intro = gsap.timeline();
      intro
        .fromTo(q("[data-frame]"), { scale: 0.94, borderRadius: 56 }, { scale: 1, borderRadius: 32, duration: 1.6, ease: "expo.out" })
        .fromTo(slideEls[0].querySelector("[data-img]"), { scale: 1.35 }, { scale: 1, duration: 2.2, ease: "expo.out" }, 0)
        .add(enterText(0), 0.3)
        .fromTo(q("[data-hero-ui]"), { y: 20, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.08, duration: 0.8 }, 0.8)
        .add(() => runProgress(0), 0.8);

      // Floating chips idle motion
      gsap.to(q("[data-float]"), {
        y: "+=12",
        duration: 2.6,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        stagger: { each: 0.5, from: "random" },
      });

      // Mouse parallax
      const frame = q<HTMLElement>("[data-frame]")[0];
      const imgX = gsap.quickTo(q("[data-parallax]"), "x", { duration: 1.2, ease: "power3.out" });
      const imgY = gsap.quickTo(q("[data-parallax]"), "y", { duration: 1.2, ease: "power3.out" });
      const chipX = gsap.quickTo(q("[data-chips]"), "x", { duration: 1.4, ease: "power3.out" });
      const chipY = gsap.quickTo(q("[data-chips]"), "y", { duration: 1.4, ease: "power3.out" });
      const onMove = contextSafe((e: MouseEvent) => {
        const r = frame.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width - 0.5;
        const ny = (e.clientY - r.top) / r.height - 0.5;
        imgX(nx * -24);
        imgY(ny * -16);
        chipX(nx * 30);
        chipY(ny * 22);
      });
      const onEnter = contextSafe(() => progress?.pause());
      const onLeave = contextSafe(() => {
        progress?.resume();
        imgX(0); imgY(0); chipX(0); chipY(0);
      });
      frame.addEventListener("mousemove", onMove);
      frame.addEventListener("mouseenter", onEnter);
      frame.addEventListener("mouseleave", onLeave);

      // Scroll-out parallax
      gsap.to(q("[data-scroll-content]"), {
        y: -80,
        opacity: 0,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(q("[data-scroll-img]"), {
        yPercent: 12,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
      ScrollTrigger.refresh();

      return () => {
        progress?.kill();
        splits.forEach((s) => s.revert());
        frame.removeEventListener("mousemove", onMove);
        frame.removeEventListener("mouseenter", onEnter);
        frame.removeEventListener("mouseleave", onLeave);
      };
    },
    { scope: root, dependencies: [introDone] },
  );

  return (
    <section id="top" ref={root} className="container-x pt-3 md:pt-4">
      <div
        data-frame
        className="noise relative h-[calc(100svh-120px)] max-h-[780px] min-h-[600px] overflow-hidden rounded-[32px] bg-navy-950 will-change-transform"
      >
        <div data-scroll-img className="absolute inset-0">
          <div data-parallax className="absolute -inset-8">
            {slides.map((s, i) => (
              <div
                key={s.title}
                data-slide
                className={clsx("absolute inset-0", i === 0 ? "z-[2]" : "z-0")}
                style={{ clipPath: i === 0 ? undefined : "inset(0% 0% 0% 100%)" }}
              >
                <div data-img className="absolute inset-0 will-change-transform">
                  {s.fit === "full" ? (
                    <Image
                      src={s.image}
                      alt={s.title}
                      fill
                      priority={i === 0}
                      sizes="100vw"
                      className="object-cover object-[72%_center] md:object-center"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,#163dc7_0%,#060e31_60%)]">
                      <div className="absolute inset-y-0 right-0 w-full md:w-[64%] [mask-image:linear-gradient(90deg,transparent,#000_40%)]">
                        <Image src={s.image} alt={s.title} fill sizes="64vw" className="object-cover object-right" />
                        {s.tint && <div className="absolute inset-0 bg-brand-600 opacity-60 mix-blend-color" />}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Readability gradients */}
        <div className="pointer-events-none absolute inset-0 z-[4] bg-gradient-to-r from-navy-950/90 via-navy-950/40 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[4] h-48 bg-gradient-to-t from-navy-950/80 to-transparent" />

        {/* Content (one stack per slide, only the active one is interactive) */}
        <div data-scroll-content className="absolute inset-0 z-[5]">
          {slides.map((s, i) => (
            <div
              key={s.title}
              data-content
              aria-hidden={active !== i}
              className={clsx(
                "absolute inset-0 flex items-center",
                active === i ? "pointer-events-auto" : "pointer-events-none",
              )}
            >
              <div data-slide-content className="w-full px-6 md:px-14">
                <div className="max-w-xl">
                  <p data-line className={clsx("mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-brand-200 backdrop-blur", i !== 0 && "opacity-0")}>
                    <span className="relative flex size-2">
                      <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand-300 opacity-75" />
                      <span className="relative inline-flex size-2 rounded-full bg-brand-300" />
                    </span>
                    {s.eyebrow}
                  </p>
                  <h1 data-title className={clsx("text-[2.6rem] font-extrabold leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl", !introDone && "opacity-0")}>
                    {s.title}
                  </h1>
                  <p data-line className={clsx("mt-3 text-xl font-semibold text-white/90 md:text-2xl", i !== 0 && "opacity-0")}>
                    <span className="text-shimmer">{s.tagline}</span>
                  </p>
                  <p data-line className={clsx("mt-4 max-w-md text-sm leading-relaxed text-white/65 md:text-base", i !== 0 && "opacity-0")}>
                    {s.desc}
                  </p>

                  <div data-line className={clsx("mt-6 flex items-end gap-3", i !== 0 && "opacity-0")}>
                    <span className="text-xs font-medium uppercase tracking-wider text-white/50">From</span>
                    <span className="text-4xl font-extrabold text-white">{formatPrice(s.price)}</span>
                    <span className="pb-1 text-base text-white/40 line-through">{formatPrice(s.retail)}</span>
                    <span className="mb-1 rounded-full bg-emerald-400/15 px-2.5 py-1 text-xs font-bold text-emerald-300 ring-1 ring-emerald-400/30">
                      Save {formatPrice(s.retail - s.price)}
                    </span>
                  </div>

                  <div data-line className={clsx("mt-8 flex flex-wrap items-center gap-3", i !== 0 && "opacity-0")}>
                    <Magnetic>
                      <Link
                        href="/shop"
                        className="group relative inline-flex h-14 items-center gap-3 overflow-hidden rounded-full bg-brand-600 pl-7 pr-2 font-bold text-white shadow-[0_10px_40px_-8px_rgba(47,102,255,0.8)] transition-shadow hover:shadow-[0_14px_50px_-6px_rgba(47,102,255,1)]"
                      >
                        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                        <span className="relative">Shop Now</span>
                        <span className="relative grid size-10 place-items-center rounded-full bg-white text-brand-700 transition-transform duration-500 group-hover:rotate-[-45deg]">
                          <ArrowRight className="size-4" />
                        </span>
                      </Link>
                    </Magnetic>
                    <a href="#trade-in" className="inline-flex h-14 items-center gap-2 rounded-full border border-white/20 px-6 text-sm font-semibold text-white backdrop-blur transition hover:border-white/50 hover:bg-white/10">
                      Trade in &amp; save more
                    </a>
                  </div>
                </div>
              </div>

              {/* Floating trust chips */}
              <div data-chips className="pointer-events-none absolute inset-0 hidden lg:block">
                <div data-chip className={clsx("absolute right-[8%] top-[14%]", i !== 0 && "opacity-0")}>
                  <div data-float className="glass-dark flex items-center gap-3 rounded-2xl px-4 py-3 text-white shadow-2xl">
                    <span className="grid size-10 place-items-center rounded-xl bg-emerald-400/20 text-emerald-300">
                      <BatteryFull className="size-5" />
                    </span>
                    <div>
                      <p className="text-[11px] text-white/60">Battery health</p>
                      <p className="text-lg font-extrabold leading-none">{s.battery}%</p>
                      <div className="mt-1.5 h-1 w-24 overflow-hidden rounded-full bg-white/15">
                        <div className="h-full rounded-full bg-emerald-400" style={{ width: `${s.battery}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
                <div data-chip className={clsx("absolute bottom-[24%] right-[38%]", i !== 0 && "opacity-0")}>
                  <div data-float className="glass-dark flex items-center gap-2.5 rounded-2xl px-4 py-3 text-white shadow-2xl">
                    <BadgeCheck className="size-5 text-brand-300" />
                    <div>
                      <p className="text-sm font-bold leading-tight">72-point verified</p>
                      <p className="text-[11px] text-white/60">Inspected by certified techs</p>
                    </div>
                  </div>
                </div>
                <div data-chip className={clsx("absolute bottom-[16%] right-[6%]", i !== 0 && "opacity-0")}>
                  <div data-float className="glass-dark flex items-center gap-3 rounded-2xl px-4 py-3 text-white shadow-2xl">
                    <div className="flex -space-x-2">
                      {["#5a8bff", "#f59e0b", "#10b981"].map((c, k) => (
                        <span key={k} className="grid size-7 place-items-center rounded-full text-[10px] font-bold ring-2 ring-navy-900" style={{ background: c }}>
                          {["AO", "SK", "MB"][k]}
                        </span>
                      ))}
                    </div>
                    <div>
                      <p className="flex items-center gap-1 text-sm font-bold"><Star className="size-3.5 fill-amber-400 text-amber-400" /> 4.9/5</p>
                      <p className="text-[11px] text-white/60">48k+ happy owners</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="absolute inset-x-6 bottom-6 z-[6] flex items-center justify-between md:inset-x-14 md:bottom-8">
          <div data-hero-ui className="flex items-center gap-2">
            {slides.map((s, i) => (
              <button
                key={s.title}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => goToRef.current(i)}
                className={clsx(
                  "relative h-1.5 overflow-hidden rounded-full bg-white/20 transition-all duration-500",
                  active === i ? "w-14" : "w-6 hover:bg-white/40",
                )}
              >
                <span data-progress className="absolute inset-0 origin-left scale-x-0 rounded-full bg-white" />
              </button>
            ))}
            <span className="ml-3 hidden text-xs font-semibold tabular-nums text-white/60 sm:inline">
              0{active + 1} <span className="text-white/30">/ 0{slides.length}</span>
            </span>
          </div>
          <div data-hero-ui className="flex items-center gap-2">
            <span className="mr-3 hidden items-center gap-2 text-xs text-white/60 md:flex">
              <ShieldCheck className="size-4 text-brand-300" /> 12-month warranty on every device
            </span>
            <button
              aria-label="Previous slide"
              onClick={() => goToRef.current((active - 1 + slides.length) % slides.length)}
              className="grid size-11 place-items-center rounded-full border border-white/20 text-white backdrop-blur transition hover:bg-white hover:text-navy-900"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              aria-label="Next slide"
              onClick={() => goToRef.current((active + 1) % slides.length)}
              className="grid size-11 place-items-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur transition hover:bg-white hover:text-navy-900"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
