import { Metadata } from "next";
import { getProducts, getCategories, getFishCategories } from "@/lib/db";
import { siteConfig } from "@/config/site";
import { HeroSection } from "@/components/home/HeroSection";
import { CollectionsScrollSection } from "@/components/home/CollectionsScrollSection";
import { SpecialOffersSection } from "@/components/home/SpecialOffersSection";
import { BestSellersSection } from "@/components/home/BestSellersSection";
import { WhatsAppBannerCTA } from "@/components/home/WhatsAppBannerCTA";

export const metadata: Metadata = {
  title: `${siteConfig.name} | ${siteConfig.tagline}`,
  description: siteConfig.description,
};

export default async function HomePage() {
  const products = await getProducts();
  const allCategories = await getCategories();

  // Primary store department collections: Live Fish, Aqua Scaping, Fish Food, Aquarium Plants, Tanks, Filters, Accessories
  const departmentCollections = allCategories.filter(
    (c) => c.slug !== "all" && c.slug !== "plants" && c.slug !== "equipment" && c.active !== false
  );

  return (
    <div className="flex flex-col bg-white">
      {/* 1. Aquarium Video Hero Section with Visible Video & Outlined Button */}
      <HeroSection />

      {/* 2. Collections Horizontal Smooth Scroll (Live Fish, Aqua Scaping, Fish Food, Plants, Tanks, Filters, Accessories) */}
      <CollectionsScrollSection categories={departmentCollections} />

      {/* 3. Special Offers & Featured Harvest Posters (Configured via Admin) */}
      <SpecialOffersSection />

      {/* 4. Best-Selling Fish with 2-Column Mobile Grid (Matching Image 4) */}
      <BestSellersSection products={products} />

      {/* 5. WhatsApp Direct Concierge Desk */}
      <WhatsAppBannerCTA />
    </div>
  );
}
