"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MessageCircle, Clock } from "lucide-react";
import { Product } from "@/types";
import { FishCard } from "@/components/fish/FishCard";
import { buildWhatsAppUrl } from "@/config/site";

interface CampaignInfo {
  title: string;
  subtitle: string;
  heroImage: string;
  badge: string;
  categoryId: string;
  description: string;
  isFutureUpgrade?: boolean;
}

interface CollectionProductSectionProps {
  initialProducts: Product[];
  campaign: CampaignInfo;
  slug: string;
}

export function CollectionProductSection({
  initialProducts,
  campaign,
  slug,
}: CollectionProductSectionProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  useEffect(() => {
    const filterForCampaign = (all: Product[]): Product[] => {
      const isFishCategory =
        campaign.categoryId === "fish" ||
        [
          "angelfish",
          "algae-eaters",
          "betta-fish",
          "catfish",
          "barbs",
          "badis",
        ].includes(campaign.categoryId);

      const isPlantsCategory =
        slug === "plants" ||
        slug === "aquarium-plants" ||
        campaign.categoryId === "plants" ||
        campaign.categoryId === "aquarium-plants";

      const isEquipmentCategory =
        slug === "equipment" || campaign.categoryId === "equipment";

      if (campaign.categoryId === "all") {
        return all;
      }

      if (isPlantsCategory) {
        return all.filter(
          (p) =>
            p.categoryId === "aquarium-plants" ||
            p.categoryId === "plants" ||
            p.categoryName?.toLowerCase().includes("plant") ||
            p.slug.includes("anubias") ||
            p.slug.includes("fern") ||
            p.slug.includes("moss") ||
            p.slug.includes("sword") ||
            p.slug.includes("ludwigia")
        );
      }

      if (isEquipmentCategory) {
        return all.filter(
          (p) =>
            p.categoryId === "equipment" ||
            p.categoryId === "filters" ||
            p.categoryId === "tanks" ||
            p.categoryId === "accessories" ||
            p.categoryName?.toLowerCase().includes("filter") ||
            p.categoryName?.toLowerCase().includes("equipment") ||
            p.categoryName?.toLowerCase().includes("tank") ||
            p.categoryName?.toLowerCase().includes("accessories")
        );
      }

      if (isFishCategory) {
        if (campaign.categoryId === "fish") {
          return all.filter((p) =>
            [
              "angelfish",
              "algae-eaters",
              "betta-fish",
              "catfish",
              "barbs",
              "badis",
              "fish",
            ].includes(p.categoryId)
          );
        }
        return all.filter((p) => p.categoryId.toLowerCase() === campaign.categoryId.toLowerCase());
      }

      return all.filter((p) => p.categoryId.toLowerCase() === campaign.categoryId.toLowerCase());
    };

    // 1. Check client storage
    const saved = localStorage.getItem("srm_fishfarm_products_v1");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProducts(filterForCampaign(parsed));
        }
      } catch {}
    }

    // 2. Fetch latest from API (source code)
    fetch("/api/admin/save-data")
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json?.data?.products && Array.isArray(json.data.products) && json.data.products.length > 0) {
          setProducts(filterForCampaign(json.data.products));
          localStorage.setItem("srm_fishfarm_products_v1", JSON.stringify(json.data.products));
        }
      })
      .catch(() => {});

    // 3. Listen to real-time events when admin adds/edits products
    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<Product[]>;
      if (customEvent.detail && Array.isArray(customEvent.detail)) {
        setProducts(filterForCampaign(customEvent.detail));
      } else {
        const refreshed = localStorage.getItem("srm_fishfarm_products_v1");
        if (refreshed) {
          try {
            setProducts(filterForCampaign(JSON.parse(refreshed)));
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
  }, [campaign.categoryId, slug]);

  return (
    <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-3 border-b border-[#E2E8F0]">
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#2878A5] block mb-1">
            CATEGORY SELECTION
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#171717]">
            {products.length > 0 ? "Available Products in this Category" : "Department Status"}
          </h2>
        </div>
        <span className="mt-2 sm:mt-0 text-xs text-[#64748B]">
          {products.length > 0 ? `${products.length} Items Available` : "Scheduled Upgrade"}
        </span>
      </div>

      {products.length === 0 ? (
        /* "For Future Upgrade" Presentation (Accessible, On-Brand, No Error) */
        <div className="bg-white border border-[#E2E8F0] rounded-[2px] p-8 sm:p-14 text-center max-w-3xl mx-auto shadow-xs">
          <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-[#E6F4FF] border border-[#2878A5]/20 flex items-center justify-center text-[#2878A5]">
            <Clock className="w-8 h-8" />
          </div>

          <span className="inline-block px-3 py-1 rounded-[2px] bg-[#E6F4FF] text-[#2878A5] text-[10px] font-bold uppercase tracking-[0.2em] mb-3">
            Phase II Facility Expansion • For Future Upgrade
          </span>

          <h3 className="text-2xl sm:text-3xl font-bold text-[#171717] mb-3">
            {campaign.title} Scheduled for Future Release
          </h3>

          <p className="text-sm sm:text-base text-[#64748B] max-w-xl mx-auto leading-relaxed mb-8">
            This category is currently under therapeutic bio-quarantine and stock expansion at our Palamedu, Madurai facility. Quarantined stock and specialized equipment are scheduled for release in the upcoming farm batch.
          </p>

          {/* Farm Logistics Assurances */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 text-left border-y border-[#E2E8F0] py-6">
            <div className="p-3 bg-[#F5F3EE] rounded-[2px] border border-[#E2E8F0]/60">
              <p className="text-[10px] font-bold uppercase text-[#A67C52] tracking-wider mb-1">
                Biosecure Protocol
              </p>
              <p className="text-xs text-[#171717] font-medium leading-relaxed">
                14-Day observation & conditioning before dispatch
              </p>
            </div>
            <div className="p-3 bg-[#F5F3EE] rounded-[2px] border border-[#E2E8F0]/60">
              <p className="text-[10px] font-bold uppercase text-[#2878A5] tracking-wider mb-1">
                Pan-India Transit
              </p>
              <p className="text-xs text-[#171717] font-medium leading-relaxed">
                Train, bus, & flight cargo with 100% live arrival warranty
              </p>
            </div>
            <div className="p-3 bg-[#F5F3EE] rounded-[2px] border border-[#E2E8F0]/60">
              <p className="text-[10px] font-bold uppercase text-[#123B5D] tracking-wider mb-1">
                Direct Pre-Booking
              </p>
              <p className="text-xs text-[#171717] font-medium leading-relaxed">
                Reserve ahead via WhatsApp helpline (+91 83007 38588)
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={buildWhatsAppUrl(
                `Hello SRM Fish Farm! I noticed the ${campaign.title} is marked for future upgrade. Please notify me via WhatsApp when the upcoming consignment is ready for dispatch.`,
                { source: "future_upgrade", campaign: slug }
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-semibold uppercase tracking-wider rounded-[2px] transition-colors shadow-xs"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Notify Me on WhatsApp for First Dispatch</span>
            </a>

            <Link
              href="/fish"
              className="inline-block px-6 py-3 bg-[#123B5D] hover:bg-[#2878A5] text-white text-xs font-semibold uppercase tracking-wider rounded-[2px] transition-colors"
            >
              Browse Available Fish Catalog
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <FishCard key={product.productId} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
