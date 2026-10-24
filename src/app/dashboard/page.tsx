"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import {
  ArrowLeft,
  BadgeCheck,
  BatteryFull,
  CheckCircle2,
  Heart,
  LocateFixed,
  MapPin,
  Package,
  Phone,
  RefreshCw,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";
import Logo from "@/components/ui/Logo";
import { products, formatPrice } from "@/lib/products";
import { useStore } from "@/store/useStore";

type SavedOrder = {
  id: string;
  date: string;
  fullName: string;
  address: string;
  phone: string;
  coords?: { lat: number; lng: number } | null;
  total: number;
  items: { id: string; name: string; variant: string; price: number; image: string; qty: number }[];
  payMethod: string;
};

const defaultOrder: SavedOrder = {
  id: "IU784512",
  date: "Oct 24, 2026",
  fullName: "Sarah Ahmed",
  address: "12 Rue des Fleurs, Algiers 16000",
  phone: "+213 555 123 456",
  coords: { lat: 36.7538, lng: 3.0588 },
  total: 1018,
  items: [
    {
      id: "iphone-13-pro-max",
      name: "iPhone 13 Pro Max",
      variant: "256GB · Sierra Blue",
      price: 689,
      image: "/images/products/iphone-13-pro-max.jpg",
      qty: 1,
    },
    {
      id: "galaxy-s21-plus",
      name: "Galaxy S21+",
      variant: "128GB · Phantom Violet",
      price: 329,
      image: "/images/products/galaxy-s21-plus.jpg",
      qty: 1,
    },
  ],
  payMethod: "card",
};

