"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";
import { formatCurrencyDecimals } from "@/config/site";
import { useCart } from "@/context/CartContext";

interface FishCardProps {
  product: Product;
  priority?: boolean;
  onOpenQuickSpec?: (product: Product) => void;
}

export function FishCard({ product, priority = false }: FishCardProps) {
  const { addToCart } = useCart();
  const isOutOfStock = product.availability === "out_of_stock";
  const hasDiscount = product.originalPrice > product.sellingPrice;

  // Short category badge (e.g. "ANGELS", "ALGAE EATERS", "CATFISH", "BETTAS")
  const categoryBadge = product.categoryName
    ? product.categoryName
        .toUpperCase()
        .replace(" FISH", "")
        .replace(" & SCHOOLING", "")
        .replace(" & NANO", "")
        .replace(" & PLECOS", "")
    : "FISH";

  return (
    <article className="group relative flex flex-col bg-white rounded-none sm:rounded-[2px] border border-[#E2E8F0] hover:border-[#0055FF] transition-all duration-200 overflow-hidden">
      {/* Product Image Container Matching Image 4 */}
      <div className="relative aspect-square w-full overflow-hidden bg-gray-50">
        <Link href={`/fish/${product.slug}`} className="block w-full h-full">
          <Image
            src={product.images[0] || "/images/fish/algae-eaters-otocinclus.jpg"}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority={priority}
            className={`object-cover transition-transform duration-300 group-hover:scale-105 ${
              isOutOfStock ? "grayscale-[60%] opacity-70" : "opacity-100"
            }`}
          />
        </Link>

        {/* Top-Left Category Badge (e.g. ANGELS) Matching Image 4 */}
        <div className="absolute top-2 left-2 pointer-events-none z-10">
          <span className="px-1.5 py-0.5 text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider bg-white/95 text-gray-800 rounded-[1px] shadow-xs border border-gray-100">
            {categoryBadge}
          </span>
        </div>

        {/* Centered OUT OF STOCK Overlay Matching Image 4 */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/45 z-10 flex items-center justify-center pointer-events-none">
            <span className="text-white text-[11px] sm:text-xs font-bold uppercase tracking-widest drop-shadow-sm px-2 py-1 border border-white/40">
              OUT OF STOCK
            </span>
          </div>
        )}
      </div>

      {/* Product Information Body Matching Image 4 */}
      <div className="p-2.5 sm:p-3.5 flex-1 flex flex-col justify-between bg-white">
        <div>
          {/* Title */}
          <h3 className="text-xs sm:text-sm font-medium text-gray-900 leading-snug line-clamp-2 hover:text-[#0055FF] transition-colors">
            <Link href={`/fish/${product.slug}`}>{product.name}</Link>
          </h3>

          {/* Rate Tag Line Matching Image 4: Strikethrough price + selling price */}
          <div className="mt-1.5 flex flex-wrap items-baseline gap-x-1.5">
            {hasDiscount ? (
              <>
                <span className="text-[11px] sm:text-xs text-gray-400 line-through font-normal">
                  {formatCurrencyDecimals(product.originalPrice)}
                </span>
                <span className="text-xs sm:text-sm font-bold text-gray-900">
                  {formatCurrencyDecimals(product.sellingPrice)}
                </span>
              </>
            ) : (
              <span className="text-xs sm:text-sm font-bold text-gray-900">
                {formatCurrencyDecimals(product.sellingPrice)}
              </span>
            )}
          </div>
        </div>

        {/* Clean desktop-only quick add action */}
        {!isOutOfStock && (
          <div className="hidden sm:block mt-2.5 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={() => addToCart(product, 1)}
              className="w-full py-1 px-2 text-[11px] font-semibold uppercase tracking-wider text-gray-700 hover:text-white bg-gray-50 hover:bg-[#0055FF] rounded-[1px] transition-colors text-center"
            >
              Add to Cart
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
