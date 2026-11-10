import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Product } from "@/types";
import { FishCard } from "../fish/FishCard";

interface NewArrivalsSectionProps {
  products: Product[];
}

export function NewArrivalsSection({ products }: NewArrivalsSectionProps) {
  // Sort by created date descending or discount/special
  const newArrivals = [...products]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  return (
    <section className="py-20 bg-[#FAF8F3] border-y border-[#DFD8C8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-[0.25em] text-[#9C6A28] font-bold mb-2">
              <span>Fresh Batch Clearances</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest-950">
              New Arrivals & Rare Strains
            </h2>
            <p className="text-xs sm:text-sm text-forest-900/60 mt-1 max-w-xl">
              Recently cleared from our 14-day quarantine regimen. High vitality, rich pigmentation, and conditioned.
            </p>
          </div>

          <Link
            href="/fish"
            className="mt-4 sm:mt-0 text-xs font-bold uppercase tracking-wider text-forest-900 hover:text-forest-700 inline-flex items-center gap-1.5 group"
          >
            <span>Explore All 23 Species</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {newArrivals.map((product) => (
            <FishCard key={product.productId} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
