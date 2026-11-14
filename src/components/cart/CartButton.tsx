"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";

export function CartButton() {
  const { totalItems, openCart } = useCart();

  return (
    <button
      type="button"
      onClick={openCart}
      aria-label={`Open shopping cart with ${totalItems} items`}
      className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[#171717] hover:text-[#2878A5] transition-colors"
    >
      <ShoppingBag className="w-3.5 h-3.5" />
      <span>Cart</span>
      {totalItems > 0 && (
        <span className="ml-0.5 px-1.5 py-0.2 bg-[#2878A5] text-white text-[10px] font-bold rounded-full">
          {totalItems}
        </span>
      )}
    </button>
  );
}
