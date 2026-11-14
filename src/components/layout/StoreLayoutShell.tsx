"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { CartDrawer } from "../cart/CartDrawer";
import { FloatingWhatsApp } from "../common/FloatingWhatsApp";

interface StoreLayoutShellProps {
  children: React.ReactNode;
}

export function StoreLayoutShell({ children }: StoreLayoutShellProps) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  // Completely isolated Admin Portal layout - no customer navbar, footer, cart, or floating WhatsApp
  if (isAdmin) {
    return <div className="min-h-screen bg-[#F8FAFC] flex flex-col">{children}</div>;
  }

  // Customer / User Storefront layout
  return (
    <>
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
      <CartDrawer />
      <FloatingWhatsApp />
    </>
  );
}

