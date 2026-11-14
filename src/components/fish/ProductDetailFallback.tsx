"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Product } from "@/types";
import { ProductDetailView } from "./ProductDetailView";

interface ProductDetailFallbackProps {
  slug: string;
}

export function ProductDetailFallback({ slug }: ProductDetailFallbackProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const resolveProduct = (all: Product[]) => {
      const found = all.find(
        (p) => p.slug.toLowerCase() === slug.toLowerCase() || p.productId.toLowerCase() === slug.toLowerCase()
      );
      if (found) {
        setProduct(found);
        const rel = all.filter(
          (p) => p.categoryId === found.categoryId && p.productId !== found.productId
        );
        setRelated(rel);
      }
    };

    // Check localStorage
    const saved = localStorage.getItem("srm_fishfarm_products_v1");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          resolveProduct(parsed);
        }
      } catch {}
    }

    // Also probe API
    fetch("/api/admin/save-data")
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json?.data?.products && Array.isArray(json.data.products)) {
          resolveProduct(json.data.products);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F3EE] flex items-center justify-center p-8">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-[#2878A5] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs uppercase tracking-wider text-[#64748B]">
            Loading specimen details...
          </p>
        </div>
      </div>
    );
  }

  if (product) {
    return <ProductDetailView product={product} relatedProducts={related} />;
  }

  return (
    <div className="min-h-screen bg-[#F5F3EE] flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-white border border-[#E2E8F0] p-8 text-center rounded-[2px] shadow-xs space-y-4">
        <span className="inline-block px-2.5 py-1 bg-[#E6F4FF] text-[#2878A5] text-[10px] font-bold uppercase tracking-[0.2em]">
          Catalogue Notice
        </span>
        <h2 className="text-2xl font-bold text-[#171717]">Specimen Not Found</h2>
        <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
          The requested specimen or product could not be located in current farm inventory.
        </p>
        <div className="pt-2">
          <Link
            href="/fish"
            className="inline-block px-6 py-2.5 bg-[#2878A5] hover:bg-[#123B5D] text-white text-xs font-semibold uppercase tracking-wider rounded-[2px] transition-colors"
          >
            Browse Live Fish Catalog
          </Link>
        </div>
      </div>
    </div>
  );
}
