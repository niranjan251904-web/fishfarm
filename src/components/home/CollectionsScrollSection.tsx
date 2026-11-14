"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Category } from "@/types";

interface CollectionsScrollSectionProps {
  categories: Category[];
}

export function CollectionsScrollSection({ categories: initialCategories }: CollectionsScrollSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [categories, setCategories] = useState<Category[]>(initialCategories);

  useEffect(() => {
    const saved = localStorage.getItem("srm_fishfarm_categories_v1");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Keep fish-only / active collections
          setCategories(parsed.filter((c) => c.active !== false));
        }
      } catch {}
    }

    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<Category[]>;
      if (customEvent.detail && Array.isArray(customEvent.detail)) {
        setCategories(customEvent.detail.filter((c) => c.active !== false));
      }
    };

    window.addEventListener("srm_categories_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("srm_categories_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  // Filter out 'all' category
  const baseCollections = categories.filter((c) => c.slug !== "all");

  // Duplicate the collections to create an endless seamless loop
  const displayCollections = [
    ...baseCollections,
    ...baseCollections,
    ...baseCollections,
  ];

  // Automatic smooth continuous scroll
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let animationFrameId: number;
    const speed = 0.85; // Pixels per frame (silky smooth ~50px/sec)

    const step = () => {
      if (!isPaused && container) {
        container.scrollLeft += speed;

        // When scrolled past one full set of items, loop back seamlessly
        const maxScroll = container.scrollWidth / 3;
        if (container.scrollLeft >= maxScroll * 2) {
          container.scrollLeft -= maxScroll;
        }
      }
      animationFrameId = requestAnimationFrame(step);
    };

    animationFrameId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPaused]);

  const manualScroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -320 : 320;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="py-10 sm:py-14 bg-white border-b border-[#E2E8F0] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header Matching Reference Image */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div>
            <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[#2878A5] block">
              COLLECTIONS
            </span>
          </div>

          {/* Manual navigation controls */}
          <div className="hidden sm:flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => manualScroll("left")}
              className="p-1.5 rounded-full border border-[#E2E8F0] hover:border-[#2878A5] text-[#64748B] hover:text-[#2878A5] transition-colors bg-white shadow-xs"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => manualScroll("right")}
              className="p-1.5 rounded-full border border-[#E2E8F0] hover:border-[#2878A5] text-[#64748B] hover:text-[#2878A5] transition-colors bg-white shadow-xs"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Automatic Scrolling Horizontal Track */}
        <div
          ref={scrollContainerRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => {
            // Resume auto-scroll 2.5s after touch release
            setTimeout(() => setIsPaused(false), 2500);
          }}
          className="flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar pb-3 -mx-4 px-4 sm:mx-0 sm:px-0 select-none cursor-grab active:cursor-grabbing"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {displayCollections.map((col, index) => (
            <Link
              key={`${col.categoryId}-${index}`}
              href={`/fish?category=${col.slug}`}
              className="group relative shrink-0 w-[240px] sm:w-[300px] aspect-[4/3] rounded-none sm:rounded-[2px] overflow-hidden bg-gray-100 border border-[#E2E8F0]"
            >
              {/* Category Background Image */}
              <Image
                src={col.image}
                alt={col.name}
                fill
                sizes="(max-width: 640px) 240px, 300px"
                className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                draggable={false}
              />

              {/* Gradient Scrim for Legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent pointer-events-none" />

              {/* Bottom-Left Overlay Copy (Matching Reference Image) */}
              <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10 text-left pointer-events-none">
                <h3 className="text-white text-base sm:text-lg font-bold tracking-tight leading-tight drop-shadow-sm group-hover:text-[#E6F4FF] transition-colors">
                  {col.name}
                </h3>
                <span className="text-white/85 text-xs font-normal tracking-wide mt-0.5 inline-block group-hover:underline">
                  Shop Now
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
