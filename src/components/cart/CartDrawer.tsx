"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
} from "lucide-react";
import { useCart, CustomerDetails } from "@/context/CartContext";
import { formatCurrency } from "@/config/site";

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
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

  // Lock body scroll when cart drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer.name.trim()) {
      setFormError("Please enter your name to generate your order bill.");
      return;
    }
    if (!customer.pinCode.trim()) {
      setFormError("Please enter your delivery PIN code to estimate dispatch.");
      return;
    }

    setFormError("");
    const whatsappBillUrl = generateWhatsAppBillUrl(customer);
    window.open(whatsappBillUrl, "_blank", "noopener,noreferrer");
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex justify-end"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={closeCart}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 text-[#171717]">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-[#E2E8F0] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#2878A5]" />
            <div>
              <h3 className="font-sans font-bold text-base text-[#171717]">
                Your Aquatic Cart
              </h3>
              <p className="text-xs text-[#64748B]">
                {totalItems} {totalItems === 1 ? "specimen" : "specimens"} selected
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeCart}
            className="p-1.5 text-[#64748B] hover:text-[#171717] rounded-sm hover:bg-[#F5F3EE] transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 bg-[#F5F3EE]/30">
          {items.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#F5F3EE] flex items-center justify-center text-[#64748B]">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h4 className="font-sans font-bold text-base text-[#171717]">
                Your cart is empty
              </h4>
              <p className="text-xs text-[#64748B] max-w-xs mx-auto leading-relaxed">
                Explore our quarantined ornamental fish collection to select healthy, conditioned specimens.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={closeCart}
                  className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#2878A5] hover:bg-[#123B5D] rounded-sm transition-colors"
                >
                  Browse Fish Collection
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Product List */}
              <div className="space-y-3">
                <div className="text-[10px] uppercase tracking-wider text-[#64748B] font-semibold">
                  Selected Live Specimens
                </div>

                {items.map((item) => (
                  <div
                    key={item.product.productId}
                    className="p-3 bg-white rounded-sm border border-[#E2E8F0] flex gap-3 items-center"
                  >
                    {/* Fish Thumbnail */}
                    <div className="relative w-14 h-14 rounded-[2px] overflow-hidden bg-gray-100 shrink-0 border border-[#E2E8F0]">
                      <Image
                        src={item.product.images[0] || "/images/fish/algae-eaters-otocinclus.jpg"}
                        alt={item.product.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>

                    {/* Fish Details */}
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-semibold uppercase tracking-wider text-[#2878A5]">
                          {item.product.categoryName}
                        </span>
                        <span className="text-[10px] text-[#64748B]">
                          {item.product.size}
                        </span>
                      </div>

                      <h4 className="font-sans font-semibold text-xs text-[#171717] truncate">
                        {item.product.name}
                      </h4>

                      <div className="flex items-center justify-between mt-2">
                        {/* Quantity Counter */}
                        <div className="flex items-center border border-[#E2E8F0] rounded-sm bg-[#F5F3EE] overflow-hidden">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.product.productId, item.quantity - 1)
                            }
                            className="px-1.5 py-0.5 hover:bg-gray-200 text-[#171717] transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-2.5 h-2.5" />
                          </button>
                          <span className="px-2 text-xs font-semibold text-[#171717]">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.product.productId, item.quantity + 1)
                            }
                            className="px-1.5 py-0.5 hover:bg-gray-200 text-[#171717] transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-2.5 h-2.5" />
                          </button>
                        </div>

                        {/* Price Subtotal */}
                        <div className="text-right flex items-center gap-2">
                          <span className="font-sans font-bold text-[#171717] text-xs">
                            {formatCurrency(item.product.sellingPrice * item.quantity)}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.product.productId)}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                            title="Remove fish"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery & Billing Address Info Form */}
              <div className="pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider text-[#64748B] font-semibold">
                    Consignee and Dispatch Pin Code
                  </span>
                  <span className="text-[10px] text-[#2878A5]">For WhatsApp Manifest</span>
                </div>

                {formError && (
                  <div className="p-2.5 rounded-sm bg-red-50 border border-red-200 text-xs text-red-700">
                    {formError}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-[#171717] block mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={customer.name}
                      onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                      placeholder="e.g. Vikram Sharma"
                      className="w-full px-2.5 py-1.5 rounded-sm bg-white border border-[#E2E8F0] text-xs text-[#171717] focus:outline-none focus:border-[#2878A5]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-[#171717] block mb-1">
                      Destination PIN *
                    </label>
                    <input
                      type="text"
                      required
                      value={customer.pinCode}
                      onChange={(e) => setCustomer({ ...customer, pinCode: e.target.value })}
                      placeholder="e.g. 560001"
                      className="w-full px-2.5 py-1.5 rounded-sm bg-white border border-[#E2E8F0] text-xs text-[#171717] focus:outline-none focus:border-[#2878A5]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-[#171717] block mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      value={customer.city}
                      onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                      placeholder="e.g. Bengaluru"
                      className="w-full px-2.5 py-1.5 rounded-sm bg-white border border-[#E2E8F0] text-xs text-[#171717] focus:outline-none focus:border-[#2878A5]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-[#171717] block mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      value={customer.state}
                      onChange={(e) => setCustomer({ ...customer, state: e.target.value })}
                      placeholder="e.g. Karnataka"
                      className="w-full px-2.5 py-1.5 rounded-sm bg-white border border-[#E2E8F0] text-xs text-[#171717] focus:outline-none focus:border-[#2878A5]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-[#171717] block mb-1">
                    Special Packaging or Delivery Note
                  </label>
                  <input
                    type="text"
                    value={customer.notes}
                    onChange={(e) => setCustomer({ ...customer, notes: e.target.value })}
                    placeholder="e.g. Prefer parcel collection at railway station / bus stand"
                    className="w-full px-2.5 py-1.5 rounded-sm bg-white border border-[#E2E8F0] text-xs text-[#171717] focus:outline-none focus:border-[#2878A5]"
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Bottom Billing Footer & WhatsApp Checkout CTA */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-[#E2E8F0] bg-white space-y-3">
            {/* Bill Summary Breakdown */}
            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between text-[#171717]">
                <span>Items Subtotal</span>
                <span className="font-sans font-bold text-[#171717] text-sm">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-[#64748B] text-[11px]">
                <span>EPS Foam Box & Medical Oxygen</span>
                <span className="text-[#2878A5] font-semibold uppercase text-[10px]">
                  Included
                </span>
              </div>
              <div className="flex items-center justify-between text-[#64748B] text-[11px]">
                <span>Transit Guarantee</span>
                <span className="italic text-[#171717]">100% DOA Guarantee</span>
              </div>

              <div className="pt-2 border-t border-[#E2E8F0] flex items-baseline justify-between">
                <div>
                  <span className="font-sans font-bold text-sm text-[#171717] block">
                    Total Specimen Value
                  </span>
                  <span className="text-[10px] text-[#64748B]">
                    + Dispatch details quoted on WhatsApp
                  </span>
                </div>
                <span className="font-sans font-bold text-lg text-[#2878A5]">
                  {formatCurrency(subtotal)}
                </span>
              </div>
            </div>

            {/* Direct WhatsApp Order Billing Action */}
            <button
              type="button"
              onClick={handleCheckout}
              className="w-full block py-3 px-4 rounded-sm bg-[#2878A5] hover:bg-[#123B5D] text-white font-semibold text-xs uppercase tracking-wider transition-colors text-center shadow-xs"
            >
              Generate WhatsApp Order Bill
            </button>

            <p className="text-[10px] text-[#64748B] text-center leading-normal">
              Direct checkout manifest sent to SRM Fish Farm live desk (+91 83007 38588).
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
