"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import {
  BadgeCheck,
  BatteryCharging,
  Cpu,
  Fingerprint,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Wifi,
  ArrowRight,
  CheckCircle2,
  X,
  ShoppingBag,
} from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import SectionHeading from "@/components/ui/SectionHeading";
import { formatPrice } from "@/lib/products";

const grades = [
  {
    key: "Mint",
    badge: "99% Like New",
    priceDelta: "Best for perfectionists",
    screen: "Flawless — zero scratches visible even under bright studio light.",
    body: "Immaculate frame and back glass. Indistinguishable from a brand-new unboxed unit.",
    battery: "93% – 100% original capacity",
    warranty: "12-Month iUsed Platinum Warranty + 30-day return",
  },
  {
    key: "Excellent",
    badge: "Most Popular Choice",
    priceDelta: "Save ~12% more",
    screen: "Pristine when lit; at most 1–2 micro hairline marks invisible at arm's length.",
    body: "Clean edges and back. No dents, cracks, or deep scratches.",
    battery: "88% – 95% original capacity",
    warranty: "12-Month iUsed Platinum Warranty + 30-day return",
  },
  {
    key: "Good",
    badge: "Maximum Savings",
    priceDelta: "Save ~25% more",
    screen: "Light signs of normal use that disappear once the display turns on.",
    body: "Minor cosmetic wear on chassis; 100% structurally sound & case-friendly.",
    battery: "85% – 90% guaranteed minimum",
    warranty: "12-Month iUsed Platinum Warranty + 30-day return",
  },
] as const;

const tradeModels = [
  { name: "iPhone 14 Pro Max", base: 540 },
  { name: "iPhone 13 Pro", base: 410 },
  { name: "iPhone 12", base: 240 },
  { name: "Galaxy S22 Ultra", base: 360 },
  { name: "MacBook Air M1", base: 430 },
  { name: "iPad Pro 11\"", base: 350 },
];

const liveFeed = [
  { buyer: "Yasmine B.", city: "Algiers", item: "iPhone 13 Pro Max · Sierra Blue", ago: "1m ago" },
  { buyer: "Karim M.", city: "Oran", item: "Galaxy S23 Ultra · 256GB", ago: "3m ago" },
  { buyer: "Lina T.", city: "Constantine", item: "MacBook Pro 14\" M1 Pro", ago: "6m ago" },
  { buyer: "Mehdi A.", city: "Tunis", item: "AirPods Pro (MagSafe)", ago: "9m ago" },
];

