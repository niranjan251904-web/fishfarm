"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Trash2,
  Plus,
  Minus,
  MessageCircle,
} from "lucide-react";
import { useCart, CustomerDetails } from "@/context/CartContext";
import { formatCurrency, formatCurrencyDecimals } from "@/config/site";

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    totalItems,
    generateWhatsAppBillUrl,
  } = useCart();

  const [customer, setCustomer] = useState<CustomerDetails>({
    name: "",
    phone: "",
    city: "",
    state: "",
    pinCode: "",
    notes: "",
  });

  const [formError, setFormError] = useState("");

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer.name.trim()) {
      setFormError("Please enter your name to generate your official bill.");
      return;
    }
    if (!customer.pinCode.trim()) {
      setFormError("Please enter your delivery PIN code to calculate shipping.");
      return;
    }
    setFormError("");

    const url = generateWhatsAppBillUrl(customer);
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-white py-8 sm:py-14 text-[#020617]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-medium text-[#64748B] mb-6 uppercase tracking-wider">
          <Link href="/" className="hover:text-[#020617] transition-colors">
            HOME
          </Link>
          <span>&gt;</span>
          <Link href="/fish" className="hover:text-[#020617] transition-colors">
            FISH COLLECTION
          </Link>
          <span>&gt;</span>
          <span className="text-[#0055FF] font-semibold">SHOPPING CART</span>
        </nav>

        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#0055FF] block mb-1">
              CONSIGNMENT COMPILATION
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#020617]">
              Selected Specimens & Invoice Summary
            </h1>
          </div>

          {items.length > 0 && (
            <button
              type="button"
              onClick={clearCart}
              className="text-xs font-semibold text-[#64748B] hover:text-red-600 transition-colors inline-flex items-center gap-1 uppercase tracking-wider"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Cart</span>
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="py-20 text-center bg-gray-50 rounded-none sm:rounded-[2px] border border-[#E2E8F0] p-8 max-w-xl mx-auto space-y-3">
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#0055FF] block">
              ZERO ITEMS SELECTED
            </span>
            <h2 className="text-2xl font-bold text-[#020617]">
              Your Cart is Currently Empty
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B] max-w-sm mx-auto leading-relaxed">
              Explore our quarantined catalog of Wild Altum Angels, Panda Garra, Siamese Algae Eaters, and show bettas.
            </p>
            <div className="pt-2">
              <Link
                href="/fish"
                className="inline-block px-6 py-2.5 rounded-[2px] bg-[#0055FF] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#0041CC] transition-colors shadow-xs"
              >
                Browse Fish Collection
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Cart Items List (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="text-[10px] uppercase tracking-wider text-[#64748B] font-semibold">
                Selected Quarantined Specimens ({totalItems})
              </div>

              {items.map((item) => (
                <div
                  key={item.product.productId}
                  className="p-4 bg-white rounded-none sm:rounded-[2px] border border-[#E2E8F0] flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="relative w-16 h-16 rounded-[2px] overflow-hidden bg-gray-100 shrink-0 border border-[#E2E8F0]">
                      <Image
                        src={item.product.images[0] || "/images/fish/algae-eaters-otocinclus.jpg"}
                        alt={item.product.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[9px] font-semibold uppercase tracking-wider text-[#0055FF] block">
                        {item.product.categoryName} · {item.product.size}
                      </span>
                      <h3 className="font-semibold text-sm text-[#020617] truncate">
                        <Link href={`/fish/${item.product.slug}`} className="hover:underline">
                          {item.product.name}
                        </Link>
                      </h3>
                      {item.product.scientificName && (
                        <p className="text-xs italic text-[#64748B] truncate">
                          {item.product.scientificName}
                        </p>
                      )}
                      <div className="text-xs font-semibold text-[#020617] mt-0.5">
                        Unit: {formatCurrencyDecimals(item.product.sellingPrice)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-[#E2E8F0]">
                    {/* Quantity Picker */}
                    <div className="flex items-center border border-[#E2E8F0] rounded-sm bg-gray-50 overflow-hidden">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product.productId, item.quantity - 1)}
                        className="p-1.5 hover:bg-gray-200 text-[#020617] transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2.5 text-xs font-bold text-[#020617]">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product.productId, item.quantity + 1)}
                        className="p-1.5 hover:bg-gray-200 text-[#020617] transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="font-bold text-sm text-[#020617] block">
                        {formatCurrencyDecimals(item.product.sellingPrice * item.quantity)}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.product.productId)}
                      className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              <div className="p-3.5 bg-gray-50 border border-[#E2E8F0] rounded-sm text-xs text-[#64748B] flex flex-wrap items-center justify-between gap-3">
                <span><strong>Quarantine Verification:</strong> 14-day sequence complete</span>
                <span>•</span>
                <span><strong>Packaging:</strong> Pure medical oxygen & EPS box</span>
              </div>
            </div>

            {/* Right Column: Checkout Billing Form (5 cols) */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-none sm:rounded-[2px] p-6 sm:p-7 border border-[#E2E8F0] sticky top-24 space-y-5 text-[#020617] shadow-xs">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#0055FF] block">
                    MANIFEST VERIFICATION
                  </span>
                  <h2 className="text-xl font-bold text-[#020617]">
                    Consignee Order Summary
                  </h2>
                </div>

                {/* Customer Details Form */}
                <form onSubmit={handleCheckout} className="space-y-3.5">
                  {formError && (
                    <div className="p-2.5 rounded-sm bg-red-50 border border-red-200 text-xs text-red-700">
                      {formError}
                    </div>
                  )}

                  <div>
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-[#020617] block mb-1">
                      Full Legal Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={customer.name}
                      onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                      placeholder="e.g. Aditi Roy"
                      className="w-full px-3 py-2 rounded-sm bg-gray-50 border border-[#E2E8F0] text-xs text-[#020617] focus:outline-none focus:border-[#0055FF]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-[10px] font-semibold uppercase tracking-wider text-[#020617] block mb-1">
                        Destination PIN *
                      </label>
                      <input
                        type="text"
                        required
                        value={customer.pinCode}
                        onChange={(e) => setCustomer({ ...customer, pinCode: e.target.value })}
                        placeholder="e.g. 700001"
                        className="w-full px-3 py-2 rounded-sm bg-gray-50 border border-[#E2E8F0] text-xs text-[#020617] focus:outline-none focus:border-[#0055FF]"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-semibold uppercase tracking-wider text-[#020617] block mb-1">
                        City / State
                      </label>
                      <input
                        type="text"
                        value={customer.city}
                        onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                        placeholder="e.g. Kolkata, WB"
                        className="w-full px-3 py-2 rounded-sm bg-gray-50 border border-[#E2E8F0] text-xs text-[#020617] focus:outline-none focus:border-[#0055FF]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-[#020617] block mb-1">
                      Delivery / Packaging Notes (Optional)
                    </label>
                    <input
                      type="text"
                      value={customer.notes}
                      onChange={(e) => setCustomer({ ...customer, notes: e.target.value })}
                      placeholder="e.g. Request station/bus counter parcel collection"
                      className="w-full px-3 py-2 rounded-sm bg-gray-50 border border-[#E2E8F0] text-xs text-[#020617] focus:outline-none focus:border-[#0055FF]"
                    />
                  </div>

                  {/* Pricing Breakdown Card */}
                  <div className="pt-3 border-t border-[#E2E8F0] space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-[#020617]">
                      <span>Items Subtotal</span>
                      <span className="font-bold text-[#020617]">{formatCurrencyDecimals(subtotal)}</span>
                    </div>
                    <div className="flex items-center justify-between text-[#64748B] text-[11px]">
                      <span>EPS Foam Container & Medical Oxygen</span>
                      <span className="text-[#0055FF] font-semibold uppercase text-[10px]">
                        Included
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[#64748B] text-[11px]">
                      <span>Live Arrival Guarantee (DOA)</span>
                      <span className="text-[#0055FF] font-semibold uppercase text-[10px]">
                        Included
                      </span>
                    </div>

                    <div className="pt-2.5 border-t border-[#E2E8F0] flex items-baseline justify-between">
                      <div>
                        <span className="font-bold text-sm text-[#020617] block">
                          Total Specimen Value
                        </span>
                        <span className="text-[10px] text-[#64748B]">
                          + Dispatch details on WhatsApp
                        </span>
                      </div>
                      <span className="font-bold text-xl text-[#0055FF]">
                        {formatCurrencyDecimals(subtotal)}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3 px-4 rounded-sm bg-[#0055FF] hover:bg-[#0041CC] text-white text-xs font-semibold uppercase tracking-wider transition-colors text-center shadow-xs"
                    >
                      Send Order Bill via WhatsApp
                    </button>
                  </div>

                  <p className="text-[10px] text-center text-[#64748B] leading-relaxed">
                    Direct checkout manifest sent to SRM Fish Farm live desk (+91 83007 38588).
                  </p>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
