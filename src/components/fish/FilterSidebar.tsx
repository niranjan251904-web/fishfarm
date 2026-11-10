"use client";

import { Category, FilterState } from "@/types";

interface FilterSidebarProps {
  categories: Category[];
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
  filters,
  onFilterChange,
  onReset,
  totalFilteredCount,
  totalCatalogueCount,
  isMobileDrawer = false,
  onCloseMobileDrawer,
}: FilterSidebarProps) {
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
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#0055FF] block">
            Filter System
          </span>
          <h3 className="font-sans font-bold text-base text-[#020617]">
            Refine Catalog
          </h3>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="text-[11px] font-semibold text-[#64748B] hover:text-[#0055FF] transition-colors uppercase tracking-wider underline underline-offset-2"
        >
          Clear All
        </button>
      </div>

      {/* Filter 1: Sort Options */}
      <div className="space-y-2">
        <label className="text-[11px] font-semibold uppercase tracking-wider text-[#020617] block">
          Sort Order
        </label>
        <select
          value={filters.sortBy}
          onChange={(e) =>
            onFilterChange({
              sortBy: e.target.value as "newest" | "price_asc" | "price_desc",
            })
          }
          className="w-full text-xs bg-gray-50 border border-[#E2E8F0] rounded-sm py-2 px-3 text-[#020617] focus:outline-none focus:border-[#0055FF]"
        >
          <option value="newest">Featured & Newest Arrivals</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

      {/* Filter 2: Categories */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-[#020617]">
            Fish Categories
          </label>
          <span className="text-[10px] text-[#64748B]">
            {totalFilteredCount} matching
          </span>
        </div>

        <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
          {categories.map((cat) => {
            const isSelected =
              filters.categoryId.toLowerCase() === cat.slug.toLowerCase();
            return (
              <button
                key={cat.categoryId}
                type="button"
                onClick={() => onFilterChange({ categoryId: cat.slug })}
                className={`w-full text-left px-2.5 py-1.5 text-xs rounded-sm transition-colors flex items-center justify-between ${
                  isSelected
                    ? "bg-[#EFF6FF] text-[#0055FF] font-semibold border border-[#0055FF]/20"
                    : "text-[#64748B] hover:text-[#020617] hover:bg-gray-50"
                }`}
              >
                <span>{cat.name}</span>
                {isSelected && <span className="text-[10px]">&bull;</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter 3: Availability */}
      <div className="space-y-2">
        <label className="text-[11px] font-semibold uppercase tracking-wider text-[#020617] block">
          Stock Availability
        </label>
        <div className="grid grid-cols-3 gap-1 bg-gray-50 p-1 rounded-sm border border-[#E2E8F0] text-center text-xs">
          <button
            type="button"
            onClick={() => onFilterChange({ availability: "all" })}
            className={`py-1 rounded-[2px] transition-colors ${
              filters.availability === "all"
                ? "bg-white text-[#0055FF] font-semibold shadow-xs"
                : "text-[#64748B] hover:text-[#020617]"
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => onFilterChange({ availability: "in_stock" })}
            className={`py-1 rounded-[2px] transition-colors ${
              filters.availability === "in_stock"
                ? "bg-white text-[#0055FF] font-semibold shadow-xs"
                : "text-[#64748B] hover:text-[#020617]"
            }`}
          >
            In Stock
          </button>
          <button
            type="button"
            onClick={() => onFilterChange({ availability: "out_of_stock" })}
            className={`py-1 rounded-[2px] transition-colors ${
              filters.availability === "out_of_stock"
                ? "bg-white text-[#0055FF] font-semibold shadow-xs"
                : "text-[#64748B] hover:text-[#020617]"
            }`}
          >
            Waitlist
          </button>
        </div>
      </div>

      {/* Filter 4: Water Type / Biotope */}
      <div className="space-y-2">
        <label className="text-[11px] font-semibold uppercase tracking-wider text-[#020617] block">
          Water Habitat
        </label>
        <div className="grid grid-cols-2 gap-1 bg-gray-50 p-1 rounded-sm border border-[#E2E8F0] text-center text-xs">
          <button
            type="button"
            onClick={() => onFilterChange({ waterType: "all" })}
            className={`py-1 rounded-[2px] transition-colors ${
              filters.waterType === "all"
                ? "bg-white text-[#0055FF] font-semibold shadow-xs"
                : "text-[#64748B] hover:text-[#020617]"
            }`}
          >
            All Types
          </button>
          <button
            type="button"
            onClick={() => onFilterChange({ waterType: "freshwater" })}
            className={`py-1 rounded-[2px] transition-colors ${
              filters.waterType === "freshwater"
                ? "bg-white text-[#0055FF] font-semibold shadow-xs"
                : "text-[#64748B] hover:text-[#020617]"
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
            className="w-full py-2.5 bg-[#0055FF] text-white text-xs font-semibold uppercase tracking-wider rounded-sm text-center"
          >
            Show {totalFilteredCount} Results
          </button>
        </div>
      )}
    </aside>
  );
}
