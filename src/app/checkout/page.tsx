"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import {
  ArrowLeft,
  ArrowRight,
  Banknote,
  CheckCircle2,
  ChevronDown,
  CreditCard,
  Loader2,
  LocateFixed,
  MapPin,
  Minus,
  Phone,
  Plus,
  ShieldCheck,
  Sparkles,
  Trash2,
  Truck,
} from "lucide-react";
import Logo from "@/components/ui/Logo";
import {
  useStore,
  cartCount,
  cartTotal,
  FREE_SHIPPING_THRESHOLD,
} from "@/store/useStore";
import { formatPrice } from "@/lib/products";

export default function CheckoutPage() {
  const cart = useStore((s) => s.cart);
  const setQty = useStore((s) => s.setQty);
  const removeFromCart = useStore((s) => s.removeFromCart);
  const clearCart = useStore((s) => s.clearCart);

  const [mounted, setMounted] = useState(false);
  const [mobileSummaryOpen, setMobileSummaryOpen] = useState(false);

  // Shipping & Live Location
  const [fullName, setFullName] = useState("Sarah Ahmed");
  const [address, setAddress] = useState("12 Rue des Fleurs");
  const [city, setCity] = useState("Algiers");
  const [postalCode, setPostalCode] = useState("16000");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [locNote, setLocNote] = useState<string | null>(null);

  // Active Phone Number
  const [countryCode, setCountryCode] = useState("+213");
  const [phone, setPhone] = useState("555 123 456");
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");

  // Payment
  const [payMethod, setPayMethod] = useState<"card" | "paypal" | "apple" | "cod">("card");
  const [cardNumber, setCardNumber] = useState("4532 •••• •••• 3456");
  const [expiry, setExpiry] = useState("04/28");
  const [cvv, setCvv] = useState("123");

  // Confirmed order
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const count = cartCount(cart);
  const subtotal = cartTotal(cart);
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 15;
  const total = subtotal + shipping;

  const handleDetectLocation = () => {
    setLocating(true);
    setLocNote(null);

    if (!("geolocation" in navigator)) {
      setLocating(false);
      setLocNote("Geolocation is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoords({ lat: Number(latitude.toFixed(5)), lng: Number(longitude.toFixed(5)) });
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
          );
          if (res.ok) {
            const data = await res.json();
            const a = data.address || {};
            const street = [a.house_number, a.road || a.neighbourhood || a.suburb]
              .filter(Boolean)
              .join(" ");
            if (street) setAddress(street);
            else if (data.display_name) setAddress(data.display_name.split(",").slice(0, 2).join(","));
            if (a.city || a.town || a.state) setCity(a.city || a.town || a.state);
            if (a.postcode) setPostalCode(a.postcode);
            setLocNote("Live GPS coordinates locked for courier drop-off.");
          } else {
            setLocNote("GPS coordinates captured! Confirm street details below.");
          }
        } catch {
          setLocNote("GPS coordinates captured! Confirm street details below.");
        } finally {
          setLocating(false);
        }
      },
      () => {
        setCoords({ lat: 36.7538, lng: 3.0588 });
        setLocNote("Using approximate city coordinates (enable browser GPS for exact pin).");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 8000 },
    );
  };

  const handleSendOtp = () => {
    if (phone.replace(/\D/g, "").length < 6) return;
    setOtpSent(true);
    setOtpCode("4829");
    setTimeout(() => setPhoneVerified(true), 300);
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneVerified) handleSendOtp();
    const newId = `IU${Math.floor(100000 + Math.random() * 900000)}`;
    try {
      const savedOrder = {
        id: newId,
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        fullName,
        address: `${address}, ${city} ${postalCode}`,
        phone: `${countryCode} ${phone}`,
        coords,
        total,
        items: cart,
        payMethod,
      };
      localStorage.setItem("iused-last-order", JSON.stringify(savedOrder));
    } catch {
      // ignore
    }
    clearCart();
    setConfirmedOrderId(newId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#F4F7FE] pb-24 lg:pb-16">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-line bg-white/95 backdrop-blur">
        <div className="container-x flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="hidden rounded-full bg-emerald-50 px-3 py-1 text-xs font-extrabold text-emerald-700 sm:inline-flex sm:items-center sm:gap-1">
              <ShieldCheck className="size-3.5" /> 256-Bit Encrypted Checkout
            </span>
          </div>

          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3.5 py-2 text-xs font-extrabold text-ink ring-1 ring-line transition hover:bg-brand-50 hover:text-brand-600"
          >
            <ArrowLeft className="size-3.5" /> Continue Shopping
          </Link>
        </div>
      </header>

      {/* Mobile Collapsible Order Summary Bar */}
      {!confirmedOrderId && cart.length > 0 && (
        <div className="border-b border-line bg-brand-50/70 lg:hidden">
          <div className="container-x">
            <button
              type="button"
              onClick={() => setMobileSummaryOpen((o) => !o)}
              className="flex w-full items-center justify-between py-3.5 text-xs font-extrabold text-ink"
            >
              <span className="flex items-center gap-1.5 text-brand-600">
                {mobileSummaryOpen ? "Hide" : "Show"} Order Summary ({count} {count === 1 ? "item" : "items"})
                <ChevronDown className={clsx("size-4 transition-transform", mobileSummaryOpen && "rotate-180")} />
              </span>
              <span className="text-base font-extrabold text-ink">{formatPrice(total)}</span>
            </button>

            {mobileSummaryOpen && (
              <div className="space-y-2.5 border-t border-brand-100 pb-4 pt-3">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-2 text-xs">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <div className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-white">
                        <Image src={item.image} alt={item.name} fill sizes="40px" className="object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-bold text-ink">{item.name} × {item.qty}</p>
                        <p className="truncate text-[11px] text-muted">{item.variant}</p>
                      </div>
                    </div>
                    <span className="shrink-0 font-extrabold text-ink">{formatPrice(item.price * item.qty)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <main className="container-x pt-6 md:pt-10">
        {confirmedOrderId ? (
          <div className="mx-auto max-w-xl rounded-[32px] bg-white p-6 text-center shadow-xl ring-1 ring-line sm:p-10">
            <div className="mx-auto grid size-20 place-items-center rounded-full bg-brand-600 text-white shadow-xl shadow-brand-600/35">
              <CheckCircle2 className="size-10" />
            </div>
            <h1 className="mt-5 text-2xl font-extrabold text-ink sm:text-3xl">
              Order Placed Successfully!
            </h1>
            <p className="mt-1.5 text-sm text-muted">
              Thank you, <strong className="text-ink">{fullName}</strong>. Your order number is{" "}
              <strong className="text-brand-600">#{confirmedOrderId}</strong>.
            </p>
            <p className="mt-1 text-xs text-emerald-700">
              Courier alert enabled for active line <strong>{countryCode} {phone}</strong> · Delivering to{" "}
              <strong>{address}, {city}</strong>.
            </p>
            <p className="mt-4 font-script text-3xl text-brand-600">Enjoy your new phone! ♡</p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/dashboard"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand-600 px-7 text-sm font-extrabold text-white shadow-lg shadow-brand-600/30"
              >
                <Sparkles className="size-4" /> Track Live in User Dashboard
              </Link>
              <Link
                href="/shop"
                className="inline-flex h-12 items-center justify-center rounded-full bg-surface px-7 text-sm font-bold text-ink ring-1 ring-line hover:bg-brand-50"
              >
                Browse More Gadgets
              </Link>
            </div>
          </div>
        ) : cart.length === 0 ? (
          <div className="mx-auto max-w-lg rounded-[32px] bg-white p-8 text-center ring-1 ring-line sm:p-12">
            <h1 className="text-xl font-extrabold text-ink">Your bag is empty</h1>
            <p className="mt-1 text-xs text-muted">Add a certified pre-owned smartphone or gadget before checking out.</p>
            <Link
              href="/shop"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-brand-600 px-6 py-3 text-xs font-extrabold text-white shadow-lg shadow-brand-600/30"
            >
              Explore Full Inventory <ArrowRight className="size-4" />
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmitOrder} className="grid items-start gap-6 lg:grid-cols-[1.2fr_0.85fr] lg:gap-8">
            {/* LEFT COLUMN: Shipping + Active Phone + Payment */}
            <div className="space-y-5 sm:space-y-6">
              {/* 1. Shipping & Live GPS */}
              <section className="rounded-[28px] bg-white p-5 shadow-xs ring-1 ring-line sm:p-7">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="grid size-7 place-items-center rounded-full bg-brand-600 text-xs font-extrabold text-white">
                      1
                    </span>
                    <h2 className="text-base font-extrabold text-ink sm:text-lg">
                      Shipping Address &amp; Live GPS Pin
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={handleDetectLocation}
                    disabled={locating}
                    className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3.5 py-2 text-xs font-extrabold text-brand-600 ring-1 ring-brand-200 transition hover:bg-brand-600 hover:text-white"
                  >
                    {locating ? <Loader2 className="size-3.5 animate-spin" /> : <LocateFixed className="size-3.5" />}
                    {locating ? "Detecting GPS…" : "Auto-Detect My Location"}
                  </button>
                </div>

                {coords && (
                  <div className="mt-4 flex items-start gap-2.5 rounded-2xl bg-emerald-50 p-3.5 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-200">
                    <MapPin className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                    <div>
                      <p className="font-extrabold">
                        Live Coordinates Locked: {coords.lat}, {coords.lng}
                      </p>
                      {locNote && <p className="mt-0.5 text-[11px] text-emerald-700">{locNote}</p>}
                    </div>
                  </div>
                )}

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <label className="block sm:col-span-2">
                    <span className="text-xs font-bold text-ink">Full Name</span>
                    <input
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="mt-1.5 h-12 w-full rounded-xl bg-surface px-4 text-sm font-semibold text-ink ring-1 ring-line outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </label>
                  <label className="block sm:col-span-2">
                    <span className="text-xs font-bold text-ink">Street Address</span>
                    <input
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="mt-1.5 h-12 w-full rounded-xl bg-surface px-4 text-sm font-semibold text-ink ring-1 ring-line outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs font-bold text-ink">City / State</span>
                    <input
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="mt-1.5 h-12 w-full rounded-xl bg-surface px-4 text-sm font-semibold text-ink ring-1 ring-line outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs font-bold text-ink">Postal Code</span>
                    <input
                      required
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="mt-1.5 h-12 w-full rounded-xl bg-surface px-4 text-sm font-semibold text-ink ring-1 ring-line outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </label>
                </div>
              </section>

              {/* 2. Active Phone Number Verification */}
              <section className="rounded-[28px] bg-white p-5 shadow-xs ring-1 ring-line sm:p-7">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="grid size-7 place-items-center rounded-full bg-brand-600 text-xs font-extrabold text-white">
                      2
                    </span>
                    <h2 className="text-base font-extrabold text-ink sm:text-lg">
                      Active Phone Number for Courier
                    </h2>
                  </div>

                  {phoneVerified ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-extrabold text-emerald-700 ring-1 ring-emerald-200">
                      <CheckCircle2 className="size-3.5" /> Active Line Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600">
                      <Phone className="size-3.5" /> Instant SMS Check
                    </span>
                  )}
                </div>

                <p className="mt-1.5 text-xs text-muted">
                  We verify your active phone number so the courier can reach you 15 minutes before hand-off.
                </p>

                <div className="mt-4 flex flex-wrap gap-2.5 sm:flex-nowrap">
                  <select
                    value={countryCode}
                    onChange={(e) => {
                      setCountryCode(e.target.value);
                      setPhoneVerified(false);
                    }}
                    className="h-12 rounded-xl bg-surface px-3 text-sm font-extrabold text-ink ring-1 ring-line outline-none"
                  >
                    <option value="+213">🇩🇿 +213</option>
                    <option value="+1">🇺🇸 +1</option>
                    <option value="+44">🇬🇧 +44</option>
                    <option value="+33">🇫🇷 +33</option>
                    <option value="+234">🇳🇬 +234</option>
                    <option value="+971">🇦🇪 +971</option>
                  </select>

                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      setPhoneVerified(false);
                    }}
                    placeholder="555 123 456"
                    className="h-12 min-w-[160px] flex-1 rounded-xl bg-surface px-4 text-sm font-semibold text-ink ring-1 ring-line outline-none focus:ring-2 focus:ring-brand-500"
                  />

                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className={clsx(
                      "h-12 w-full rounded-xl px-5 text-xs font-extrabold text-white transition sm:w-auto",
                      phoneVerified ? "bg-emerald-600" : "bg-navy-950 hover:bg-brand-600",
                    )}
                  >
                    {phoneVerified ? "✓ Verified" : "Verify Active Line"}
                  </button>
                </div>

                {otpSent && (
                  <div className="mt-3 flex items-center justify-between rounded-xl bg-brand-50 px-4 py-2.5 text-xs">
                    <span className="font-semibold text-brand-900">
                      SMS code <strong className="font-mono">{otpCode}</strong> confirmed on {countryCode} {phone}
                    </span>
                    <CheckCircle2 className="size-4 text-emerald-600" />
                  </div>
                )}
              </section>

              {/* 3. Payment Method */}
              <section className="rounded-[28px] bg-white p-5 shadow-xs ring-1 ring-line sm:p-7">
                <div className="flex items-center gap-2.5">
                  <span className="grid size-7 place-items-center rounded-full bg-brand-600 text-xs font-extrabold text-white">
                    3
                  </span>
                  <h2 className="text-base font-extrabold text-ink sm:text-lg">Payment Method</h2>
                </div>

                <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                  {[
                    { id: "card", label: "Credit / Debit Card", badge: "VISA · MC" },
                    { id: "paypal", label: "PayPal", badge: "PayPal" },
                    { id: "apple", label: "Apple Pay", badge: "Pay" },
                    { id: "cod", label: "Cash on Delivery", badge: "Pay at door" },
                  ].map((m) => (
                    <label
                      key={m.id}
                      onClick={() => setPayMethod(m.id as typeof payMethod)}
                      className={clsx(
                        "flex cursor-pointer items-center justify-between rounded-2xl p-3.5 ring-1 transition",
                        payMethod === m.id
                          ? "bg-brand-50/70 ring-2 ring-brand-600"
                          : "bg-surface/60 ring-line hover:bg-surface",
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="payMethod"
                          checked={payMethod === m.id}
                          onChange={() => setPayMethod(m.id as typeof payMethod)}
                          className="accent-brand-600"
                        />
                        <span className="text-sm font-bold text-ink">{m.label}</span>
                      </div>
                      <span className="rounded-md bg-white px-2 py-0.5 text-[11px] font-extrabold text-brand-700 ring-1 ring-line">
                        {m.badge}
                      </span>
                    </label>
                  ))}
                </div>

                {payMethod === "card" && (
                  <div className="mt-4 grid gap-4 border-t border-line pt-4 sm:grid-cols-2">
                    <label className="block sm:col-span-2">
                      <span className="text-xs font-bold text-ink">Card Number</span>
                      <div className="relative mt-1.5">
                        <input
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="h-12 w-full rounded-xl bg-surface pl-10 pr-4 font-mono text-sm font-semibold text-ink ring-1 ring-line outline-none"
                        />
                        <CreditCard className="absolute left-3.5 top-3.5 size-4 text-muted" />
                      </div>
                    </label>
                    <label className="block">
                      <span className="text-xs font-bold text-ink">Expiry Date</span>
                      <input
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        className="mt-1.5 h-12 w-full rounded-xl bg-surface px-4 font-mono text-sm font-semibold text-ink ring-1 ring-line outline-none"
                      />
                    </label>
                    <label className="block">
                      <span className="text-xs font-bold text-ink">CVV</span>
                      <input
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        className="mt-1.5 h-12 w-full rounded-xl bg-surface px-4 font-mono text-sm font-semibold text-ink ring-1 ring-line outline-none"
                      />
                    </label>
                  </div>
                )}

                {payMethod === "cod" && (
                  <div className="mt-4 flex items-center gap-3 rounded-2xl bg-emerald-50 p-4 text-xs font-medium text-emerald-800">
                    <Banknote className="size-5 shrink-0 text-emerald-600" />
                    Inspect your phone and test the battery &amp; cameras in person before paying cash to the courier.
                  </div>
                )}
              </section>
            </div>

            {/* RIGHT COLUMN: Sticky Order Summary */}
            <aside className="rounded-[28px] bg-white p-5 shadow-sm ring-1 ring-line sm:p-7 lg:sticky lg:top-24">
              <h2 className="text-lg font-extrabold text-ink">Order Summary ({count})</h2>

              <div className="mt-4 max-h-80 space-y-3 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 rounded-2xl bg-surface p-3 ring-1 ring-line"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-white">
                        <Image src={item.image} alt={item.name} fill sizes="56px" className="object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-extrabold text-ink">{item.name}</p>
                        <p className="truncate text-[11px] text-muted">{item.variant}</p>
                        <div className="mt-1.5 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setQty(item.id, item.qty - 1)}
                            className="grid size-5 place-items-center rounded bg-white text-ink shadow-xs"
                          >
                            <Minus className="size-3" />
                          </button>
                          <span className="text-xs font-extrabold">{item.qty}</span>
                          <button
                            type="button"
                            onClick={() => setQty(item.id, item.qty + 1)}
                            className="grid size-5 place-items-center rounded bg-white text-ink shadow-xs"
                          >
                            <Plus className="size-3" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="text-slate-400 hover:text-rose-500"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                      <span className="text-sm font-extrabold text-ink">{formatPrice(item.price * item.qty)}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 space-y-2 border-t border-line pt-4 text-sm">
                <div className="flex justify-between text-muted">
                  <span>Subtotal</span>
                  <span className="font-bold text-ink">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>Express Courier</span>
                  <span className="font-bold text-emerald-600">
                    {shipping === 0 ? "FREE" : formatPrice(shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>12-Month iUsed Warranty</span>
                  <span className="font-bold text-emerald-600">Included</span>
                </div>
                <div className="flex justify-between border-t border-line pt-3 text-lg font-extrabold text-ink">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <button
                type="submit"
                className="mt-5 hidden h-13 w-full items-center justify-center gap-2 rounded-full bg-brand-600 text-sm font-extrabold text-white shadow-xl shadow-brand-600/35 transition hover:bg-brand-700 lg:flex"
              >
                Confirm &amp; Place Order · {formatPrice(total)}
                <ArrowRight className="size-4" />
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted">
                <Truck className="size-4 text-brand-600" />
                Ships within 24h · 30-day money-back returns
              </div>
            </aside>

            {/* Mobile Sticky Bottom Checkout Bar */}
            <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 p-3.5 shadow-[0_-10px_30px_rgba(11,19,36,0.1)] backdrop-blur lg:hidden">
              <div className="container-x flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-bold text-muted">Total ({count})</p>
                  <p className="text-lg font-extrabold leading-tight text-ink">{formatPrice(total)}</p>
                </div>
                <button
                  type="submit"
                  className="flex h-12 flex-1 max-w-xs items-center justify-center gap-2 rounded-full bg-brand-600 px-6 text-sm font-extrabold text-white shadow-lg shadow-brand-600/35"
                >
                  Confirm Order
                  <ArrowRight className="size-4" />
                </button>
              </div>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
