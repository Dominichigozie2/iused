import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Caveat } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import SmoothScroll from "@/components/providers/SmoothScroll";
import CartDrawer from "@/components/cart/CartDrawer";
import WishlistModal from "@/components/wishlist/WishlistModal";
import ProductQuickView from "@/components/product/ProductQuickView";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["500", "700"],
});

export const metadata: Metadata = {
  title: "iUsed — Certified Pre-Owned Gadgets. Like New. Half the Price.",
  description:
    "Shop certified pre-owned iPhones, Samsung Galaxy, MacBooks, iPads and more. 72-point inspection, 12-month warranty, free delivery and 30-day returns.",
};

export const viewport: Viewport = {
  themeColor: "#060e31",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${jakarta.variable} ${caveat.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <SmoothScroll />
        {children}
        <CartDrawer />
        <WishlistModal />
        <ProductQuickView />
      </body>
    </html>
  );
}
