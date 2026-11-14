"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Product } from "@/types";
import { FishCard } from "../fish/FishCard";

interface BestSellersSectionProps {
  products: Product[];
}

export function BestSellersSection({ products: initialProducts }: BestSellersSectionProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  useEffect(() => {
    // 1. Sync from localStorage on mount
    const saved = localStorage.getItem("srm_fishfarm_products_v1");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProducts(parsed);
        }
      } catch {}
    }

    // 2. Fetch latest from API (source code)
    fetch("/api/admin/save-data")
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json?.data?.products && Array.isArray(json.data.products) && json.data.products.length > 0) {
          setProducts(json.data.products);
          localStorage.setItem("srm_fishfarm_products_v1", JSON.stringify(json.data.products));
        }
      })
      .catch(() => {});

    // 3. Listen for real-time updates when admin adds or toggles featured status
    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<Product[]>;
      if (customEvent.detail && Array.isArray(customEvent.detail)) {
        setProducts(customEvent.detail);
      } else {
        const refreshed = localStorage.getItem("srm_fishfarm_products_v1");
        if (refreshed) {
          try {
            setProducts(JSON.parse(refreshed));
          } catch {}
        }
      }
    };

    window.addEventListener("srm_products_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("srm_products_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

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
