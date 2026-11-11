"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, CustomerOrderAudit } from "@/types";
import { siteConfig, buildWhatsAppUrl, formatCurrency } from "@/config/site";
import { trackWhatsAppEnquiry } from "@/lib/analytics";
import { saveOrderAudit } from "@/lib/db";

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CustomerDetails {
  name: string;
  phone?: string;
  city: string;
  state: string;
  pinCode: string;
  notes?: string;
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  generateWhatsAppBillUrl: (customer: CustomerDetails) => string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "aura_aquatics_cart_v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from local storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load cart from storage", e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save cart to local storage
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error("Failed to save cart to storage", e);
    }
  }, [items, isInitialized]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen((prev) => !prev);

  const addToCart = (product: Product, quantity = 1) => {
    if (product.availability === "out_of_stock") return;

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) => item.product.productId === product.productId
      );

      if (existingIndex > -1) {
        const next = [...prevItems];
        next[existingIndex].quantity += quantity;
        return next;
      } else {
        return [...prevItems, { product, quantity }];
      }
    });

    setIsOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.product.productId === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.sellingPrice * item.quantity,
    0
  );

  /**
   * Formats the entire cart into a luxury, structured WhatsApp invoice/bill
   */
  const generateWhatsAppBillUrl = (customer: CustomerDetails): string => {
    const orderNumber = `AA-${Date.now().toString().slice(-6)}`;
    const dateFormatted = new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    let billText = `━━━━━━━━━━━━━━━━━━━━━\n`;
    billText += `*HS AQUATICS · ORDER BILL*\n`;
    billText += `━━━━━━━━━━━━━━━━━━━━━\n`;
    billText += `*Invoice No:* #${orderNumber}\n`;
    billText += `*Date:* ${dateFormatted}\n\n`;

    billText += `*CUSTOMER DETAILS:*\n`;
    billText += `• *Name:* ${customer.name || "Aquarium Enthusiast"}\n`;
    if (customer.phone) {
      billText += `• *Phone:* ${customer.phone}\n`;
    }
    billText += `• *Destination:* ${customer.city || "City"}, ${customer.state || "India"}\n`;
    billText += `• *PIN Code:* ${customer.pinCode || "Not Provided"}\n`;
    if (customer.notes) {
      billText += `• *Notes:* ${customer.notes}\n`;
    }
    billText += `\n`;

    billText += `*ORDERED SPECIES:* \n`;
    billText += `─────────────────────\n`;

    items.forEach((item, index) => {
      const itemTotal = item.product.sellingPrice * item.quantity;
      billText += `${index + 1}. *${item.product.name}*\n`;
      if (item.product.scientificName) {
        billText += `   _${item.product.scientificName}_\n`;
      }
      billText += `   • Size: ${item.product.size}\n`;
      billText += `   • Qty: ${item.quantity} × ${formatCurrency(item.product.sellingPrice)} = *${formatCurrency(itemTotal)}*\n`;
      if (index < items.length - 1) {
        billText += `\n`;
      }
    });

    billText += `─────────────────────\n\n`;

    billText += `*BILLING BREAKDOWN:*\n`;
    billText += `• *Items Subtotal:* ${formatCurrency(subtotal)}\n`;
    billText += `• *Thermal EPS Boxing:* FREE (Included)\n`;
    billText += `• *Pure Medical Oxygen:* FREE (Included)\n`;
    billText += `• *Air Cargo Freight:* To be calculated for PIN ${customer.pinCode || "provided"}\n`;
    billText += `─────────────────────\n`;
    billText += `*ESTIMATED TOTAL:* *${formatCurrency(subtotal)}* (+ Freight)\n`;
    billText += `─────────────────────\n\n`;

    billText += `*GUARANTEE INCLUDED:*\n`;
    billText += `• 14-Day Veterinary Quarantined & Dewormed\n`;
    billText += `• 100% Live Arrival Guarantee\n\n`;

    billText += `*NEXT STEP:*\n`;
    billText += `Please verify live batch availability, share specimen videos, and confirm total dispatch amount to my pin code.\n`;
    billText += `━━━━━━━━━━━━━━━━━━━━━`;

    trackWhatsAppEnquiry("product_details", `Cart Order #${orderNumber}`, subtotal);

    // Automatically audit this inquiry for the admin dashboard
    const auditRecord: CustomerOrderAudit = {
      id: "audit-" + Date.now(),
      orderNumber,
      customerName: customer.name || "Customer",
      phone: customer.phone,
      city: customer.city,
      state: customer.state,
      pinCode: customer.pinCode,
      notes: customer.notes,
      items: items.map((i) => ({
        productId: i.product.productId,
        name: i.product.name,
        price: i.product.sellingPrice,
        quantity: i.quantity,
      })),
      totalAmount: subtotal,
      createdAt: new Date().toISOString(),
      status: "Inquiry Sent",
    };
    saveOrderAudit(auditRecord).catch((err) =>
      console.warn("Could not log order audit:", err)
    );

    return buildWhatsAppUrl(billText, {
      source: "cart_checkout",
      campaign: "whatsapp_billing",
    });
  };

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        openCart,
        closeCart,
        toggleCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        generateWhatsAppBillUrl,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
