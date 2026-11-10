import { Metadata } from "next";
import { getProducts, getCategories } from "@/lib/db";
import { siteConfig } from "@/config/site";
import { HeroSection } from "@/components/home/HeroSection";
import { CollectionsScrollSection } from "@/components/home/CollectionsScrollSection";
import { BestSellersSection } from "@/components/home/BestSellersSection";
import { WhatsAppBannerCTA } from "@/components/home/WhatsAppBannerCTA";

export const metadata: Metadata = {
  title: `${siteConfig.name} | ${siteConfig.tagline}`,
  description: siteConfig.description,
};

export default async function HomePage() {
  const products = await getProducts();
  const categories = await getCategories();

  return (
    <div className="flex flex-col bg-white">
      {/* 1. Aquarium Video Hero Section with Visible Video & Outlined Button */}
      <HeroSection />

      {/* 2. Collections Horizontal Smooth Scroll (Matching Image 3) */}
      <CollectionsScrollSection categories={categories} />

      {/* 3. Best-Selling Fish with 2-Column Mobile Grid (Matching Image 4) */}
      <BestSellersSection products={products} />

      {/* 4. WhatsApp Direct Concierge Desk */}
      <WhatsAppBannerCTA />
    </div>
  );
}
