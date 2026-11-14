"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Category, FilterState } from "@/types";
import { fishCategories as defaultFishCategories } from "@/data/initialData";

interface FilterSidebarProps {
  categories: Category[];
  fishCategories?: Category[];
  filters: FilterState;
  onFilterChange: (updates: Partial<FilterState>) => void;
  onReset: () => void;
  totalFilteredCount: number;
  totalCatalogueCount?: number;
  isMobileDrawer?: boolean;
  onCloseMobileDrawer?: () => void;
}

export function FilterSidebar({
  categories,
  fishCategories: customFishCategories,
  filters,
  onFilterChange,
  onReset,
  totalFilteredCount,
  totalCatalogueCount,
  isMobileDrawer = false,
  onCloseMobileDrawer,
}: FilterSidebarProps) {
  const [fishExpanded, setFishExpanded] = useState(true);
  const subCategories = customFishCategories || defaultFishCategories;

  // Filter out redundant legacy categories to keep the catalog clean
  const visibleCategories = categories.filter(
    (c) => c.active !== false && c.slug !== "plants" && c.slug !== "equipment"
  );
  return (
    <aside
      className={`flex flex-col gap-6 ${
        isMobileDrawer
          ? "p-6 bg-white h-full overflow-y-auto"
          : "p-5 bg-white rounded-none sm:rounded-[2px] border border-[#E2E8F0] sticky top-24"
      }`}
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-3.5 border-b border-[#E2E8F0]">
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#2878A5] block">
            Filter System
          </span>
          <h3 className="font-sans font-bold text-base text-[#171717]">
            Refine Catalog
          </h3>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="text-[11px] font-semibold text-[#64748B] hover:text-[#2878A5] transition-colors uppercase tracking-wider underline underline-offset-2"
        >
          Clear All
        </button>
      </div>

      {/* Filter 1: Sort Options */}
      <div className="space-y-2">
        <label className="text-[11px] font-semibold uppercase tracking-wider text-[#171717] block">
          Sort Order
        </label>
        <select
          value={filters.sortBy}
          onChange={(e) =>
            onFilterChange({
              sortBy: e.target.value as "newest" | "price_asc" | "price_desc",
            })
          }
          className="w-full text-xs bg-[#F5F3EE] border border-[#E2E8F0] rounded-sm py-2 px-3 text-[#171717] focus:outline-none focus:border-[#2878A5]"
        >
          <option value="newest">Featured & Newest Arrivals</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

      {/* Filter 2: Categories */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-[#171717]">
            Fish Categories
          </label>
          <span className="text-[10px] text-[#64748B]">
            {totalFilteredCount} matching
          </span>
        </div>

        <div className="space-y-1 max-h-[30rem] overflow-y-auto pr-1">
          {visibleCategories.map((cat) => {
            const isSelected =
              filters.categoryId.toLowerCase() === cat.slug.toLowerCase();
            const isFishCategory = cat.slug === "fish";
            const isAnyFishSubSelected = subCategories.some(
              (fc) => fc.slug.toLowerCase() === filters.categoryId.toLowerCase()
            );

            return (
              <div key={cat.categoryId} className="space-y-1">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onFilterChange({ categoryId: cat.slug })}
                    className={`flex-1 text-left px-2.5 py-1.5 text-xs rounded-sm transition-colors flex items-center justify-between ${
                      isSelected
                        ? "bg-[#E6F4FF] text-[#2878A5] font-semibold border border-[#2878A5]/20"
                        : isAnyFishSubSelected && isFishCategory
                        ? "bg-[#F5F3EE] text-[#123B5D] font-medium"
                        : "text-[#64748B] hover:text-[#171717] hover:bg-[#F5F3EE]"
                    }`}
                  >
                    <span>{cat.name}</span>
                    {isSelected && <span className="text-[10px]">&bull;</span>}
                  </button>

                  {isFishCategory && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFishExpanded((prev) => !prev);
                      }}
                      title={fishExpanded ? "Collapse fish types" : "Expand fish types"}
                      aria-label={fishExpanded ? "Collapse fish types" : "Expand fish types"}
                      className="p-1.5 text-[#64748B] hover:text-[#2878A5] hover:bg-[#F5F3EE] rounded-sm transition-colors"
                    >
                      {fishExpanded ? (
                        <ChevronDown className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}
                </div>

                {/* Live Fish Sub-categories (Angelfish, Algae Eaters, Bettas, Catfish, Barbs, Badis) */}
                {isFishCategory && fishExpanded && (
                  <div className="pl-3 py-1 space-y-0.5 border-l-2 border-[#2878A5]/30 ml-3 my-1 bg-[#F8FAFC]/60 rounded-r-xs">
                    {subCategories.map((fishCat) => {
                      const isFishSubSelected =
                        filters.categoryId.toLowerCase() === fishCat.slug.toLowerCase();
                      return (
                        <button
                          key={fishCat.categoryId}
                          type="button"
                          onClick={() => onFilterChange({ categoryId: fishCat.slug })}
                          className={`w-full text-left px-2 py-1 text-[11px] rounded-[2px] transition-colors flex items-center justify-between group ${
                            isFishSubSelected
                              ? "bg-[#E6F4FF] text-[#2878A5] font-semibold border-l-2 border-[#2878A5]"
                              : "text-[#64748B] hover:text-[#171717] hover:bg-[#F1F5F9]"
                          }`}
                        >
                          <span className="flex items-center gap-1.5 truncate">
                            <span
                              className={`w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors ${
                                isFishSubSelected
                                  ? "bg-[#2878A5]"
                                  : "bg-[#CBD5E1] group-hover:bg-[#2878A5]/60"
                              }`}
                            />
                            <span className="truncate">{fishCat.name}</span>
                          </span>
                          {isFishSubSelected && (
                            <span className="text-[10px] text-[#2878A5] font-bold ml-1">&bull;</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter 3: Availability */}
      <div className="space-y-2">
        <label className="text-[11px] font-semibold uppercase tracking-wider text-[#171717] block">
          Stock Availability
        </label>
        <div className="grid grid-cols-3 gap-1 bg-[#F5F3EE] p-1 rounded-sm border border-[#E2E8F0] text-center text-xs">
          <button
            type="button"
            onClick={() => onFilterChange({ availability: "all" })}
            className={`py-1 rounded-[2px] transition-colors ${
              filters.availability === "all"
                ? "bg-white text-[#2878A5] font-semibold shadow-xs"
                : "text-[#64748B] hover:text-[#171717]"
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => onFilterChange({ availability: "in_stock" })}
            className={`py-1 rounded-[2px] transition-colors ${
              filters.availability === "in_stock"
                ? "bg-white text-[#2878A5] font-semibold shadow-xs"
                : "text-[#64748B] hover:text-[#171717]"
            }`}
          >
            In Stock
          </button>
          <button
            type="button"
            onClick={() => onFilterChange({ availability: "out_of_stock" })}
            className={`py-1 rounded-[2px] transition-colors ${
              filters.availability === "out_of_stock"
                ? "bg-white text-[#2878A5] font-semibold shadow-xs"
                : "text-[#64748B] hover:text-[#171717]"
            }`}
          >
            Waitlist
          </button>
        </div>
      </div>

      {/* Filter 4: Water Type / Biotope */}
      <div className="space-y-2">
        <label className="text-[11px] font-semibold uppercase tracking-wider text-[#171717] block">
          Water Habitat
        </label>
        <div className="grid grid-cols-2 gap-1 bg-[#F5F3EE] p-1 rounded-sm border border-[#E2E8F0] text-center text-xs">
          <button
            type="button"
            onClick={() => onFilterChange({ waterType: "all" })}
            className={`py-1 rounded-[2px] transition-colors ${
              filters.waterType === "all"
                ? "bg-white text-[#2878A5] font-semibold shadow-xs"
                : "text-[#64748B] hover:text-[#171717]"
            }`}
          >
            All Types
          </button>
          <button
            type="button"
            onClick={() => onFilterChange({ waterType: "freshwater" })}
            className={`py-1 rounded-[2px] transition-colors ${
              filters.waterType === "freshwater"
                ? "bg-white text-[#2878A5] font-semibold shadow-xs"
                : "text-[#64748B] hover:text-[#171717]"
            }`}
          >
            Freshwater
          </button>
        </div>
      </div>

      {/* Close button for mobile drawer */}
      {isMobileDrawer && (
        <div className="pt-4 border-t border-[#E2E8F0]">
          <button
            type="button"
            onClick={onCloseMobileDrawer}
            className="w-full py-2.5 bg-[#2878A5] hover:bg-[#123B5D] text-white text-xs font-semibold uppercase tracking-wider rounded-sm text-center"
          >
            Show {totalFilteredCount} Results
          </button>
        </div>
      )}
    </aside>
  );
}
