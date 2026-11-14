"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { Product, Category, FilterState } from "@/types";
import { fishCategories } from "@/data/initialData";
import { FishCard } from "./FishCard";
import { FilterSidebar } from "./FilterSidebar";
import { formatCurrency, siteConfig, buildWhatsAppUrl } from "@/config/site";
import { trackCategoryView, trackSearch, trackWhatsAppEnquiry } from "@/lib/analytics";
import { useCart } from "@/context/CartContext";

interface CollectionExplorerProps {
  initialProducts: Product[];
  categories: Category[];
  initialCategorySlug?: string;
}

export function CollectionExplorer({
  initialProducts,
  categories,
  initialCategorySlug = "all",
}: CollectionExplorerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToCart } = useCart();

  const urlCategory = searchParams.get("category") || initialCategorySlug;
  const urlSearch = searchParams.get("q") || "";

  const [filters, setFilters] = useState<FilterState>({
    categoryId: urlCategory || "all",
    waterType: "all",
    availability: "all",
    searchQuery: urlSearch || "",
    sortBy: "newest",
  });

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [inspectingProduct, setInspectingProduct] = useState<Product | null>(null);

  // Sync state if URL query changes
  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat && cat !== filters.categoryId) {
      setFilters((prev) => ({ ...prev, categoryId: cat }));
      trackCategoryView(cat, cat);
    }
  }, [searchParams, filters.categoryId]);

  const handleFilterChange = (updates: Partial<FilterState>) => {
    if (updates.searchQuery !== undefined && updates.searchQuery.length > 2) {
      trackSearch(updates.searchQuery, filteredProducts.length);
    }
    setFilters((prev) => {
      const next = { ...prev, ...updates };
      if (updates.categoryId !== undefined) {
        if (updates.categoryId === "all") {
          router.replace("/fish", { scroll: false });
        } else {
          router.replace(`/fish?category=${updates.categoryId}`, { scroll: false });
        }
      }
      return next;
    });
  };

  const handleResetFilters = () => {
    setFilters({
      categoryId: "all",
      waterType: "all",
      availability: "all",
      searchQuery: "",
      sortBy: "newest",
    });
    router.replace("/fish", { scroll: false });
  };

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return initialProducts
      .filter((product) => {
        // Category filter
        if (
          filters.categoryId !== "all" &&
          product.categoryId.toLowerCase() !== filters.categoryId.toLowerCase()
        ) {
          const cat = filters.categoryId.toLowerCase();
          const prodCat = product.categoryId.toLowerCase();

          const isFishCategoryFilter =
            cat === "fish" &&
            [
              "angelfish",
              "algae-eaters",
              "betta-fish",
              "catfish",
              "barbs",
              "badis",
              "fish",
            ].includes(prodCat);

          const isPlantsFilter =
            (cat === "plants" || cat === "aquarium-plants") &&
            (prodCat === "plants" || prodCat === "aquarium-plants");

          const isEquipmentFilter =
            cat === "equipment" &&
            ["equipment", "filters", "tanks", "accessories"].includes(prodCat);

          if (!isFishCategoryFilter && !isPlantsFilter && !isEquipmentFilter) {
            return false;
          }
        }

        // Water habitat
        if (filters.waterType !== "all" && product.waterType !== filters.waterType) {
          return false;
        }

        // Availability
        if (
          filters.availability !== "all" &&
          product.availability !== filters.availability
        ) {
          return false;
        }

        // Search query
        if (filters.searchQuery.trim()) {
          const q = filters.searchQuery.toLowerCase();
          const matchesName = product.name.toLowerCase().includes(q);
          const matchesScientific = product.scientificName?.toLowerCase().includes(q);
          const matchesCat = product.categoryName?.toLowerCase().includes(q);
          if (!matchesName && !matchesScientific && !matchesCat) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === "price_asc") {
          return a.sellingPrice - b.sellingPrice;
        }
        if (filters.sortBy === "price_desc") {
          return b.sellingPrice - a.sellingPrice;
        }
        return 0; // Default newest
      });
  }, [initialProducts, filters]);

  const allCategories = useMemo(() => {
    const combined = [...categories];
    fishCategories.forEach((fc) => {
      if (!combined.some((c) => c.slug.toLowerCase() === fc.slug.toLowerCase())) {
        combined.push(fc);
      }
    });
    return combined;
  }, [categories]);

  const activeCategoryObj = allCategories.find(
    (c) => c.slug.toLowerCase() === filters.categoryId.toLowerCase()
  );

  return (
    <div className="space-y-6">
      {/* Top Search and Control Masthead */}
      <div className="p-4 bg-white rounded-none sm:rounded-[2px] border border-[#E2E8F0] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input Box */}
        <div className="relative flex-1 max-w-xl">
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => handleFilterChange({ searchQuery: e.target.value })}
            placeholder="Search by species name (e.g. Angel, Otocinclus, Betta, Pleco)..."
            className="w-full text-xs sm:text-sm bg-[#F5F3EE] border border-[#E2E8F0] rounded-sm py-2 px-3 text-[#171717] placeholder-[#64748B] focus:outline-none focus:border-[#2878A5]"
          />
          {filters.searchQuery && (
            <button
              type="button"
              onClick={() => handleFilterChange({ searchQuery: "" })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#64748B] hover:text-[#171717]"
            >
              Clear
            </button>
          )}
        </div>

        {/* Counter and Mobile Filter Button */}
        <div className="flex items-center justify-between md:justify-end gap-4 text-xs">
          <div className="text-[#64748B]">
            Showing <span className="font-semibold text-[#171717]">{filteredProducts.length}</span> of{" "}
            <span>{initialProducts.length}</span> live species
          </div>

          <button
            type="button"
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden px-3 py-1.5 bg-[#E6F4FF] text-[#2878A5] border border-[#2878A5]/30 rounded-sm font-semibold"
          >
            Filters
          </button>
        </div>
      </div>

      {/* Active Filter Chips */}
      {(filters.categoryId !== "all" ||
        filters.waterType !== "all" ||
        filters.availability !== "all" ||
        filters.searchQuery) && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] uppercase tracking-wider text-[#64748B] font-semibold mr-1">
            Active:
          </span>

          {filters.categoryId !== "all" && activeCategoryObj && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#E6F4FF] border border-[#2878A5]/20 text-[11px] rounded-[2px] text-[#2878A5] font-medium">
              <span>Category: {activeCategoryObj.name}</span>
              <button
                type="button"
                onClick={() => handleFilterChange({ categoryId: "all" })}
                className="font-bold hover:text-black"
              >
                ×
              </button>
            </span>
          )}

          {filters.availability !== "all" && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#E6F4FF] border border-[#2878A5]/20 text-[11px] rounded-[2px] text-[#2878A5] font-medium">
              <span>Status: {filters.availability === "in_stock" ? "In Stock" : "Out of Stock"}</span>
              <button
                type="button"
                onClick={() => handleFilterChange({ availability: "all" })}
                className="font-bold hover:text-black"
              >
                ×
              </button>
            </span>
          )}

          {filters.searchQuery && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-[#E2E8F0] text-[11px] rounded-[2px] text-[#171717]">
              <span>Search: &ldquo;{filters.searchQuery}&rdquo;</span>
              <button
                type="button"
                onClick={() => handleFilterChange({ searchQuery: "" })}
                className="font-bold hover:text-[#2878A5]"
              >
                ×
              </button>
            </span>
          )}

          <button
            type="button"
            onClick={handleResetFilters}
            className="text-[11px] text-[#2878A5] font-semibold hover:underline ml-2"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Main Catalog Section: Sidebar + Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8 items-start">
        {/* Desktop Sidebar (1 Col) */}
        <div className="hidden lg:block lg:col-span-1">
          <FilterSidebar
            categories={categories}
            fishCategories={fishCategories}
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleResetFilters}
            totalFilteredCount={filteredProducts.length}
            totalCatalogueCount={initialProducts.length}
          />
        </div>

        {/* Product Grid: 2 columns on mobile (matching Image 4), 3 cols on desktop */}
        <div className="lg:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="p-8 sm:p-14 bg-white border border-[#E2E8F0] rounded-[2px] text-center space-y-4 shadow-xs">
              <span className="inline-block px-3 py-1 rounded-[2px] bg-[#E6F4FF] text-[#2878A5] text-[10px] font-bold uppercase tracking-[0.2em]">
                Scheduled for Future Upgrade
              </span>
              <h3 className="font-sans text-2xl font-bold text-[#171717]">
                Consignment Under Bio-Conditioning
              </h3>
              <p className="text-xs sm:text-sm text-[#64748B] max-w-md mx-auto leading-relaxed">
                Items matching this category are currently undergoing prophylactic quarantine and acclimation at our Madurai facility for the upcoming harvest release.
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#2878A5] hover:bg-[#123B5D] rounded-[2px] transition-colors"
                >
                  View All Live Stock
                </button>
                <a
                  href={buildWhatsAppUrl(
                    "Hello SRM Fish Farm! I am inquiring about upcoming lot releases and dispatch schedules.",
                    { source: "empty_filter" }
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#171717] bg-[#F5F3EE] hover:bg-gray-200 border border-[#E2E8F0] rounded-[2px] transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Notify via WhatsApp</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-3 xl:grid-cols-3">
              {filteredProducts.map((product, idx) => (
                <FishCard
                  key={product.productId}
                  product={product}
                  priority={idx < 6}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer Overlay */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-xs h-full bg-white z-10 flex flex-col shadow-xl">
            <FilterSidebar
              categories={categories}
              fishCategories={fishCategories}
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={handleResetFilters}
              totalFilteredCount={filteredProducts.length}
              totalCatalogueCount={initialProducts.length}
              isMobileDrawer
              onCloseMobileDrawer={() => setMobileFilterOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
