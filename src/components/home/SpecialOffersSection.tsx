"use client";

import Link from "next/link";
import { ArrowRight, Tag } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";

export function SpecialOffersSection() {
  const { settings } = useSettings();

  const activePosters = (settings?.posters || [])
    .filter((p) => p.active)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  if (!activePosters || activePosters.length === 0) {
    return null;
  }

  return (
    <section className="py-12 sm:py-16 bg-[#FAFBFC] border-y border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#0055FF] block mb-1">
              Curated Releases
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#020617]">
              Special Offers & Featured Harvests
            </h2>
          </div>
        </div>

        <div className={`grid grid-cols-1 ${activePosters.length > 1 ? "md:grid-cols-2" : ""} gap-6`}>
          {activePosters.map((poster) => (
            <div
              key={poster.id}
              className="relative overflow-hidden rounded-md border border-[#E2E8F0] bg-black min-h-[300px] sm:min-h-[340px] flex items-end p-6 sm:p-8 group shadow-xs"
            >
              {/* Background Poster Image */}
              <img
                src={poster.imageUrl}
                alt={poster.title}
                className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.7] group-hover:scale-105 transition-transform duration-500 ease-out"
              />

              {/* Gradient scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

              {/* Card Content */}
              <div className="relative z-10 max-w-lg">
                {poster.tag && (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xs bg-[#0055FF] text-white text-[10px] font-bold tracking-widest uppercase mb-3 shadow-xs">
                    <Tag className="w-3 h-3" />
                    <span>{poster.tag}</span>
                  </div>
                )}

                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug mb-2">
                  {poster.title}
                </h3>

                {poster.subtitle && (
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-5 line-clamp-2">
                    {poster.subtitle}
                  </p>
                )}

                <Link
                  href={poster.link || "/fish"}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-100 text-black text-xs font-semibold uppercase tracking-wider transition-colors duration-150 rounded-xs shadow-xs"
                >
                  <span>{poster.buttonText || "View Collection"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
