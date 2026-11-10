/**
 * Analytics and Conversion Tracking Utility
 * Supports GA4, Meta Pixel (Facebook Pixel), and Google Ads conversions
 * with UTM parameter preservation and de-duplication.
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export interface UTMParameters {
  [key: string]: string | undefined;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
}

/**
 * Extracts and persists UTM parameters from the current URL
 */
export function getStoredUTMParameters(): UTMParameters {
  if (typeof window === "undefined") return {};

  try {
    const urlParams = new URLSearchParams(window.location.search);
    const utms: UTMParameters = {};

    ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"].forEach(
      (param) => {
        const val = urlParams.get(param);
        if (val) {
          utms[param] = val;
        }
      }
    );

    if (Object.keys(utms).length > 0) {
      sessionStorage.setItem("aura_utm_params", JSON.stringify(utms));
      return utms;
    }

    const saved = sessionStorage.getItem("aura_utm_params");
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {
    // ignore
  }

  return {};
}

// Memory set to prevent duplicate event fires in the same session
const firedEvents = new Set<string>();

/**
 * Track Product View
 */
export function trackProductView(productId: string, productName: string, price: number, category: string) {
  const eventKey = `view_item_${productId}`;
  if (firedEvents.has(eventKey)) return;
  firedEvents.add(eventKey);

  const utm = getStoredUTMParameters();

  if (typeof window !== "undefined") {
    // GA4
    if (typeof window.gtag === "function") {
      window.gtag("event", "view_item", {
        currency: "INR",
        value: price,
        items: [{ item_id: productId, item_name: productName, item_category: category, price }],
        ...utm,
      });
    }

    // Meta Pixel
    if (typeof window.fbq === "function") {
      window.fbq("track", "ViewContent", {
        content_name: productName,
        content_category: category,
        content_ids: [productId],
        content_type: "product",
        value: price,
        currency: "INR",
      });
    }

    console.log(`[Analytics] Tracked Product View: ${productName} (₹${price})`, utm);
  }
}

/**
 * Track Category View
 */
export function trackCategoryView(categoryId: string, categoryName: string) {
  const utm = getStoredUTMParameters();
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", "view_item_list", {
      item_list_id: categoryId,
      item_list_name: categoryName,
      ...utm,
    });
  }
}

/**
 * Track Search Action
 */
export function trackSearch(searchQuery: string, resultCount: number) {
  if (!searchQuery.trim()) return;
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", "search", {
      search_term: searchQuery,
      result_count: resultCount,
    });
  }
}

/**
 * Track WhatsApp Click / Lead Enquiry
 */
export function trackWhatsAppEnquiry(
  context: "product_card" | "product_details" | "floating_cta" | "hero_cta" | "landing_page",
  productName?: string,
  price?: number
) {
  const utm = getStoredUTMParameters();

  if (typeof window !== "undefined") {
    // GA4
    if (typeof window.gtag === "function") {
      window.gtag("event", "generate_lead", {
        currency: "INR",
        value: price || 0,
        lead_type: "whatsapp_enquiry",
        context,
        product_name: productName || "General Inquiry",
        ...utm,
      });
    }

    // Meta Pixel Lead
    if (typeof window.fbq === "function") {
      window.fbq("track", "Lead", {
        content_name: productName || "General Inquiry",
        value: price || 0,
        currency: "INR",
        status: "whatsapp_clicked",
      });
    }

    // Google Ads conversion trigger if gtag is configured
    if (typeof window.gtag === "function" && process.env.NEXT_PUBLIC_GADS_CONVERSION_ID) {
      window.gtag("event", "conversion", {
        send_to: process.env.NEXT_PUBLIC_GADS_CONVERSION_ID,
        value: price || 0,
        currency: "INR",
      });
    }

    console.log(`[Analytics] Tracked WhatsApp Lead (${context}): ${productName || "General"}`, utm);
  }
}
