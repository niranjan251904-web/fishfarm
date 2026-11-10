"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { GalleryItem } from "@/types";
import { initialGallery } from "@/data/initialData";
import { X } from "lucide-react";

export function FishGallerySection() {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [activeTab, setActiveTab] = useState<string>("All");

  const categories = ["All", "Angelfish", "Algae Eaters", "Catfish", "Badis & Nano"];

  const filteredItems = activeTab === "All"
    ? initialGallery
    : initialGallery.filter((item) => item.category === activeTab);

  return (
    <section className="py-12 sm:py-16 bg-white text-[#020617] border-b border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-[#E2E8F0]">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#0055FF] block mb-1">
              SPECIMEN PHOTOGRAPHY
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#020617]">
              Sanctuary Photographic Records
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B] mt-1 max-w-xl">
              High-definition unedited captures of quarantined specimens displaying natural coloration and finnage integrity.
            </p>
          </div>

          <Link
            href="/gallery"
            className="mt-3 sm:mt-0 text-xs font-semibold uppercase tracking-wider text-[#0055FF] hover:underline"
          >
            View Full Archive &rarr;
          </Link>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-6 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveTab(cat)}
              className={`px-3 py-1.5 rounded-[2px] text-xs font-semibold tracking-wider uppercase transition-colors whitespace-nowrap border ${
                activeTab === cat
                  ? "bg-[#0055FF] text-white border-[#0055FF]"
                  : "bg-white text-[#64748B] hover:text-[#020617] hover:bg-gray-50 border-[#E2E8F0]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 2-Column Mobile Grid for Gallery */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-3">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="group relative aspect-[4/3] rounded-none sm:rounded-[2px] overflow-hidden bg-gray-100 cursor-pointer border border-[#E2E8F0] hover:border-[#0055FF] transition-all"
            >
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3 sm:p-4 text-white">
                <span className="text-[9px] uppercase tracking-wider text-[#0055FF] font-semibold">
                  {item.category}
                </span>
                <h4 className="font-bold text-xs sm:text-sm mt-0.5 truncate">
                  {item.title}
                </h4>
                <p className="text-[11px] text-gray-200 line-clamp-1 mt-0.5">
                  {item.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedItem && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="relative max-w-3xl w-full bg-white rounded-none sm:rounded-[2px] overflow-hidden border border-[#E2E8F0] text-[#020617] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedItem(null)}
              className="absolute top-3 right-3 z-10 p-1.5 rounded-sm bg-black/75 text-white hover:bg-black transition-colors"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="relative aspect-[16/10] w-full bg-gray-100">
              <Image
                src={selectedItem.imageUrl}
                alt={selectedItem.title}
                fill
                priority
                className="object-contain"
              />
            </div>

            <div className="p-4 sm:p-5 bg-white border-t border-[#E2E8F0]">
              <span className="text-[10px] uppercase tracking-wider text-[#0055FF] font-semibold">
                {selectedItem.category}
              </span>
              <h3 className="text-lg font-bold text-[#020617] mt-0.5">
                {selectedItem.title}
              </h3>
              <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                {selectedItem.caption}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
