import { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getProducts, getCategories } from "@/lib/db";
import { CollectionExplorer } from "@/components/fish/CollectionExplorer";
import { FishGridSkeleton } from "@/components/fish/FishGridSkeleton";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Fish Collection | ${siteConfig.name} Premium Live Aquatic Livestock`,
  description:
    "Browse our complete collection of quarantined freshwater ornamental fish. Shipped across India via climate-controlled packaging with 100% DOA Live Arrival Guarantee.",
};

export default async function FishCollectionPage() {
  const products = await getProducts();
  const categories = await getCategories();

  return (
    <div className="min-h-screen py-8 sm:py-12 bg-white text-[#020617]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-medium text-[#64748B] mb-6 uppercase tracking-wider">
          <Link href="/" className="hover:text-[#020617] transition-colors">
            HOME
          </Link>
          <span className="text-gray-300 font-light">&gt;</span>
          <span className="text-[#0055FF] font-semibold">FISH COLLECTION</span>
        </nav>

        {/* Collection Masthead */}
        <header className="bg-white border border-[#E2E8F0] rounded-none sm:rounded-[2px] p-6 sm:p-8 lg:p-10 mb-8">
          <div className="max-w-3xl space-y-3">
            <div className="inline-block px-2.5 py-1 bg-[#EFF6FF] border border-[#0055FF]/20 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#0055FF] rounded-[2px]">
              Fourteen-Day Biosecure Quarantine
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#020617] leading-[1.15]">
              Freshwater Fish Collection
            </h1>

            <p className="text-sm sm:text-base text-[#64748B] leading-relaxed font-normal">
              Browse our authenticated collection of quarantined ornamental fish. Ethically conditioned, feeding vigorously, and shipped with 100% DOA Live Arrival Guarantee across India.
            </p>

            {/* Factual Logistics and Biological Assurance Details */}
            <div className="pt-3 border-t border-[#E2E8F0] flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-[#64748B]">
              <div>
                <strong className="text-[#020617] font-semibold">{products.length}</strong> Live Species Available
              </div>
              <span className="text-[#E2E8F0] hidden sm:inline">|</span>
              <div>
                <strong className="text-[#020617] font-semibold">100%</strong> Live Arrival Guarantee (DOA)
              </div>
              <span className="text-[#E2E8F0] hidden sm:inline">|</span>
              <div>
                Train & Bus Dispatch Within 48 Hours
              </div>
            </div>
          </div>
        </header>

        {/* Interactive Collection Explorer with 2-Column Mobile Grid */}
        <Suspense fallback={<FishGridSkeleton />}>
          <CollectionExplorer
            initialProducts={products}
            categories={categories}
          />
        </Suspense>
      </div>
    </div>
  );
}
