import Preloader from "@/components/landing/Preloader";
import AnnouncementBar from "@/components/landing/AnnouncementBar";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import FeatureStrip from "@/components/landing/FeatureStrip";
import PopularSection from "@/components/landing/PopularSection";
import PromoBanner from "@/components/landing/PromoBanner";
import BrandStrip from "@/components/landing/BrandStrip";
import BestDeals from "@/components/landing/BestDeals";
import ExtraFlairSections from "@/components/landing/ExtraFlairSections";
import NewsletterFooter from "@/components/landing/NewsletterFooter";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Preloader />
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1">
        <Hero />
        <FeatureStrip />
        <PopularSection />
        <PromoBanner />
        <BrandStrip />
        <BestDeals />
        <ExtraFlairSections />
      </main>
      <NewsletterFooter />
    </div>
  );
}
