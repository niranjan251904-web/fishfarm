import Link from "next/link";
import { Product } from "@/types";
import { FishCard } from "../fish/FishCard";

interface BestSellersSectionProps {
  products: Product[];
}

export function BestSellersSection({ products }: BestSellersSectionProps) {
  // Select top featured or popular species
  const bestSellers = products
    .filter((p) => p.featured)
    .slice(0, 8);

  return (
    <section className="py-12 sm:py-16 bg-white text-[#171717] border-b border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 pb-4 border-b border-[#E2E8F0]">
          <div>
            <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[#2878A5] block mb-1">
              POPULAR STOCK
            </span>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#171717] tracking-tight">
              Best-Selling Ornamental Fish
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B] mt-1 max-w-xl">
              Acclimated, feeding vigorously, and ready for train & bus dispatch across India.
            </p>
          </div>

          <Link
            href="/fish"
            className="mt-3 sm:mt-0 text-xs font-semibold uppercase tracking-wider text-[#2878A5] hover:underline"
          >
            View All Fish &rarr;
          </Link>
        </div>

        {/* 2-Column Mobile Grid matching Image 4 */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {bestSellers.map((product) => (
            <FishCard key={product.productId} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