export default function ExtraFlairSections() {
  const ref = useRef<HTMLDivElement>(null);
  const [selectedGrade, setSelectedGrade] = useState<(typeof grades)[number]["key"]>("Mint");
  const [modelIdx, setModelIdx] = useState(0);
  const [storageBonus, setStorageBonus] = useState(40);
  const [condMultiplier, setCondMultiplier] = useState(1);
  const [creditApplied, setCreditApplied] = useState(false);

  // Live social proof toast
  const [toastIdx, setToastIdx] = useState(0);
  const [toastVisible, setToastVisible] = useState(true);
  const [toastDismissed, setToastDismissed] = useState(false);

  useEffect(() => {
    if (toastDismissed) return;
    const id = setInterval(() => {
      setToastVisible(false);
      setTimeout(() => {
        setToastIdx((i) => (i + 1) % liveFeed.length);
        setToastVisible(true);
      }, 600);
    }, 9000);
    return () => clearInterval(id);
  }, [toastDismissed]);

  const quote = Math.round((tradeModels[modelIdx].base + storageBonus) * condMultiplier);
  const activeGrade = grades.find((g) => g.key === selectedGrade)!;

  useGSAP(
    () => {
      gsap.fromTo(
        "[data-flair-card]",
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
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="space-y-16 py-10 md:py-16">
      {/* 1. 72-Point Certified Lab & Interactive Condition Grade Explorer */}
      <section id="promise" className="container-x">
        <SectionHeading
          eyebrow="Zero Guesswork · 100% Transparency"
          title="Why 48,000+ People Trust"
          highlight="iUsed Certified"
          subtitle="Every device is stripped of data, tested across 72 hardware & sensor checkpoints, ultrasonically sanitized, and graded honestly."
        />

        <div className="grid gap-6 lg:grid-cols-[1.05fr_1fr]">
          {/* Left: Interactive Grade Switcher */}
          <div data-flair-card className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-line md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs font-extrabold uppercase tracking-widest text-brand-600">
                Interactive Condition Guide
              </span>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                100% Functional Across All Grades
              </span>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2 rounded-2xl bg-surface p-1.5">
              {grades.map((g) => {
                const active = g.key === selectedGrade;
                return (
                  <button
                    key={g.key}
                    onClick={() => setSelectedGrade(g.key)}
                    className={clsx(
                      "rounded-xl py-2.5 text-sm font-extrabold transition-all",
                      active ? "bg-brand-600 text-white shadow-md shadow-brand-600/25" : "text-slate-600 hover:text-ink",
                    )}
                  >
                    {g.key}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 space-y-4 rounded-2xl bg-surface/70 p-5 ring-1 ring-line">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-extrabold text-ink">{activeGrade.key} Condition</h3>
                  <p className="text-xs font-semibold text-brand-600">{activeGrade.badge}</p>
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-ink ring-1 ring-line">
                  {activeGrade.priceDelta}
                </span>
              </div>

              <div className="grid gap-3 pt-2 text-sm sm:grid-cols-2">
                <div className="rounded-xl bg-white p-3.5 ring-1 ring-line">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-muted">Display Glass</p>
                  <p className="mt-1 font-medium text-ink">{activeGrade.screen}</p>
                </div>
                <div className="rounded-xl bg-white p-3.5 ring-1 ring-line">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-muted">Frame &amp; Housing</p>
                  <p className="mt-1 font-medium text-ink">{activeGrade.body}</p>
                </div>
                <div className="rounded-xl bg-white p-3.5 ring-1 ring-line">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-muted">Battery Health</p>
                  <p className="mt-1 font-bold text-emerald-600">{activeGrade.battery}</p>
                </div>
                <div className="rounded-xl bg-white p-3.5 ring-1 ring-line">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-muted">Protection</p>
                  <p className="mt-1 font-medium text-ink">{activeGrade.warranty}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: 72-Point Diagnostic Breakdown */}
          <div data-flair-card className="flex flex-col justify-between rounded-[28px] bg-navy-950 p-6 text-white md:p-8">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-brand-300 ring-1 ring-white/15">
                <BadgeCheck className="size-4" /> Lab Diagnostic Certificate Included
              </span>
              <h3 className="mt-4 text-2xl font-extrabold tracking-tight md:text-3xl">
                Every device passes 72 automated &amp; human checks.
              </h3>
              <p className="mt-2 text-sm text-white/65">
                We reject 38% of devices we inspect so you only get hardware that feels crisp, fast, and dependable.
              </p>

              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {[
                  { icon: BatteryCharging, title: "Battery Cycle & Peak", sub: "Load-tested under stress" },
                  { icon: Fingerprint, title: "Face ID / Touch ID", sub: "Biometric sensor check" },
                  { icon: Cpu, title: "Logic Board & SoC", sub: "Thermal & benchmark pass" },
                  { icon: Wifi, title: "5G / Wi-Fi / NFC", sub: "Unlocked & IMEI clean" },
                  { icon: Sparkles, title: "TrueTone & OLED", sub: "Zero dead-pixel guarantee" },
                  { icon: ShieldCheck, title: "Audio & Cameras", sub: "OIS, mics & speakers" },
                ].map(({ icon: Icon, title, sub }) => (
                  <div key={title} className="rounded-2xl bg-white/5 p-3.5 ring-1 ring-white/10">
                    <Icon className="size-5 text-brand-300" />
                    <p className="mt-2 text-xs font-bold text-white">{title}</p>
                    <p className="mt-0.5 text-[11px] text-white/55">{sub}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-5 text-xs text-white/70">
              <span>Serial &amp; IMEI certificate inside every box</span>
              <a href="#popular" className="inline-flex items-center gap-1 font-bold text-brand-300 hover:text-white">
                Browse certified stock <ArrowRight className="size-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Instant Trade-In Calculator */}
      <section id="trade-in" className="container-x">
        <div
          data-flair-card
          className="overflow-hidden rounded-[32px] bg-gradient-to-br from-brand-50 via-white to-brand-100/60 p-6 ring-1 ring-brand-200 md:p-10"
        >
          <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-brand-600/10 px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-brand-700">
                <RefreshCw className="size-3.5" /> Instant Trade-In Estimator
              </span>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ink md:text-4xl">
                Turn your old gadget into <span className="text-gradient">instant credit.</span>
              </h2>
              <p className="mt-2 max-w-xl text-sm text-muted md:text-base">
                Pick your current device below to lock in an instant trade-in value. We ship a free prepaid courier kit right to your door.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {/* Model selector */}
                <label className="block">
                  <span className="text-xs font-bold text-ink">1. Your Device</span>
                  <select
                    value={modelIdx}
                    onChange={(e) => {
                      setModelIdx(Number(e.target.value));
                      setCreditApplied(false);
                    }}
                    className="mt-1.5 h-11 w-full rounded-xl bg-white px-3 text-sm font-semibold text-ink ring-1 ring-line outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    {tradeModels.map((m, idx) => (
                      <option key={m.name} value={idx}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </label>

                {/* Storage selector */}
                <label className="block">
                  <span className="text-xs font-bold text-ink">2. Storage</span>
                  <select
                    value={storageBonus}
                    onChange={(e) => {
                      setStorageBonus(Number(e.target.value));
                      setCreditApplied(false);
                    }}
                    className="mt-1.5 h-11 w-full rounded-xl bg-white px-3 text-sm font-semibold text-ink ring-1 ring-line outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value={0}>128GB</option>
                    <option value={40}>256GB (+$40)</option>
                    <option value={85}>512GB / 1TB (+$85)</option>
                  </select>
                </label>

                {/* Condition selector */}
                <label className="block">
                  <span className="text-xs font-bold text-ink">3. Condition</span>
                  <select
                    value={condMultiplier}
                    onChange={(e) => {
                      setCondMultiplier(Number(e.target.value));
                      setCreditApplied(false);
                    }}
                    className="mt-1.5 h-11 w-full rounded-xl bg-white px-3 text-sm font-semibold text-ink ring-1 ring-line outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value={1}>Flawless / Mint</option>
                    <option value={0.85}>Good (normal wear)</option>
                    <option value={0.6}>Cracked glass / worn</option>
                  </select>
                </label>
              </div>
            </div>

            {/* Right quote card */}
            <div className="relative overflow-hidden rounded-3xl bg-navy-950 p-6 text-white shadow-2xl md:p-8">
              <Image
                src="/images/tradein-wide.jpg"
                alt="Trade in devices"
                fill
                sizes="420px"
                className="object-cover opacity-20"
              />
              <div className="relative z-10">
                <p className="text-xs font-bold uppercase tracking-widest text-brand-300">Estimated Instant Value</p>
                <div className="mt-2 flex items-baseline gap-3">
                  <span className="text-5xl font-extrabold tracking-tight">{formatPrice(quote)}</span>
                  <span className="rounded-full bg-emerald-400/20 px-2.5 py-0.5 text-xs font-bold text-emerald-300">
                    Paid in 24h or instant cart credit
                  </span>
                </div>
                <p className="mt-2 text-xs text-white/65">
                  Includes free insured pickup from your location &amp; full data-wipe certificate.
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setCreditApplied(true)}
                    className={clsx(
                      "inline-flex h-12 items-center gap-2 rounded-full px-6 text-sm font-extrabold transition",
                      creditApplied
                        ? "bg-emerald-500 text-white"
                        : "bg-brand-600 text-white hover:bg-brand-500",
                    )}
                  >
                    {creditApplied ? (
                      <>
                        <CheckCircle2 className="size-4" />
                        {formatPrice(quote)} Credit Saved to Profile
                      </>
                    ) : (
                      <>
                        Lock In {formatPrice(quote)} Trade-In Offer
                        <ArrowRight className="size-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Social Proof Ambience Toast (bottom-left) */}
      {!toastDismissed && (
        <div
          className={clsx(
            "fixed bottom-4 left-4 z-30 hidden max-w-xs items-center gap-3 rounded-2xl bg-white/95 p-3 shadow-2xl shadow-navy-950/20 ring-1 ring-line backdrop-blur transition-all duration-500 sm:flex",
            toastVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none",
          )}
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-600 text-white">
            <ShoppingBag className="size-5" />
          </span>
          <div className="min-w-0 flex-1 pr-2">
            <p className="truncate text-xs font-extrabold text-ink">
              {liveFeed[toastIdx].buyer} in {liveFeed[toastIdx].city}
            </p>
            <p className="truncate text-[11px] text-muted">Purchased {liveFeed[toastIdx].item}</p>
            <p className="text-[10px] font-bold text-emerald-600">Verified order · {liveFeed[toastIdx].ago}</p>
          </div>
          <button
            onClick={() => setToastDismissed(true)}
            aria-label="Dismiss notification"
            className="rounded-lg p-1 text-slate-400 hover:bg-surface hover:text-ink"
          >
            <X className="size-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