export default function DashboardPage() {
  const [order, setOrder] = useState<SavedOrder>(defaultOrder);
  const [activeTab, setActiveTab] = useState<"orders" | "warranty" | "wishlist">("orders");
  const wishlist = useStore((s) => s.wishlist);
  const addToCart = useStore((s) => s.addToCart);
  const setCartOpen = useStore((s) => s.setCartOpen);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("iused-last-order");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.id) setOrder(parsed);
      }
    } catch {
      // ignore
    }
  }, []);

  const wishedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="min-h-screen bg-[#F4F7FE] pb-20">
      {/* Dashboard Header */}
      <header className="sticky top-0 z-30 border-b border-line bg-white/90 backdrop-blur">
        <div className="container-x flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo />
            <span className="hidden rounded-full bg-brand-50 px-3 py-1 text-xs font-extrabold text-brand-600 sm:inline-block">
              User Dashboard
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-full bg-surface px-4 py-2 text-xs font-extrabold text-ink ring-1 ring-line transition hover:bg-brand-50 hover:text-brand-600"
            >
              <ArrowLeft className="size-3.5" /> Back to Store
            </Link>
            <button
              onClick={() => setCartOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-full bg-brand-600 px-4 py-2 text-xs font-extrabold text-white shadow-md shadow-brand-600/25"
            >
              <ShoppingBag className="size-3.5" /> Open Bag
            </button>
          </div>
        </div>
      </header>

      <main className="container-x pt-8">
        {/* Welcome Banner */}
        <div className="noise relative overflow-hidden rounded-[28px] bg-gradient-to-r from-navy-950 via-navy-900 to-brand-700 p-6 text-white shadow-xl md:p-8">
          <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div className="flex items-center gap-4">
              <div className="grid size-14 place-items-center rounded-2xl bg-white/15 text-xl font-extrabold ring-2 ring-white/30">
                {order.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </div>
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-200">
                  <BadgeCheck className="size-4 text-emerald-300" /> iUsed Plus Member
                </span>
                <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl">
                  Welcome back, {order.fullName}
                </h1>
                <p className="mt-0.5 flex flex-wrap items-center gap-3 text-xs text-white/75">
                  <span className="inline-flex items-center gap-1">
                    <Phone className="size-3.5 text-emerald-300" /> Active Line: {order.phone} (Verified)
                  </span>
                  <span>·</span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="size-3.5 text-brand-300" /> {order.address}
                  </span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-2xl bg-white/10 px-4 py-2.5 ring-1 ring-white/15">
                <p className="text-[11px] text-white/65">Active Orders</p>
                <p className="text-xl font-extrabold">1</p>
              </div>
              <div className="rounded-2xl bg-white/10 px-4 py-2.5 ring-1 ring-white/15">
                <p className="text-[11px] text-white/65">Warranty Vault</p>
                <p className="text-xl font-extrabold">{order.items.length}</p>
              </div>
              <div className="rounded-2xl bg-white/10 px-4 py-2.5 ring-1 ring-white/15">
                <p className="text-[11px] text-white/65">Trade-In Credit</p>
                <p className="text-xl font-extrabold text-emerald-300">$450</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mt-6 flex flex-wrap gap-2">
          {[
            { id: "orders", label: "Track Your Order & Delivery", icon: Truck },
            { id: "warranty", label: "72-Point Certificates & Warranty", icon: ShieldCheck },
            { id: "wishlist", label: `Saved Devices (${wishedProducts.length})`, icon: Heart },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as typeof activeTab)}
              className={clsx(
                "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-extrabold transition md:text-sm",
                activeTab === id
                  ? "bg-brand-600 text-white shadow-lg shadow-brand-600/25"
                  : "bg-white text-slate-600 ring-1 ring-line hover:bg-brand-50 hover:text-brand-600",
              )}
            >
              <Icon className="size-4" />
              {label}
            </button>
          ))}
        </div>

        {/* TAB 1: TRACK YOUR ORDER — matching the bottom-right reference screen */}
        {activeTab === "orders" && (
          <div className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_1fr]">
            {/* Left: Order Timeline */}
            <div className="rounded-[28px] bg-white p-6 shadow-xs ring-1 ring-line md:p-8">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
                    Live Courier Tracking
                  </span>
                  <h2 className="text-xl font-extrabold text-ink">Track Your Order · #{order.id}</h2>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-extrabold text-emerald-700 ring-1 ring-emerald-200">
                  In Transit · On Schedule
                </span>
              </div>

              <div className="mt-6 space-y-5">
                {[
                  {
                    title: "Order Placed",
                    time: `${order.date}, 10:34 AM`,
                    desc: "Order confirmed & payment authorized.",
                    done: true,
                  },
                  {
                    title: "Processing & 72-Point Final QA",
                    time: `${order.date}, 02:15 PM`,
                    desc: "Battery health, Face ID, cameras & IMEI certificate sealed.",
                    done: true,
                  },
                  {
                    title: "Shipped via iUsed Express",
                    time: "Today, 09:30 AM",
                    desc: `Courier assigned. Active SMS notifications sent to ${order.phone}.`,
                    done: true,
                  },
                  {
                    title: "Out for Delivery",
                    time: "Expected Today by 05:30 PM",
                    desc: `Driver will call ${order.phone} 15 mins before reaching ${order.address}.`,
                    done: false,
                  },
                  {
                    title: "Delivered",
                    time: "Pending signature / OTP",
                    desc: "12-Month Warranty & 30-Day Return window starts upon delivery.",
                    done: false,
                  },
                ].map((step, idx) => (
                  <div key={step.title} className="relative flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <span
                        className={clsx(
                          "grid size-7 place-items-center rounded-full text-xs font-extrabold",
                          step.done
                            ? "bg-brand-600 text-white shadow-md shadow-brand-600/30"
                            : "border-2 border-line bg-surface text-muted",
                        )}
                      >
                        {step.done ? <CheckCircle2 className="size-4" /> : idx + 1}
                      </span>
                      {idx < 4 && (
                        <span
                          className={clsx(
                            "mt-1 h-9 w-0.5",
                            step.done ? "bg-brand-500" : "bg-line",
                          )}
                        />
                      )}
                    </div>
                    <div className="pb-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className={clsx("text-sm font-extrabold", step.done ? "text-ink" : "text-muted")}>
                          {step.title}
                        </p>
                        <span className="text-xs font-semibold text-muted">· {step.time}</span>
                      </div>
                      <p className="mt-0.5 text-xs text-muted">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Delivery Pin Map Card + Ordered Items */}
            <div className="space-y-6">
              <div className="rounded-[28px] bg-white p-6 shadow-xs ring-1 ring-line">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-extrabold text-ink">Verified Drop-Off &amp; Active Line</h3>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-600">
                    <LocateFixed className="size-3.5" /> GPS Locked
                  </span>
                </div>

                {/* Stylized Map Preview matching bottom-right of reference */}
                <div className="relative mt-4 h-44 overflow-hidden rounded-2xl bg-gradient-to-br from-brand-50 via-[#e4edff] to-emerald-50 ring-1 ring-line">
                  <div
                    className="absolute inset-0 opacity-45"
                    style={{
                      backgroundImage:
                        "linear-gradient(to right, #cbd5e1 1px, transparent 1px), linear-gradient(to bottom, #cbd5e1 1px, transparent 1px)",
                      backgroundSize: "28px 28px",
                    }}
                  />
                  {/* Route line */}
                  <svg viewBox="0 0 400 180" className="absolute inset-0 size-full">
                    <path
                      d="M 40 140 Q 170 40 320 95"
                      fill="none"
                      stroke="#2f66ff"
                      strokeWidth="4"
                      strokeDasharray="6 6"
                    />
                  </svg>
                  {/* Courier truck pill */}
                  <div className="absolute left-1/3 top-1/3 flex items-center gap-1.5 rounded-full bg-brand-600 px-3 py-1 text-[11px] font-extrabold text-white shadow-lg">
                    <Truck className="size-3.5" /> Courier 4.2 km away
                  </div>
                  {/* Destination pin */}
                  <div className="absolute right-10 top-1/2 -translate-y-1/2 flex flex-col items-center">
                    <span className="grid size-9 place-items-center rounded-full bg-navy-950 text-white shadow-lg ring-4 ring-brand-300/60">
                      <MapPin className="size-4 text-brand-300" />
                    </span>
                    <span className="mt-1 rounded-md bg-white/95 px-2 py-0.5 text-[10px] font-extrabold text-ink shadow">
                      {order.coords ? `${order.coords.lat}, ${order.coords.lng}` : "Algiers Pin"}
                    </span>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-surface p-3.5">
                    <p className="text-[11px] font-bold uppercase text-muted">Shipping Address</p>
                    <p className="mt-1 text-xs font-extrabold text-ink">{order.address}</p>
                  </div>
                  <div className="rounded-2xl bg-surface p-3.5">
                    <p className="text-[11px] font-bold uppercase text-muted">Active Courier Phone</p>
                    <p className="mt-1 text-xs font-extrabold text-emerald-700">{order.phone}</p>
                  </div>
                </div>
              </div>

              {/* Items in Order */}
              <div className="rounded-[28px] bg-white p-6 shadow-xs ring-1 ring-line">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-extrabold text-ink">Devices in Order #{order.id}</h3>
                  <span className="text-sm font-extrabold text-brand-600">{formatPrice(order.total)}</span>
                </div>
                <div className="mt-4 space-y-3">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-2xl bg-surface p-3 ring-1 ring-line"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative size-12 overflow-hidden rounded-xl bg-white">
                          <Image src={item.image} alt={item.name} fill sizes="48px" className="object-cover" />
                        </div>
                        <div>
                          <p className="text-sm font-extrabold text-ink">{item.name} × {item.qty}</p>
                          <p className="text-xs text-muted">{item.variant}</p>
                        </div>
                      </div>
                      <span className="text-sm font-extrabold text-ink">{formatPrice(item.price * item.qty)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: WARRANTY & 72-POINT CERTIFICATES */}
        {activeTab === "warranty" && (
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {order.items.map((item) => (
              <div key={item.id} className="rounded-[28px] bg-white p-6 shadow-xs ring-1 ring-line">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-extrabold text-emerald-700">
                    <ShieldCheck className="size-4" /> Active 12-Month Warranty
                  </span>
                  <span className="font-mono text-xs font-bold text-muted">IMEI: 35892110••••842</span>
                </div>
                <div className="mt-4 flex items-center gap-4">
                  <div className="relative size-16 overflow-hidden rounded-2xl bg-surface">
                    <Image src={item.image} alt={item.name} fill sizes="64px" className="object-cover" />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-ink">{item.name}</h3>
                    <p className="text-xs text-muted">{item.variant}</p>
                    <p className="mt-1 flex items-center gap-2 text-xs font-bold text-emerald-600">
                      <BatteryFull className="size-4" /> 96% Battery Health · 72/72 Lab Checks Passed
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: SAVED WISHLIST */}
        {activeTab === "wishlist" && (
          <div className="mt-6">
            {wishedProducts.length === 0 ? (
              <div className="rounded-[28px] bg-white p-10 text-center ring-1 ring-line">
                <Package className="mx-auto size-10 text-brand-500" />
                <h3 className="mt-3 text-lg font-extrabold text-ink">No saved devices yet</h3>
                <p className="mt-1 text-xs text-muted">Tap the heart icon on any device card to save it here.</p>
                <Link
                  href="/#popular"
                  className="mt-4 inline-flex rounded-full bg-brand-600 px-6 py-2.5 text-xs font-extrabold text-white"
                >
                  Explore Gadgets
                </Link>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {wishedProducts.map((p) => (
                  <div key={p.id} className="flex items-center justify-between rounded-2xl bg-white p-4 ring-1 ring-line">
                    <div className="flex items-center gap-3">
                      <div className="relative size-14 overflow-hidden rounded-xl bg-surface">
                        <Image src={p.image} alt={p.name} fill sizes="56px" className="object-cover" />
                      </div>
                      <div>
                        <p className="text-sm font-extrabold text-ink">{p.name}</p>
                        <p className="text-xs font-bold text-brand-600">{formatPrice(p.price)}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        addToCart(p);
                        setCartOpen(true);
                      }}
                      className="rounded-xl bg-brand-600 px-3.5 py-2 text-xs font-extrabold text-white"
                    >
                      Add to Bag
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
