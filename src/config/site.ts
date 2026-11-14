export const siteConfig = {
  name: "SRM FISH FARM",
  legalName: "SRM Fish Farm",
  owner: "R. Sankar",
  tagline: "Wholesale · Fish Breeding · Aquascaping & Maintenance",
  description:
    "Direct farm-bred ornamental fish, wholesale supply, pedigree breeding varieties, and custom aquascaping and biotope maintenance by R. Sankar, Madurai. 2 years of quality breeding and guaranteed live arrival.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://srmfishfarm.in",
  operatingYears: "2 years",
  services: [
    "Wholesale",
    "Fish Breeding",
    "Aquascaping",
    "Aquarium Maintenance",
  ],
  
  // WhatsApp Configuration (Centralized)
  whatsapp: {
    // 83007 38588 (R. Sankar)
    number: "918300738588",
    displayNumber: "+91 83007 38588",
    defaultMessage:
      "Hello SRM Fish Farm! I would like to inquire about current ornamental fish availability, wholesale rates, and dispatch schedule.",
    productInquiryMessage: (productName: string, sku?: string) =>
      `Hello SRM Fish Farm! I am interested in ${productName}${sku ? ` (SKU: ${sku})` : ""}. Please share availability and delivery details to my pin code.`,
    outOfStockMessage: (productName: string) =>
      `Hello SRM Fish Farm! I noticed ${productName} is currently out of stock. Please notify me via WhatsApp when the next farm batch is ready for dispatch.`,
    campaignInquiryMessage: (campaignName: string, utmSource?: string) =>
      `Hello SRM Fish Farm! I'm browsing your ${campaignName} collection${utmSource ? ` from ${utmSource}` : ""}. Could you help me with species selection and tank compatibility?`,
  },

  contact: {
    owner: "R. Sankar",
    phone: "83007 38588",
    email: "srmfishfarm@gmail.com",
    supportEmail: "srmfishfarm@gmail.com",
    address: "17, Sellaji Amman (Kovil) Street, Palamedu, Madurai – 625503",
    hours: "All Days: 9:00 AM – 4:00 PM (WhatsApp active for inquiries)",
    emergencySupport: "Direct Farm Concierge & WhatsApp Helpline (+91 83007 38588)",
  },

  guarantee: {
    liveArrival: "DOA Guarantee on Train & Bus Shipments and Airport Air Cargo",
    quarantine: "Minimum 14-day therapeutic bio-secure conditioning & observation",
    packaging: "Double-gauge medical oxygenated bags with insulated EPS foam containers",
  },

  // Store navigation links: Fish, Aqua Scaping, Fish Food, Aquarium Plants, Tanks, Filters, Accessories
  navLinks: [
    { label: "Fish", href: "/fish" },
    { label: "Aqua Scaping", href: "/collections/aquascaping" },
    { label: "Fish Food", href: "/collections/fish-food" },
    { label: "Aquarium Plants", href: "/collections/aquarium-plants" },
    { label: "Tanks", href: "/collections/tanks" },
    { label: "Filters", href: "/collections/filters" },
    { label: "Accessories", href: "/collections/accessories" },
  ],

  campaignCollections: [
    { name: "Live Ornamental Fish", slug: "fish", categoryId: "fish" },
    { name: "Aqua Scaping Hardscape", slug: "aquascaping", categoryId: "aquascaping" },
    { name: "Premium Fish Food", slug: "fish-food", categoryId: "fish-food" },
    { name: "Aquarium Plants", slug: "aquarium-plants", categoryId: "aquarium-plants" },
    { name: "Live Plants", slug: "plants", categoryId: "aquarium-plants" },
    { name: "Ultra-Clear Glass Tanks", slug: "tanks", categoryId: "tanks" },
    { name: "Canister & Bio Filters", slug: "filters", categoryId: "filters" },
    { name: "Aquarium Equipment", slug: "equipment", categoryId: "equipment" },
    { name: "Aquarium Accessories", slug: "accessories", categoryId: "accessories" },
  ],
};

/**
 * Builds a clean, fully encoded WhatsApp direct URL with optional UTM campaign preservation
 */
export function buildWhatsAppUrl(
  message: string,
  utmParams?: { source?: string; medium?: string; campaign?: string }
): string {
  const cleanNumber = siteConfig.whatsapp.number.replace(/[^0-9]/g, "");
  
  let finalMessage = message;
  if (utmParams && (utmParams.source || utmParams.campaign)) {
    finalMessage += `\n\n[Ref: ${utmParams.source || "web"}${utmParams.campaign ? ` / ${utmParams.campaign}` : ""}]`;
  }

  const encodedMessage = encodeURIComponent(finalMessage);
  return `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
}

/**
 * Formats numbers into standard Indian Rupee currency format (e.g. INR 190 or INR 4,999.00)
 */
export function formatCurrency(amount: number, includeDecimals = false): string {
  if (includeDecimals) {
    return `INR ${new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)}`;
  }
  return `INR ${new Intl.NumberFormat("en-IN").format(amount)}`;
}

export function formatCurrencyDecimals(amount: number): string {
  return `INR ${new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)}`;
}
