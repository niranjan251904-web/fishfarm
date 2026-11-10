export const siteConfig = {
  name: "HS AQUATICS",
  legalName: "HS Aquatics",
  tagline: "Curated Aquatic Standard",
  description:
    "Curated collection of quarantined, high-pedigree ornamental fish. Shipped across India in climate-controlled temperature-stabilized oxygenated packaging with guaranteed live arrival.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://hsaquatics.in",
  
  // WhatsApp Configuration (Centralized)
  whatsapp: {
    // 80981 47347
    number: "918098147347",
    displayNumber: "+91 80981 47347",
    defaultMessage:
      "Hello HS Aquatics! I would like to inquire about current ornamental fish availability and dispatch schedule.",
    productInquiryMessage: (productName: string, sku?: string) =>
      `Hello HS Aquatics! I am interested in ${productName}${sku ? ` (SKU: ${sku})` : ""}. Please share availability and delivery details to my pin code.`,
    outOfStockMessage: (productName: string) =>
      `Hello HS Aquatics! I noticed ${productName} is currently out of stock. Please notify me via WhatsApp when the next quarantined batch is ready for dispatch.`,
    campaignInquiryMessage: (campaignName: string, utmSource?: string) =>
      `Hello HS Aquatics! I'm browsing your ${campaignName} collection${utmSource ? ` from ${utmSource}` : ""}. Could you help me with species selection and tank compatibility?`,
  },

  contact: {
    email: "support@hsaquatics.in",
    supportEmail: "support@hsaquatics.in",
    address: "HS Aquatics Aquaculture Facility, Tamil Nadu, India",
    hours: "Monday - Saturday: 9:00 AM - 7:30 PM IST (WhatsApp active 7 days)",
    emergencySupport: "24/7 Acclimation Emergency WhatsApp Helpline",
  },

  guarantee: {
    liveArrival: "DOA Guarantee on Train & Bus Shipments and Airport Air Cargo",
    quarantine: "Minimum 14-day therapeutic bio-secure conditioning & observation",
    packaging: "Double-gauge medical oxygenated bags with insulated EPS foam containers",
  },

  // Fish-first navigation links (Shrimps, Plants, Snails, Equipment, Merchandise removed)
  navLinks: [
    { label: "Explore", href: "/" },
    { label: "All Fish", href: "/fish" },
    { label: "Angels", href: "/fish?category=angelfish" },
    { label: "Algae Eaters", href: "/fish?category=algae-eaters" },
    { label: "Catfish & Plecos", href: "/fish?category=catfish" },
    { label: "Bettas", href: "/fish?category=betta-fish" },
    { label: "Barbs & Tetras", href: "/fish?category=barbs" },
    { label: "Terms", href: "/terms" },
  ],

  campaignCollections: [
    { name: "Angelfish Sanctuary", slug: "angelfish", categoryId: "angelfish" },
    { name: "Algae Eaters & Cleaners", slug: "algae-eaters", categoryId: "algae-eaters" },
    { name: "Show Betta Fish", slug: "betta-fish", categoryId: "betta-fish" },
    { name: "Exotic Catfish & Plecos", slug: "catfish", categoryId: "catfish" },
    { name: "Barbs & Tetras", slug: "barbs", categoryId: "barbs" },
    { name: "Wild Nano & Badis", slug: "badis", categoryId: "badis" },
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
