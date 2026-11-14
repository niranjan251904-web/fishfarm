import { Metadata } from "next";
import Link from "next/link";
import { FishGallerySection } from "@/components/home/FishGallerySection";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Fish Gallery | ${siteConfig.name}`,
  description:
    "Explore our visual photographic archive of quarantined ornamental fish: Orinoco Altum Angels, Panda Garra, Scarlet Badis, and Thai Glass Catfish.",
};

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-[#F5F3EE] py-10 sm:py-14 text-[#171717]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        {/* Navigation Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-medium text-[#64748B] mb-6 uppercase tracking-wider">
          <Link href="/" className="hover:text-[#171717] transition-colors">
            HOME
          </Link>
          <span>&gt;</span>
          <span className="text-[#2878A5] font-semibold">PHOTOGRAPHIC GALLERY</span>
        </nav>

        <div className="max-w-3xl">
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#2878A5] block mb-1">
            VISUAL CATALOG
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold text-[#171717] mb-3">
            Sanctuary Photographic Archive
          </h1>
          <p className="text-sm text-[#64748B] leading-relaxed">
            All photography captured in-house in our conditioning systems under balanced illumination.
          </p>
        </div>
      </div>

      <FishGallerySection />
    </div>
  );
}
