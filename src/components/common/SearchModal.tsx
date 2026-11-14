"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { Product } from "@/types";
import { formatCurrencyDecimals } from "@/config/site";
import { trackSearch } from "@/lib/analytics";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
}

export function SearchModal({ isOpen, onClose, products }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setQuery("");
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = query.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.scientificName?.toLowerCase().includes(query.toLowerCase()) ||
          p.categoryName?.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const handleQueryChange = (val: string) => {
    setQuery(val);
    if (val.length > 2) {
      trackSearch(val, filtered.length);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/50 transition-opacity">
      {/* Backdrop click */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-white rounded-none sm:rounded-[2px] border border-[#E2E8F0] shadow-2xl overflow-hidden z-10 text-[#171717]">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-[#E2E8F0] bg-[#F5F3EE]">
          <Search className="w-4 h-4 text-[#64748B] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder="Search fish by species name (e.g. Angel, Otocinclus, Betta)..."
            className="w-full bg-transparent text-[#171717] placeholder-[#64748B] focus:outline-none text-sm"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="p-1 text-[#64748B] hover:text-[#171717] transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] tracking-wider uppercase bg-gray-200 text-[#64748B] rounded-[2px] font-mono">
              ESC
            </span>
          )}
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-[#64748B] hover:text-[#171717] transition-colors ml-1 font-bold text-sm"
          >
            ×
          </button>
        </div>

        {/* Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-4 divide-y divide-[#E2E8F0]">
          {query.trim() === "" ? (
            <div className="py-10 text-center space-y-1.5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#2878A5]">
                Live Fish Search
              </p>
              <p className="text-xs text-[#64748B]">
                Search for &ldquo;Altum&rdquo;, &ldquo;Panda Garra&rdquo;, &ldquo;Paraiba Blue&rdquo;, or &ldquo;Otocinclus&rdquo;
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-10 text-center space-y-1">
              <p className="text-sm font-bold text-[#171717]">
                No specimens matching &ldquo;{query}&rdquo;
              </p>
              <p className="text-xs text-[#64748B]">
                New quarantined batches clear observation weekly.
              </p>
            </div>
          ) : (
            filtered.map((item) => (
              <Link
                key={item.productId}
                href={`/fish/${item.slug}`}
                onClick={onClose}
                className="py-3 px-2 flex items-center gap-3.5 hover:bg-[#F5F3EE] transition-colors group rounded-sm"
              >
                <div className="relative w-12 h-12 rounded-[2px] overflow-hidden bg-gray-100 shrink-0 border border-[#E2E8F0]">
                  <Image
                    src={item.images[0] || "/images/fish/algae-eaters-otocinclus.jpg"}
                    alt={item.name}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>

                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#2878A5]">
                      {item.categoryName}
                    </span>
                    {item.availability === "out_of_stock" && (
                      <span className="text-[9px] uppercase px-1 py-0.2 bg-red-100 text-red-700 rounded-sm">
                        Waitlist
                      </span>
                    )}
                  </div>
                  <h4 className="font-semibold text-xs text-[#171717] group-hover:text-[#2878A5] truncate">
                    {item.name}
                  </h4>
                  <p className="text-[11px] text-[#64748B] italic truncate">
                    {item.scientificName}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-bold text-xs text-[#171717] block">
                    {formatCurrencyDecimals(item.sellingPrice)}
                  </span>
                  {item.originalPrice > item.sellingPrice && (
                    <span className="text-[10px] text-gray-400 line-through">
                      {formatCurrencyDecimals(item.originalPrice)}
                    </span>
                  )}
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
