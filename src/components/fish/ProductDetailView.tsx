"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Truck, Check, Share2 } from "lucide-react";
import { Product } from "@/types";
import { siteConfig, buildWhatsAppUrl } from "@/config/site";
import { FishCard } from "./FishCard";
import { trackProductView, trackWhatsAppEnquiry } from "@/lib/analytics";
import { useCart } from "@/context/CartContext";

interface ProductDetailViewProps {
  product: Product;
  relatedProducts: Product[];
}

export function ProductDetailView({ product, relatedProducts }: ProductDetailViewProps) {
  const router = useRouter();
  const { addToCart, openCart } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "shipping">("description");
  const [copiedLink, setCopiedLink] = useState(false);
  const [addedToast, setAddedToast] = useState(false);

  const isOutOfStock = product.availability === "out_of_stock";
  const hasDiscount = product.originalPrice > product.sellingPrice;
  const discountAmount = hasDiscount ? product.originalPrice - product.sellingPrice : 0;

  // Track product view on load
  useEffect(() => {
    trackProductView(
      product.productId,
      product.name,
      product.sellingPrice,
      product.categoryName
    );
  }, [product]);

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2500);
    openCart();
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
    router.push("/cart");
  };

  const handleShare = () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator
        .share({
          title: `${product.name} | ${siteConfig.name}`,
          text: `Check out ${product.name} at ${siteConfig.name}`,
          url: window.location.href,
        })
        .catch(() => {});
    } else if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const whatsappInquiryUrl = isOutOfStock
    ? buildWhatsAppUrl(siteConfig.whatsapp.outOfStockMessage(product.name), {
        source: "product_detail_notify",
        campaign: product.categoryId,
      })
    : buildWhatsAppUrl(
        siteConfig.whatsapp.productInquiryMessage(product.name, product.productId),
        {
          source: "product_detail",
          campaign: product.categoryId,
        }
      );

  return (
    <div className="bg-white min-h-screen text-[#020617] pb-16 sm:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Breadcrumbs matching Reference Images */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-[#64748B] mb-6 sm:mb-8 overflow-x-auto whitespace-nowrap pb-1"
        >
          <Link href="/" className="hover:text-[#020617] transition-colors">
            EXPLORE
          </Link>
          <span className="text-gray-300 font-light">&gt;</span>
          <Link href="/fish" className="hover:text-[#020617] transition-colors">
            FISH
          </Link>
          <span className="text-gray-300 font-light">&gt;</span>
          <Link
            href={`/fish?category=${product.categoryId}`}
            className="hover:text-[#020617] transition-colors"
          >
            {product.categoryName?.toUpperCase()}
          </Link>
          <span className="text-gray-300 font-light">&gt;</span>
          <span className="text-[#0055FF] font-semibold truncate max-w-[260px]">
            {product.name.toUpperCase()}
          </span>
        </nav>

        {/* 2-Column Product Detail Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-start mb-16">
          {/* Left Column: Product Specimen Imagery */}
          <div className="flex flex-col gap-3">
            <div className="relative aspect-square w-full rounded-none sm:rounded-[2px] overflow-hidden bg-gray-50 border border-[#E2E8F0]">
              <Image
                src={product.images[selectedImageIndex] || product.images[0] || "/images/fish/algae-eaters-otocinclus.jpg"}
                alt={`${product.name} photo`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />

              {/* Status overlay if out of stock */}
              {isOutOfStock && (
                <div className="absolute inset-0 bg-black/45 z-10 flex items-center justify-center">
                  <span className="text-white text-xs sm:text-sm font-bold uppercase tracking-widest px-3 py-1.5 border border-white/50">
                    OUT OF STOCK
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnail Gallery (if more than 1 image) */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-2.5 overflow-x-auto pb-1 mt-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-20 h-20 rounded-[2px] overflow-hidden shrink-0 border transition-all ${
                      selectedImageIndex === idx
                        ? "border-[#0055FF] ring-2 ring-[#0055FF]/30"
                        : "border-[#E2E8F0] opacity-80 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} thumbnail ${idx + 1}`}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Title, Pricing, Actions & Tabs */}
          <div className="flex flex-col">
            {/* Title & Share */}
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-sans font-bold text-[#020617] tracking-tight leading-tight">
                {product.name}
              </h1>

              <button
                type="button"
                onClick={handleShare}
                className="text-xs text-[#64748B] hover:text-[#020617] inline-flex items-center gap-1.5 p-1 transition-colors shrink-0"
                title="Share species"
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">{copiedLink ? "Copied" : "Share"}</span>
              </button>
            </div>

            {/* SKU */}
            <div className="text-xs text-[#64748B] uppercase tracking-wider font-medium mt-1 mb-4">
              SKU: {product.productId}
            </div>

            {/* Price Line (Matching Images) */}
            <div className="flex items-center gap-3.5 my-3 flex-wrap">
              <span className="text-2xl sm:text-3xl font-bold text-[#0055FF] tracking-tight">
                INR {product.sellingPrice}
              </span>

              {hasDiscount && (
                <span className="text-base sm:text-lg text-[#64748B] line-through font-normal">
                  INR {product.originalPrice}
                </span>
              )}

              {hasDiscount && (
                <span className="inline-flex items-center px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-[#00A884] bg-[#E8F8F5] border border-[#A3E5D8] rounded-[2px]">
                  INR {discountAmount} OFF
                </span>
              )}
            </div>

            {/* Shipping Information & Rates link with truck icon */}
            <button
              type="button"
              onClick={() => setActiveTab("shipping")}
              className="text-xs text-[#64748B] hover:text-[#020617] underline inline-flex items-center gap-2 mt-1 mb-6 cursor-pointer text-left w-fit"
            >
              <Truck className="w-4 h-4 text-[#64748B] shrink-0" />
              <span>Shipping Information & Rates</span>
            </button>

            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#020617] mb-2">
                QUANTITY
              </label>
              <div className="inline-flex items-stretch border border-[#E2E8F0] rounded-[2px] bg-white h-11 w-44 sm:w-48">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-14 flex items-center justify-center text-[#64748B] hover:text-[#020617] hover:bg-gray-50 border-r border-[#E2E8F0] transition-colors font-medium text-lg"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="flex-1 flex items-center justify-center font-medium text-sm text-[#020617] select-none">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-14 flex items-center justify-center text-[#64748B] hover:text-[#020617] hover:bg-gray-50 border-l border-[#E2E8F0] transition-colors font-medium text-lg"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              {/* Subtotal Calculation Line */}
              <div className="text-xs text-[#64748B] mt-2 font-medium">
                INR {product.sellingPrice * quantity} &nbsp;&nbsp; {quantity} × INR {product.sellingPrice}
              </div>
            </div>

            {/* Action Buttons: ADD TO CART & BUY NOW (Inline, side-by-side) */}
            {isOutOfStock ? (
              <div className="space-y-3 mb-6">
                <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 text-xs rounded-sm">
                  Currently out of stock. Contact us on WhatsApp to be prioritized on the next quarantined batch.
                </div>
                <a
                  href={whatsappInquiryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackWhatsAppEnquiry("product_details", product.name, product.sellingPrice)}
                  className="block w-full py-3.5 px-6 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs sm:text-sm font-semibold uppercase tracking-wider rounded-sm text-center transition-colors"
                >
                  Notify Me on WhatsApp
                </a>
              </div>
            ) : (
              <div className="flex items-center gap-3 sm:gap-4 my-4">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 py-3.5 px-6 bg-[#0055FF] hover:bg-[#0041CC] text-white text-xs sm:text-sm font-semibold uppercase tracking-wider rounded-none sm:rounded-[2px] transition-colors text-center shadow-xs"
                >
                  ADD TO CART
                </button>
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="flex-1 py-3.5 px-6 bg-white hover:bg-gray-50 border border-[#E2E8F0] text-[#020617] text-xs sm:text-sm font-semibold uppercase tracking-wider rounded-none sm:rounded-[2px] transition-colors text-center"
                >
                  BUY NOW
                </button>
              </div>
            )}

            {/* Cart Success Feedback */}
            {addedToast && (
              <div className="p-2.5 bg-green-50 border border-green-200 text-green-800 text-xs rounded-sm flex items-center gap-2 mb-4 animate-in fade-in">
                <Check className="w-4 h-4 text-green-600" />
                <span>Added {quantity} × {product.name} to cart.</span>
              </div>
            )}

            {/* Direct WhatsApp Consultation Link */}
            <div className="pt-2 pb-4">
              <a
                href={whatsappInquiryUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackWhatsAppEnquiry("product_details", product.name, product.sellingPrice)}
                className="text-xs text-[#64748B] hover:text-[#0055FF] inline-flex items-center gap-1.5 transition-colors"
              >
                <span>Have questions? WhatsApp specialist at {siteConfig.whatsapp.displayNumber}</span>
              </a>
            </div>

            {/* Tabs: DESCRIPTION & SHIPPING */}
            <div className="border-b border-[#E2E8F0] mt-6 mb-6 flex items-center gap-8">
              <button
                type="button"
                onClick={() => setActiveTab("description")}
                className={`pb-3 text-xs sm:text-sm font-semibold uppercase tracking-wider transition-colors ${
                  activeTab === "description"
                    ? "text-[#0055FF] border-b-2 border-[#0055FF] -mb-px"
                    : "text-[#64748B] hover:text-[#020617]"
                }`}
              >
                DESCRIPTION
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("shipping")}
                className={`pb-3 text-xs sm:text-sm font-semibold uppercase tracking-wider transition-colors ${
                  activeTab === "shipping"
                    ? "text-[#0055FF] border-b-2 border-[#0055FF] -mb-px"
                    : "text-[#64748B] hover:text-[#020617]"
                }`}
              >
                SHIPPING
              </button>
            </div>

            {/* Tab 1: DESCRIPTION */}
            {activeTab === "description" && (
              <div className="space-y-4 text-sm text-[#020617]/80 leading-relaxed animate-in fade-in duration-200">
                <h3 className="text-base font-bold text-[#020617]">
                  {product.categoryName} – Care Guide & Aquarium Companions
                </h3>

                <p>
                  Specialist ornamental freshwater livestock acclimated under quarantine holding.
                  All specimens are monitored for healthy grazing behavior, swimming vigor, and finnage integrity.
                </p>

                <p>{product.description}</p>

                {/* Parameters Table */}
                {product.careInformation && (
                  <div className="mt-6 pt-4 border-t border-[#E2E8F0]">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[#020617] mb-3">
                      Aquarium Husbandry Specs
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                      <div className="p-3 bg-gray-50 rounded-sm border border-[#E2E8F0]">
                        <span className="text-[10px] text-[#64748B] uppercase font-medium block">
                          Min Tank Size
                        </span>
                        <span className="font-semibold text-[#020617] mt-0.5 block">
                          {product.careInformation.tankSize}
                        </span>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-sm border border-[#E2E8F0]">
                        <span className="text-[10px] text-[#64748B] uppercase font-medium block">
                          Temperature
                        </span>
                        <span className="font-semibold text-[#020617] mt-0.5 block">
                          {product.careInformation.temperature}
                        </span>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-sm border border-[#E2E8F0]">
                        <span className="text-[10px] text-[#64748B] uppercase font-medium block">
                          pH Range
                        </span>
                        <span className="font-semibold text-[#020617] mt-0.5 block">
                          {product.careInformation.phRange}
                        </span>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-sm border border-[#E2E8F0]">
                        <span className="text-[10px] text-[#64748B] uppercase font-medium block">
                          Temperament
                        </span>
                        <span className="font-semibold text-[#020617] mt-0.5 block">
                          {product.careInformation.temperament}
                        </span>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-sm border border-[#E2E8F0]">
                        <span className="text-[10px] text-[#64748B] uppercase font-medium block">
                          Care Level
                        </span>
                        <span className="font-semibold text-[#020617] mt-0.5 block">
                          {product.careInformation.careLevel}
                        </span>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-sm border border-[#E2E8F0]">
                        <span className="text-[10px] text-[#64748B] uppercase font-medium block">
                          Diet
                        </span>
                        <span className="font-semibold text-[#020617] mt-0.5 block truncate" title={product.careInformation.diet}>
                          {product.careInformation.diet}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: SHIPPING */}
            {activeTab === "shipping" && (
              <div className="space-y-4 text-sm text-[#020617]/80 leading-relaxed animate-in fade-in duration-200">
                <h3 className="text-base font-bold text-[#020617]">
                  DOA Guarantee & Shipping Policy
                </h3>
                <p>
                  We guarantee 100% Live Arrival (DOA Guarantee) on all train and bus shipments
                  across India. Orders are prepared with professional medical oxygen and packaged
                  in heavy-duty insulated thermocol (EPS) containers to maintain stable water temperatures.
                </p>

                <div className="p-4 bg-[#EFF6FF] border border-[#0055FF]/20 rounded-sm text-xs text-[#0F172A] space-y-1.5">
                  <p className="font-bold uppercase tracking-wide text-[#0055FF]">Dispatch Protocol:</p>
                  <p>• Orders dispatched within 48 hours following quarantine clearance.</p>
                  <p>• Tracking numbers and bus/train parcel waybills shared directly via WhatsApp.</p>
                  <p>• Unboxing video required within 2 hours of arrival for DOA warranty claims.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products Grid (2-column on mobile, 4-column on desktop) */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 pt-12 border-t border-[#E2E8F0]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-[#020617]">
                Related Species
              </h2>
              <Link
                href={`/fish?category=${product.categoryId}`}
                className="text-xs font-semibold uppercase tracking-wider text-[#0055FF] hover:underline"
              >
                View all in {product.categoryName} &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
              {relatedProducts.slice(0, 4).map((related) => (
                <FishCard key={related.productId} product={related} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* NOTE: Sticky bottom bar on mobile has been completely removed as requested */}
    </div>
  );
}
