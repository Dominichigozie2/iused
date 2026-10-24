"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import {
  X,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  ArrowRight,
  MapPin,
  Phone,
  CheckCircle2,
  ShieldCheck,
  Truck,
  LocateFixed,
  Loader2,
  CreditCard,
  Banknote,
  Sparkles,
  Maximize2,
} from "lucide-react";
import {
  useStore,
  cartCount,
  cartTotal,
  FREE_SHIPPING_THRESHOLD,
} from "@/store/useStore";
import { formatPrice } from "@/lib/products";

type Step = "cart" | "shipping" | "payment" | "success";

export default function CartDrawer() {
  const cart = useStore((s) => s.cart);
  const cartOpen = useStore((s) => s.cartOpen);
  const setCartOpen = useStore((s) => s.setCartOpen);
  const setQty = useStore((s) => s.setQty);
  const removeFromCart = useStore((s) => s.removeFromCart);
  const clearCart = useStore((s) => s.clearCart);

  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<Step>("cart");

  // Shipping + Location + Active Phone state
  const [fullName, setFullName] = useState("Sarah Ahmed");
  const [address, setAddress] = useState("12 Rue des Fleurs");
  const [city, setCity] = useState("Algiers");
  const [postalCode, setPostalCode] = useState("16000");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [locNote, setLocNote] = useState<string | null>(null);

  const [countryCode, setCountryCode] = useState("+213");
  const [phone, setPhone] = useState("555 123 456");
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");

  // Payment state
  const [payMethod, setPayMethod] = useState<"card" | "paypal" | "apple" | "cod">("card");
  const [cardNumber, setCardNumber] = useState("4532 •••• •••• 3456");
  const [expiry, setExpiry] = useState("04/28");
  const [cvv, setCvv] = useState("123");
  const [orderId, setOrderId] = useState("IU784512");

  useEffect(() => setMounted(true), []);

  // Reset step to cart when reopened if previously on success
  useEffect(() => {
    if (!cartOpen && step === "success") {
      const t = setTimeout(() => setStep("cart"), 350);
      return () => clearTimeout(t);
    }
  }, [cartOpen, step]);

  if (!mounted) return null;

  const count = cartCount(cart);
  const subtotal = cartTotal(cart);
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 15;
  const total = subtotal + shipping;
  const freeShipProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  // Live GPS + Reverse Geocoding
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
    setTimeout(() => setPhoneVerified(true), 350);
  };

  const handleConfirmOrder = () => {
    const newId = `IU${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderId(newId);
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
      // ignore storage errors
    }
    clearCart();
    setStep("success");
  };

  const isCheckoutStep = step === "shipping" || step === "payment";

  return (
    <div
      className={clsx(
        "fixed inset-0 z-[80] transition-all duration-500",
        cartOpen ? "visible" : "invisible pointer-events-none",
      )}
    >
      {/* Backdrop */}
      <div
        onClick={() => setCartOpen(false)}
        className={clsx(
          "absolute inset-0 bg-navy-950/60 backdrop-blur-sm transition-opacity duration-500",
          cartOpen ? "opacity-100" : "opacity-0",
        )}
      />

      {/* Responsive Drawer Panel — expands on tablet/desktop during checkout */}
      <aside
        className={clsx(
          "absolute right-0 top-0 flex h-dvh max-h-dvh w-full flex-col bg-[#F5F8FF] shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          isCheckoutStep ? "sm:max-w-[520px] md:max-w-[580px]" : "sm:max-w-[440px]",
          cartOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        {/* Sticky Top Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-line bg-white px-4 py-3.5 sm:px-5 sm:py-4">
          <div className="flex items-center gap-2.5">
            {step !== "cart" && step !== "success" && (
              <button
                onClick={() => setStep(step === "payment" ? "shipping" : "cart")}
                aria-label="Back"
                className="grid size-8 place-items-center rounded-full bg-surface text-ink hover:bg-brand-50"
              >
                <ArrowLeft className="size-4" />
              </button>
            )}
            <h2 className="text-base font-extrabold text-ink sm:text-lg">
              {step === "cart" && `Your Cart (${count})`}
              {step === "shipping" && "Checkout · Shipping"}
              {step === "payment" && "Checkout · Payment"}
              {step === "success" && "Order Confirmed"}
            </h2>
          </div>

          <div className="flex items-center gap-1.5">
            {cart.length > 0 && step !== "success" && (
              <Link
                href="/checkout"
                onClick={() => setCartOpen(false)}
                className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-1.5 text-[11px] font-extrabold text-brand-600 transition hover:bg-brand-600 hover:text-white"
              >
                <Maximize2 className="size-3" />
                <span className="hidden min-[380px]:inline">Full Page</span>
              </Link>
            )}
            <button
              onClick={() => setCartOpen(false)}
              aria-label="Close drawer"
              className="grid size-9 place-items-center rounded-full bg-surface text-slate-600 hover:bg-rose-50 hover:text-rose-600"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        {/* Interactive Step Indicator for Checkout */}
        {isCheckoutStep && (
          <div className="flex shrink-0 items-center justify-between border-b border-line bg-white px-4 py-2.5 text-[11px] font-bold sm:px-6 sm:py-3 sm:text-xs">
            <button
              type="button"
              onClick={() => setStep("shipping")}
              className="flex items-center gap-1.5 text-brand-600"
            >
              <span className="grid size-5 place-items-center rounded-full bg-brand-600 text-[10px] text-white">1</span>
              Shipping
            </button>
            <div className="mx-2 h-px flex-1 bg-line sm:mx-3" />
            <button
              type="button"
              onClick={() => setStep("payment")}
              className={clsx("flex items-center gap-1.5", step === "payment" ? "text-brand-600" : "text-muted")}
            >
              <span
                className={clsx(
                  "grid size-5 place-items-center rounded-full text-[10px]",
                  step === "payment" ? "bg-brand-600 text-white" : "bg-surface text-muted",
                )}
              >
                2
              </span>
              Payment
            </button>
            <div className="mx-2 h-px flex-1 bg-line sm:mx-3" />
            <div className="flex items-center gap-1.5 text-muted">
              <span className="grid size-5 place-items-center rounded-full bg-surface text-[10px]">3</span>
              <span className="hidden min-[360px]:inline">Confirmation</span>
              <span className="min-[360px]:hidden">Done</span>
            </div>
          </div>
        )}

        {/* STEP 0: CART VIEW */}
        {step === "cart" && (
          <>
            {/* Free shipping bar */}
            <div className="shrink-0 bg-brand-50/80 px-4 py-2.5 text-xs sm:px-5 sm:py-3">
              <div className="flex items-center justify-between gap-2 font-semibold text-ink">
                <span className="flex items-center gap-1.5 truncate">
                  <Truck className="size-4 shrink-0 text-brand-600" />
                  <span className="truncate">
                    {subtotal >= FREE_SHIPPING_THRESHOLD
                      ? "Unlocked FREE Express Courier Delivery!"
                      : `Add ${formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} more for FREE delivery`}
                  </span>
                </span>
                <span className="shrink-0 font-bold text-brand-600">{Math.round(freeShipProgress)}%</span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-brand-100">
                <div
                  className="h-full rounded-full bg-brand-600 transition-all duration-500"
                  style={{ width: `${freeShipProgress}%` }}
                />
              </div>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto p-4 sm:p-5">
              {cart.length === 0 ? (
                <div className="flex h-72 flex-col items-center justify-center text-center">
                  <p className="text-base font-extrabold text-ink">Your cart is currently empty</p>
                  <p className="mt-1 max-w-xs text-xs text-muted">
                    Explore our 72-point certified pre-owned gadgets and add your favorite device.
                  </p>
                  <Link
                    href="/shop"
                    onClick={() => setCartOpen(false)}
                    className="mt-5 rounded-full bg-brand-600 px-6 py-2.5 text-xs font-extrabold text-white shadow-lg shadow-brand-600/30"
                  >
                    Browse Full Phone Inventory
                  </Link>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-xs ring-1 ring-line"
                  >
                    <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-surface sm:size-18">
                      <Image src={item.image} alt={item.name} fill sizes="72px" className="object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="truncate text-sm font-extrabold text-ink">{item.name}</h3>
                          <p className="truncate text-[11px] text-muted">{item.variant}</p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          aria-label="Remove item"
                          className="shrink-0 p-1 text-slate-400 hover:text-rose-500"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>

                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-sm font-extrabold text-ink">{formatPrice(item.price)}</span>
                        <div className="flex items-center gap-2 rounded-full bg-surface px-2 py-1 ring-1 ring-line">
                          <button
                            onClick={() => setQty(item.id, item.qty - 1)}
                            aria-label="Decrease quantity"
                            className="grid size-6 place-items-center rounded-full bg-white text-ink shadow-xs"
                          >
                            <Minus className="size-3" />
                          </button>
                          <span className="min-w-4 text-center text-xs font-extrabold">{item.qty}</span>
                          <button
                            onClick={() => setQty(item.id, item.qty + 1)}
                            aria-label="Increase quantity"
                            className="grid size-6 place-items-center rounded-full bg-white text-ink shadow-xs"
                          >
                            <Plus className="size-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="shrink-0 border-t border-line bg-white p-4 sm:p-5">
                <div className="space-y-1.5 text-xs sm:text-sm">
                  <div className="flex justify-between text-muted">
                    <span>Subtotal</span>
                    <span className="font-bold text-ink">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-muted">
                    <span>Shipping</span>
                    <span className="font-bold text-emerald-600">
                      {shipping === 0 ? "$0.00 (Free)" : formatPrice(shipping)}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-line pt-2 text-sm font-extrabold text-ink sm:text-base">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                <div className="mt-3.5 grid gap-2 sm:grid-cols-2">
                  <button
                    onClick={() => setStep("shipping")}
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-600 text-xs font-extrabold text-white shadow-lg shadow-brand-600/35 transition hover:bg-brand-700 sm:col-span-2 sm:text-sm"
                  >
                    Proceed to Checkout
                    <ArrowRight className="size-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* STEP 1: SHIPPING ADDRESS + LIVE LOCATION + ACTIVE PHONE */}
        {step === "shipping" && (
          <>
            <div className="flex-1 space-y-3.5 overflow-y-auto p-3.5 sm:space-y-4 sm:p-5">
              <div className="rounded-2xl bg-white p-3.5 shadow-xs ring-1 ring-line sm:p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-sm font-extrabold text-ink">Shipping Address &amp; Live Pin</h3>
                  <button
                    type="button"
                    onClick={handleDetectLocation}
                    disabled={locating}
                    className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1.5 text-xs font-extrabold text-brand-600 ring-1 ring-brand-200 transition hover:bg-brand-600 hover:text-white"
                  >
                    {locating ? <Loader2 className="size-3.5 animate-spin" /> : <LocateFixed className="size-3.5" />}
                    {locating ? "Locating…" : "Use My Live Location"}
                  </button>
                </div>

                {coords && (
                  <div className="mt-3 flex items-start gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-200">
                    <MapPin className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                    <div className="min-w-0">
                      <p className="font-bold">
                        GPS Pin: {coords.lat}, {coords.lng}
                      </p>
                      {locNote && <p className="text-[11px] text-emerald-700">{locNote}</p>}
                    </div>
                  </div>
                )}

                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <label className="block sm:col-span-2">
                    <span className="text-[11px] font-bold text-muted">Full Name</span>
                    <input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="mt-1 h-11 w-full rounded-xl bg-surface px-3.5 text-sm font-semibold text-ink ring-1 ring-line outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </label>

                  <label className="block sm:col-span-2">
                    <span className="text-[11px] font-bold text-muted">Street Address</span>
                    <input
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="mt-1 h-11 w-full rounded-xl bg-surface px-3.5 text-sm font-semibold text-ink ring-1 ring-line outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </label>

                  <label className="block">
                    <span className="text-[11px] font-bold text-muted">City</span>
                    <input
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="mt-1 h-11 w-full rounded-xl bg-surface px-3.5 text-sm font-semibold text-ink ring-1 ring-line outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </label>
                  <label className="block">
                    <span className="text-[11px] font-bold text-muted">Postal Code</span>
                    <input
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="mt-1 h-11 w-full rounded-xl bg-surface px-3.5 text-sm font-semibold text-ink ring-1 ring-line outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </label>
                </div>
              </div>

              {/* Active Phone Number Verification Card — fully responsive on 320px+ */}
              <div className="rounded-2xl bg-white p-3.5 shadow-xs ring-1 ring-line sm:p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Phone className="size-4 text-brand-600" />
                    <h3 className="text-sm font-extrabold text-ink">Active Phone Number</h3>
                  </div>
                  {phoneVerified ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-extrabold text-emerald-700">
                      <CheckCircle2 className="size-3.5" /> Active Line Verified
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold text-amber-600">Required for courier call</span>
                  )}
                </div>

                <p className="mt-1 text-xs text-muted">
                  Our driver calls or texts your active number 15 minutes before arrival.
                </p>

                <div className="mt-3 flex flex-wrap gap-2 sm:flex-nowrap">
                  <select
                    value={countryCode}
                    onChange={(e) => {
                      setCountryCode(e.target.value);
                      setPhoneVerified(false);
                    }}
                    className="h-11 rounded-xl bg-surface px-2.5 text-xs font-extrabold text-ink ring-1 ring-line outline-none"
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
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      setPhoneVerified(false);
                    }}
                    placeholder="555 123 456"
                    className="h-11 min-w-[140px] flex-1 rounded-xl bg-surface px-3.5 text-sm font-semibold text-ink ring-1 ring-line outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  {!phoneVerified && (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="h-11 w-full rounded-xl bg-navy-950 px-4 text-xs font-extrabold text-white transition hover:bg-brand-600 sm:w-auto"
                    >
                      Verify Line
                    </button>
                  )}
                </div>

                {otpSent && (
                  <div className="mt-2.5 flex items-center justify-between gap-2 rounded-xl bg-brand-50 px-3 py-2 text-xs">
                    <span className="font-semibold text-brand-900">
                      SMS code <strong className="font-mono">{otpCode}</strong> verified on {countryCode} {phone}
                    </span>
                    <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
                  </div>
                )}
              </div>

              {/* Order Summary Preview */}
              <div className="rounded-2xl bg-white p-3.5 shadow-xs ring-1 ring-line sm:p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-extrabold text-ink">Order Summary ({count})</h3>
                  <button onClick={() => setStep("cart")} className="text-xs font-bold text-brand-600">
                    Edit Cart
                  </button>
                </div>
                <div className="mt-3 space-y-2.5">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-2 text-xs">
                      <div className="flex min-w-0 items-center gap-2.5">
                        <div className="relative size-9 shrink-0 overflow-hidden rounded-lg bg-surface">
                          <Image src={item.image} alt={item.name} fill sizes="36px" className="object-cover" />
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
              </div>
            </div>

            {/* Sticky Pinned Footer for Shipping Step */}
            <div className="shrink-0 border-t border-line bg-white p-4 sm:p-5">
              <div className="mb-2.5 flex items-center justify-between text-xs font-bold text-muted">
                <span>Total (incl. free warranty)</span>
                <span className="text-base font-extrabold text-ink">{formatPrice(total)}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (!phoneVerified) handleSendOtp();
                  setStep("payment");
                }}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-600 text-sm font-extrabold text-white shadow-lg shadow-brand-600/35 transition hover:bg-brand-700"
              >
                Continue to Payment
                <ArrowRight className="size-4" />
              </button>
            </div>
          </>
        )}

        {/* STEP 2: PAYMENT METHOD */}
        {step === "payment" && (
          <>
            <div className="flex-1 space-y-3.5 overflow-y-auto p-3.5 sm:space-y-4 sm:p-5">
              <div className="space-y-2.5 rounded-2xl bg-white p-3.5 shadow-xs ring-1 ring-line sm:p-4">
                <div className="grid gap-2 sm:grid-cols-2">
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
                        "flex cursor-pointer items-center justify-between rounded-xl p-3 ring-1 transition",
                        payMethod === m.id
                          ? "bg-brand-50/70 ring-2 ring-brand-600"
                          : "bg-surface/60 ring-line hover:bg-surface",
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="payMethod"
                          checked={payMethod === m.id}
                          onChange={() => setPayMethod(m.id as typeof payMethod)}
                          className="accent-brand-600"
                        />
                        <span className="text-xs font-bold text-ink sm:text-sm">{m.label}</span>
                      </div>
                      <span className="rounded-md bg-white px-2 py-0.5 text-[10px] font-extrabold text-brand-700 ring-1 ring-line">
                        {m.badge}
                      </span>
                    </label>
                  ))}
                </div>

                {payMethod === "card" && (
                  <div className="mt-3 space-y-3 border-t border-line pt-3">
                    <label className="block">
                      <span className="text-[11px] font-bold text-muted">Card Number</span>
                      <div className="relative mt-1">
                        <input
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="h-11 w-full rounded-xl bg-surface pl-9 pr-3 font-mono text-sm font-semibold text-ink ring-1 ring-line outline-none"
                        />
                        <CreditCard className="absolute left-3 top-3 size-4 text-muted" />
                      </div>
                    </label>
                    <div className="grid grid-cols-1 gap-3 min-[360px]:grid-cols-2">
                      <label className="block">
                        <span className="text-[11px] font-bold text-muted">Expiry Date</span>
                        <input
                          value={expiry}
                          onChange={(e) => setExpiry(e.target.value)}
                          className="mt-1 h-11 w-full rounded-xl bg-surface px-3 font-mono text-sm font-semibold text-ink ring-1 ring-line outline-none"
                        />
                      </label>
                      <label className="block">
                        <span className="text-[11px] font-bold text-muted">CVV</span>
                        <input
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value)}
                          className="mt-1 h-11 w-full rounded-xl bg-surface px-3 font-mono text-sm font-semibold text-ink ring-1 ring-line outline-none"
                        />
                      </label>
                    </div>
                  </div>
                )}

                {payMethod === "cod" && (
                  <div className="mt-3 flex items-center gap-2.5 rounded-xl bg-emerald-50 p-3 text-xs text-emerald-800">
                    <Banknote className="size-4 shrink-0 text-emerald-600" />
                    Inspect your device at delivery before paying cash to the courier.
                  </div>
                )}
              </div>

              {/* Active Delivery Confirmation Summary */}
              <div className="rounded-2xl bg-white p-3.5 text-xs ring-1 ring-line sm:p-4">
                <div className="flex flex-wrap items-center justify-between gap-1 font-bold text-ink">
                  <span>Delivering to {fullName}</span>
                  <span className="text-emerald-600">{countryCode} {phone}</span>
                </div>
                <p className="mt-1 text-muted">
                  {address}, {city} {postalCode}
                  {coords ? ` · GPS (${coords.lat}, ${coords.lng})` : ""}
                </p>
              </div>
            </div>

            {/* Sticky Pinned Footer for Payment Step */}
            <div className="shrink-0 border-t border-line bg-white p-4 sm:p-5">
              <button
                type="button"
                onClick={handleConfirmOrder}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-600 text-sm font-extrabold text-white shadow-lg shadow-brand-600/35 hover:bg-brand-700"
              >
                Confirm Payment · {formatPrice(total)}
              </button>
              <p className="mt-2 flex items-center justify-center gap-1.5 text-center text-[11px] font-medium text-muted">
                <ShieldCheck className="size-3.5 text-brand-600" />
                256-bit encrypted checkout · 30-day money-back guarantee
              </p>
            </div>
          </>
        )}

        {/* STEP 3: ORDER PLACED SUCCESSFULLY + TRACK YOUR ORDER */}
        {step === "success" && (
          <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-5">
            <div className="rounded-3xl bg-white p-5 text-center shadow-xs ring-1 ring-line sm:p-6">
              <div className="mx-auto grid size-16 place-items-center rounded-full bg-brand-600 text-white shadow-xl shadow-brand-600/35">
                <CheckCircle2 className="size-9" />
              </div>
              <h3 className="mt-4 text-xl font-extrabold text-ink">Order Placed Successfully!</h3>
              <p className="mt-1 text-xs text-muted">
                Thank you for your order, <strong className="text-ink">{fullName}</strong>.
              </p>
              <p className="mt-0.5 text-xs font-bold text-brand-600">
                Your order number is #{orderId}
              </p>

              <p className="mt-3 font-script text-2xl text-brand-600">
                Enjoy your new phone! ♡
              </p>

              <div className="mt-4 flex flex-col gap-2">
                <Link
                  href="/dashboard"
                  onClick={() => setCartOpen(false)}
                  className="flex h-11 items-center justify-center gap-2 rounded-full bg-brand-600 text-xs font-extrabold text-white shadow-md shadow-brand-600/30"
                >
                  <Sparkles className="size-4" />
                  Track Live in User Dashboard
                </Link>
                <button
                  onClick={() => {
                    setStep("cart");
                    setCartOpen(false);
                  }}
                  className="flex h-10 items-center justify-center rounded-full bg-surface text-xs font-bold text-ink hover:bg-brand-50"
                >
                  Continue Shopping
                </button>
              </div>
            </div>

            {/* Live Track Your Order Timeline */}
            <div className="rounded-3xl bg-white p-5 shadow-xs ring-1 ring-line">
              <h4 className="text-sm font-extrabold text-ink">Track Your Order · #{orderId}</h4>
              <div className="mt-4 space-y-3.5">
                {[
                  { title: "Order Placed", sub: "Just now · Confirmed via SMS", done: true },
                  { title: "72-Point Final QA Seal", sub: "In progress at iUsed Lab", done: true },
                  { title: "Shipped via Express Courier", sub: `Courier assigned · Calling ${countryCode} ${phone}`, done: true },
                  { title: "Out for Delivery", sub: `Pin: ${address}, ${city}`, done: false },
                  { title: "Delivered", sub: "Signature or OTP at door", done: false },
                ].map((st, idx) => (
                  <div key={st.title} className="flex items-start gap-3">
                    <span
                      className={clsx(
                        "mt-0.5 grid size-5 shrink-0 place-items-center rounded-full text-[10px] font-bold",
                        st.done ? "bg-brand-600 text-white" : "border-2 border-line bg-surface text-muted",
                      )}
                    >
                      {st.done ? "✓" : idx + 1}
                    </span>
                    <div>
                      <p className={clsx("text-xs font-extrabold", st.done ? "text-ink" : "text-muted")}>
                        {st.title}
                      </p>
                      <p className="text-[11px] text-muted">{st.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
