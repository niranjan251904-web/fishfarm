import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getProducts } from "@/lib/db";
import { FishCard } from "@/components/fish/FishCard";
import { siteConfig, buildWhatsAppUrl } from "@/config/site";
import { MessageCircle } from "lucide-react";

interface CollectionCampaignProps {
  params: {
    slug: string;
  };
}

const campaignMetadataMap: Record<
  string,
  {
    title: string;
    subtitle: string;
    heroImage: string;
    badge: string;
    categoryId: string;
    description: string;
  }
> = {
  angelfish: {
    title: "The Sovereign Angelfish Collection",
    subtitle: "Majestic Orinoco Altums, Proven Breeding Pairs and Veiltail Rarities",
    heroImage: "/images/fish/angels-altum-angel.webp",
    badge: "Specialized Pterophyllum Breeding",
    categoryId: "angelfish",
    description:
      "Every Angelfish in this campaign has undergone our 14-day clinical quarantine protocol. Acclimated to tap water parameters and feeding enthusiastically on standard micro-pellets.",
  },
  "algae-eaters": {
    title: "Specialist Nature Aquarium Cleaners",
    subtitle: "Authentic Otocinclus, Panda Garra and Algae Grazing Crews",
    heroImage: "/images/fish/algae-eaters-otocinclus.jpg",
    badge: "100% Plant and Shrimp Safe",
    categoryId: "algae-eaters",
    description:
      "Tackle green spot, brown diatoms, and black beard algae naturally. Ethically quarantined cleaners that maintain your glass, hardscape, and delicate mosses.",
  },
  "betta-fish": {
    title: "Exhibition-Grade Show Betta Strains",
    subtitle: "High-Form Plakats, Nemo Candy and Galaxy Koi Bloodlines",
    heroImage: "/images/fish/betta-nemo-candy-500x500.webp",
    badge: "180° Dorsal and Caudal Spread",
    categoryId: "betta-fish",
    description:
      "Individually conditioned show-grade bettas with pristine fin symmetry. Hand-selected for intense color saturation and interactive personalities.",
  },
  catfish: {
    title: "Exotic Benthic and Glass Catfish",
    subtitle: "Translucent Kryptopterus, Whiptails and Dwarf Tanganyikan Species",
    heroImage: "/images/fish/catfish-thailand-glass-catfish.webp",
    badge: "Peaceful Community Biotope",
    categoryId: "catfish",
    description:
      "Fascinating bottom dwellers and mid-water schooling oddities that bring endless character and movement to established freshwater aquariums.",
  },
  "exotic-fish": {
    title: "Curated Exotic Ornamental Rarities",
    subtitle: "Hand-Picked Collector Species with Verified Lineage",
    heroImage: "/images/fish/angels-jet-black.webp",
    badge: "Collector Batch",
    categoryId: "all",
    description:
      "Direct from our private vaults. Hard-to-find wild varieties and selective color mutations for advanced aquascapers.",
  },
};

export async function generateStaticParams() {
  return [
    { slug: "angelfish" },
    { slug: "algae-eaters" },
    { slug: "betta-fish" },
    { slug: "catfish" },
    { slug: "exotic-fish" },
  ];
}

export async function generateMetadata({
  params,
}: CollectionCampaignProps): Promise<Metadata> {
  const campaign = campaignMetadataMap[params.slug];
  if (!campaign) {
    return { title: `Collection Not Found | ${siteConfig.name}` };
  }

  return {
    title: `${campaign.title} | ${siteConfig.name}`,
    description: campaign.description,
    openGraph: {
      title: `${campaign.title} | ${siteConfig.name}`,
      description: campaign.description,
      images: [{ url: campaign.heroImage }],
    },
  };
}

export default async function CollectionCampaignPage({
  params,
}: CollectionCampaignProps) {
  const campaign = campaignMetadataMap[params.slug];
  if (!campaign) {
    notFound();
  }

  const allProducts = await getProducts();
  const filteredProducts =
    campaign.categoryId === "all"
      ? allProducts
      : allProducts.filter((p) => p.categoryId === campaign.categoryId);

  const whatsappCampaignUrl = buildWhatsAppUrl(
    siteConfig.whatsapp.campaignInquiryMessage(campaign.title, params.slug),
    { source: "campaign_hero", campaign: params.slug }
  );

  return (
    <div className="min-h-screen bg-white text-[#020617]">
      {/* Campaign Hero Header */}
      <section className="bg-[#020617] text-white py-12 sm:py-16 border-b border-[#0F172A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs font-medium text-[#64748B] mb-6 uppercase tracking-wider">
            <Link href="/" className="hover:text-white transition-colors">
              HOME
            </Link>
            <span>&gt;</span>
            <Link href="/fish" className="hover:text-white transition-colors">
              FISH COLLECTION
            </Link>
            <span>&gt;</span>
            <span className="text-[#0055FF] font-semibold">{campaign.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="inline-block px-2.5 py-1 rounded-[2px] bg-[#0F172A] border border-[#0055FF]/30 text-[#0055FF] text-[10px] font-semibold uppercase tracking-[0.2em]">
                {campaign.badge}
              </span>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-[1.15]">
                {campaign.title}
              </h1>

              <p className="text-sm sm:text-base text-[#E2E8F0] font-normal">
                {campaign.subtitle}
              </p>

              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed max-w-xl">
                {campaign.description}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <a
                  href={whatsappCampaignUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[2px] bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Inquire Batch Availability</span>
                </a>

                <Link
                  href="/fish"
                  className="inline-block px-5 py-2.5 rounded-[2px] bg-white/10 border border-white/20 text-white text-xs font-semibold uppercase tracking-wider hover:bg-white/20 transition-colors"
                >
                  View All Live Species
                </Link>
              </div>

              <div className="pt-4 border-t border-[#0F172A] flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[#64748B]">
                <span>100% Live Arrival Guarantee</span>
                <span>•</span>
                <span>Fourteen-Day Prophylactic Hold</span>
                <span>•</span>
                <span>Train & Bus Dispatch</span>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative aspect-[4/3] rounded-sm overflow-hidden bg-[#0F172A] border border-[#1E293B]">
                <Image
                  src={campaign.heroImage}
                  alt={campaign.title}
                  fill
                  priority
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Campaign Product Grid: 2-Column Mobile Grid matching Image 4 */}
      <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-3 border-b border-[#E2E8F0]">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#0055FF] block mb-1">
              CONSIGNMENT SELECTION
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#020617]">
              Available Species in this Batch
            </h2>
          </div>
          <span className="mt-2 sm:mt-0 text-xs text-[#64748B]">
            {filteredProducts.length} Authenticated Species Ready
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.map((fish) => (
            <FishCard key={fish.productId} product={fish} />
          ))}
        </div>
      </section>
    </div>
  );
}
