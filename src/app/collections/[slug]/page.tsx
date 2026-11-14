import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getProducts } from "@/lib/db";
import { FishCard } from "@/components/fish/FishCard";
import { siteConfig, buildWhatsAppUrl } from "@/config/site";
import { MessageCircle, Clock, ShieldCheck, Truck, Sparkles } from "lucide-react";

interface CollectionCampaignProps {
  params: {
    slug: string;
  };
}

interface CampaignInfo {
  title: string;
  subtitle: string;
  heroImage: string;
  badge: string;
  categoryId: string;
  description: string;
  isFutureUpgrade?: boolean;
}

const campaignMetadataMap: Record<string, CampaignInfo> = {
  // Live Plants from HS Aquatics
  plants: {
    title: "Live Aquatic Plants Collection",
    subtitle: "Grown in Optimal Conditions for Easy Establishment & Thriving Aquascapes",
    heroImage: "/images/plants/anubias-dragon-claw.jpg",
    badge: "100% Snail-Free Quarantined",
    categoryId: "aquarium-plants",
    description:
      "Curated selection of delicate aquatic botany, slow-growing epiphytes, and lush mosses sourced from authentic aquaculture facilities. Grown in optimal conditions for easy establishment in planted aquascapes, shrimp tanks, and natural biotopes.",
  },
  "aquarium-plants": {
    title: "Live Freshwater Aquarium Plants",
    subtitle: "Snail-Free Clumps, Potted Epiphytes & Stainless Steel Mounted Flora",
    heroImage: "/images/plants/anubias-dragon-claw.jpg",
    badge: "100% Snail-Free Quarantined",
    categoryId: "aquarium-plants",
    description:
      "Hardy, lush foliage including Anubias cultivars, Java Fern narrow-leaf clumps, and Java Moss pads. Ideal for low-tech and high-tech planted aquariums.",
  },

  // Equipment & Hardware from HS Aquatics
  equipment: {
    title: "Aquarium Filtration & Equipment",
    subtitle: "High-Performance Air Sponge Filters, Slim HOB Waterfall Systems & Hardware",
    heroImage: "/images/equipment/bluepet-xf-280.jpg",
    badge: "Bio-Mechanical Tech",
    categoryId: "equipment",
    description:
      "Essential aquatic hardware, whisper-silent biochemical sponge filters, high-output hang-on waterfall filters, and maintenance equipment designed for stable bio-cycling.",
  },
  filters: {
    title: "Aquarium Filtration Systems",
    subtitle: "Biochemical Air-Driven Sponges, Slim HOB Waterfall Filters & Silent Pumps",
    heroImage: "/images/equipment/bluepet-xf-280.jpg",
    badge: "Biological & Mechanical",
    categoryId: "filters",
    description:
      "Ensure pristine crystal-clear water and stable bio-cycling with multi-chamber sponge filtration, waterfall power units, and low wattage energy consumption.",
  },
  tanks: {
    title: "Ultra-Clear Rimless Aquariums",
    subtitle: "High-Clarity Low-Iron Opti-White Glass with Laser-Cut Silicone Seams",
    heroImage: "/images/fish/angels-rio-nanay.jpg",
    badge: "German Standard Glass",
    categoryId: "tanks",
    description:
      "Crystal clear viewing with maximum light penetration and 91.5% optical transparency for unhindered aquatic appreciation.",
  },
  accessories: {
    title: "Aquarium Tools & Maintenance",
    subtitle: "Stainless Steel Aquascaping Toolsets, Precision Thermometers & Water Care",
    heroImage: "/images/fish/catfish-thailand-glass-catfish.webp",
    badge: "Professional Grade",
    categoryId: "accessories",
    description:
      "Essential maintenance tools, precision digital monitoring instruments, and chemical conditioners for serious hobbyists.",
  },

  // Aquascaping & Feed
  aquascaping: {
    title: "Nature Aqua Scaping & Hardscape",
    subtitle: "Natural Malaysian Driftwood, Ohko Dragon Stone & Volcanic Substrates",
    heroImage: "/images/fish/catfish-red-lizard-whiptail.webp",
    badge: "Aquascaping Essentials",
    categoryId: "aquascaping",
    description:
      "Craft striking underwater landscapes with natural hardscape materials hand-selected for optimal texture, neutral water chemistry, and plant anchoring stability.",
  },
  "aqua-scaping": {
    title: "Nature Aqua Scaping & Hardscape",
    subtitle: "Natural Driftwood, Dragon Stone, Seiryu Rock and Active Substrates",
    heroImage: "/images/fish/catfish-red-lizard-whiptail.webp",
    badge: "Aquascaping Essentials",
    categoryId: "aquascaping",
    description:
      "Craft striking underwater landscapes with natural hardscape materials hand-selected for optimal texture, neutral water chemistry, and plant anchoring stability.",
  },
  "fish-food": {
    title: "Premium Aquatic Nutrition & Feeds",
    subtitle: "High-Protein Micro-Pellets, Freeze-Dried Bloodworms & Spirulina Wafers",
    heroImage: "/images/fish/algae-eaters-panda-garra.webp",
    badge: "Formulated Nutrition",
    categoryId: "fish-food",
    description:
      "Formulated for vibrant color pigmentation, robust disease immunity, and rapid growth without clouding your aquarium water.",
  },

  // Live Fish Collections
  fish: {
    title: "Farm-Bred Ornamental Fish",
    subtitle: "Direct From SRM Fish Farm Breeding Facility, Palamedu, Madurai",
    heroImage: "/images/fish/angels-altum-angel.webp",
    badge: "Fourteen-Day Quarantine",
    categoryId: "fish",
    description:
      "Quarantined, parasite-free ornamental fish conditioned for vitality and feeding vigorously on standard dry feeds.",
  },
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
  barbs: {
    title: "Barbs & Schooling Fish",
    subtitle: "Active Mid-Water Dithers and Dynamic Community Schoolers",
    heroImage: "/images/fish/barbs-black-ruby-barb.jpg",
    badge: "Vibrant Schoolers",
    categoryId: "barbs",
    description:
      "Vivid schooling fishes that add kinetic motion, coloration, and natural schooling dynamics to community setups.",
  },
  badis: {
    title: "Wild Nano & Badis Collection",
    subtitle: "Intricate Micro-Predators and Miniature Biotope Gems",
    heroImage: "/images/fish/livebearers-scarlet-badis.jpg",
    badge: "Nano Specialists",
    categoryId: "badis",
    description:
      "Intricately patterned nano species suited for refined, densely planted nature aquascapes.",
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

  // Future Upgrade Collections (Never 404)
  shrimps: {
    title: "Freshwater Dwarf Shrimps",
    subtitle: "High-Grade Neocaridina & Caridina Colonies",
    heroImage: "/images/fish/algae-eaters-panda-garra.webp",
    badge: "Future Farm Upgrade",
    categoryId: "shrimps",
    description:
      "Currently in dedicated breeding tanks at our Madurai farm. High-grade Red Cherry, Blue Dream, and Crystal Red shrimp colonies under multi-generation conditioning.",
    isFutureUpgrade: true,
  },
  snails: {
    title: "Nature Cleaners & Ornamental Snails",
    subtitle: "Nerite, Military Helmet & Algae Eating Gastropods",
    heroImage: "/images/fish/algae-eaters-otocinclus.jpg",
    badge: "Future Farm Upgrade",
    categoryId: "snails",
    description:
      "Specialized benthic glass cleaners and algae-control snails undergoing therapeutic quarantine before pan-India dispatch.",
    isFutureUpgrade: true,
  },
  merchandise: {
    title: "SRM Fish Farm Merchandise",
    subtitle: "Official Farm Apparel, Breeder Caps & Aquarium Accessories",
    heroImage: "/images/fish/angels-altum-angel.webp",
    badge: "Future Farm Upgrade",
    categoryId: "merchandise",
    description:
      "Official merchandise and breeder supplies designed for passionate aquarists and supporters of SRM Fish Farm.",
    isFutureUpgrade: true,
  },
};

/**
 * Resolves or constructs campaign info dynamically so that NO page ever throws an error
 */
function resolveCampaign(slug: string): CampaignInfo {
  if (campaignMetadataMap[slug]) {
    return campaignMetadataMap[slug];
  }
  const formattedTitle = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return {
    title: `${formattedTitle} Collection`,
    subtitle: "Scheduled for Future Farm Upgrade & Release",
    heroImage: "/images/fish/angels-altum-angel.webp",
    badge: "Future Upgrade",
    categoryId: slug,
    description: `This department is currently undergoing our multi-phase quarantine and stock expansion at our Palamedu, Madurai aquaculture facility. Verified stock will be listed upon biosecure conditioning completion.`,
    isFutureUpgrade: true,
  };
}

export async function generateStaticParams() {
  return [
    { slug: "plants" },
    { slug: "aquarium-plants" },
    { slug: "equipment" },
    { slug: "filters" },
    { slug: "tanks" },
    { slug: "accessories" },
    { slug: "aquascaping" },
    { slug: "aqua-scaping" },
    { slug: "fish-food" },
    { slug: "fish" },
    { slug: "angelfish" },
    { slug: "algae-eaters" },
    { slug: "betta-fish" },
    { slug: "catfish" },
    { slug: "barbs" },
    { slug: "badis" },
    { slug: "exotic-fish" },
    { slug: "shrimps" },
    { slug: "snails" },
    { slug: "merchandise" },
  ];
}

export async function generateMetadata({
  params,
}: CollectionCampaignProps): Promise<Metadata> {
  const campaign = resolveCampaign(params.slug);

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
  const campaign = resolveCampaign(params.slug);
  const allProducts = await getProducts();

  // Flexible category matching for livestock, plants, equipment & general
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
    params.slug === "plants" ||
    params.slug === "aquarium-plants" ||
    campaign.categoryId === "plants" ||
    campaign.categoryId === "aquarium-plants";

  const isEquipmentCategory =
    params.slug === "equipment" || campaign.categoryId === "equipment";

  const filteredProducts =
    campaign.categoryId === "all"
      ? allProducts
      : isPlantsCategory
      ? allProducts.filter(
          (p) =>
            p.categoryId === "aquarium-plants" ||
            p.categoryId === "plants" ||
            p.categoryName.toLowerCase().includes("plant") ||
            p.slug.includes("anubias") ||
            p.slug.includes("fern") ||
            p.slug.includes("moss") ||
            p.slug.includes("sword") ||
            p.slug.includes("ludwigia")
        )
      : isEquipmentCategory
      ? allProducts.filter(
          (p) =>
            p.categoryId === "equipment" ||
            p.categoryId === "filters" ||
            p.categoryId === "tanks" ||
            p.categoryId === "accessories" ||
            p.categoryName.toLowerCase().includes("filter") ||
            p.categoryName.toLowerCase().includes("equipment") ||
            p.categoryName.toLowerCase().includes("tank") ||
            p.categoryName.toLowerCase().includes("accessories")
        )
      : isFishCategory
      ? allProducts.filter(
          (p) =>
            p.categoryId === campaign.categoryId ||
            (campaign.categoryId === "fish" &&
              [
                "angelfish",
                "algae-eaters",
                "betta-fish",
                "catfish",
                "barbs",
                "badis",
                "fish",
              ].includes(p.categoryId))
        )
      : allProducts.filter((p) => p.categoryId === campaign.categoryId);

  const whatsappCampaignUrl = buildWhatsAppUrl(
    siteConfig.whatsapp.campaignInquiryMessage(campaign.title, params.slug),
    { source: "campaign_hero", campaign: params.slug }
  );

  return (
    <div className="min-h-screen bg-[#F5F3EE] text-[#171717]">
      {/* Campaign Hero Header */}
      <section className="bg-[#123B5D] text-white py-12 sm:py-16 border-b border-[#123B5D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs font-medium text-[#E6F4FF]/70 mb-6 uppercase tracking-wider">
            <Link href="/" className="hover:text-white transition-colors">
              HOME
            </Link>
            <span>&gt;</span>
            <Link href="/fish" className="hover:text-white transition-colors">
              COLLECTIONS
            </Link>
            <span>&gt;</span>
            <span className="text-[#E6F4FF] font-semibold">{campaign.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="inline-block px-2.5 py-1 rounded-[2px] bg-white/10 border border-[#A67C52] text-[#A67C52] text-[10px] font-semibold uppercase tracking-[0.2em]">
                {campaign.badge}
              </span>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-[1.15]">
                {campaign.title}
              </h1>

              <p className="text-sm sm:text-base text-[#E6F4FF]/90 font-normal">
                {campaign.subtitle}
              </p>

              <p className="text-xs sm:text-sm text-[#E6F4FF]/70 leading-relaxed max-w-xl">
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
                  <span>Inquire Availability</span>
                </a>

                <Link
                  href="/fish"
                  className="inline-block px-5 py-2.5 rounded-[2px] bg-white/10 border border-white/20 text-white text-xs font-semibold uppercase tracking-wider hover:bg-white/20 transition-colors"
                >
                  Browse Live Fish Catalog
                </Link>
              </div>

              <div className="pt-4 border-t border-white/10 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[#E6F4FF]/70">
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#25D366]" />
                  <span>100% Live Arrival Guarantee</span>
                </span>
                <span>•</span>
                <span>Fourteen-Day Prophylactic Hold</span>
                <span>•</span>
                <span className="inline-flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#A67C52]" />
                  <span>Train & Bus Pan-India Dispatch</span>
                </span>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative aspect-[4/3] rounded-sm overflow-hidden bg-black/20 border border-white/10">
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

      {/* Main Products Grid OR "For Future Upgrade" Showcase */}
      <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-3 border-b border-[#E2E8F0]">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#2878A5] block mb-1">
              CATEGORY SELECTION
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#171717]">
              {filteredProducts.length > 0 ? "Available Products in this Category" : "Department Status"}
            </h2>
          </div>
          <span className="mt-2 sm:mt-0 text-xs text-[#64748B]">
            {filteredProducts.length > 0 ? `${filteredProducts.length} Items Available` : "Scheduled Upgrade"}
          </span>
        </div>

        {filteredProducts.length === 0 ? (
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
                  { source: "future_upgrade", campaign: params.slug }
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
            {filteredProducts.map((product) => (
              <FishCard key={product.productId} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
