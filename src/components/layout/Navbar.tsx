"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Menu, X } from "lucide-react";
import { BrandLogo } from "../common/BrandLogo";
import { CartButton } from "../cart/CartButton";
import { siteConfig } from "@/config/site";
import { SearchModal } from "../common/SearchModal";
import { initialProducts } from "@/data/initialData";
import { useSettings } from "@/context/SettingsContext";

export function Navbar() {
  const pathname = usePathname();
  const { settings } = useSettings();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const showBanner = settings?.topBanner?.enabled && !bannerDismissed;

  return (
    <>
      {/* Dynamic Top Announcement Bar (Configured via Admin) */}
      {showBanner && (
        <div
          style={{
            backgroundColor: settings.topBanner.bgColor || "#0055FF",
            color: settings.topBanner.textColor || "#FFFFFF",
          }}
          className="relative text-center py-2 px-4 text-xs font-semibold tracking-wider uppercase transition-all z-50 flex items-center justify-center shadow-xs"
        >
          {settings.topBanner.link ? (
            <Link
              href={settings.topBanner.link}
              className="hover:underline flex items-center gap-1.5"
            >
              <span>{settings.topBanner.text}</span>
            </Link>
          ) : (
            <span>{settings.topBanner.text}</span>
          )}

          {settings.topBanner.dismissible && (
            <button
              onClick={() => setBannerDismissed(true)}
              className="absolute right-3 p-1 opacity-80 hover:opacity-100 transition-opacity"
              aria-label="Dismiss banner"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Main Header */}
      <header className="sticky top-0 z-40 w-full bg-white border-b border-[#E2E8F0] py-3 text-[#020617] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Left: Brand Logo */}
            <BrandLogo />

            {/* Center: Desktop Navigation (Fish Collections Only) */}
            <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              {siteConfig.navLinks.map((link) => {
                const isActive =
                  pathname === link.href ||
                  (link.href !== "/" && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-xs font-semibold uppercase tracking-widest transition-colors py-1 ${
                      isActive
                        ? "text-[#0055FF]"
                        : "text-[#64748B] hover:text-[#020617]"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right: Actions (SEARCH & CART) */}
            <div className="flex items-center space-x-4 sm:space-x-6">
              {/* Search Trigger */}
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                aria-label="Search collection"
                className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[#020617] hover:text-[#0055FF] transition-colors"
              >
                <Search className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Search</span>
              </button>

              {/* Shopping Cart Trigger */}
              <div className="flex items-center">
                <CartButton />
              </div>

              {/* Mobile Menu Hamburger */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle navigation menu"
                className="lg:hidden p-1.5 text-[#020617] rounded-sm hover:bg-gray-100 transition-colors"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-[60px] z-50 lg:hidden bg-white border-t border-[#E2E8F0] flex flex-col justify-between p-6 overflow-y-auto">
          <div className="space-y-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#0055FF] mb-2">
              Fish Collections & Menu
            </p>
            <div className="flex flex-col space-y-3">
              {siteConfig.navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`text-base font-medium transition-colors py-2 border-b border-gray-100 flex items-center justify-between ${
                      isActive ? "text-[#0055FF] font-semibold" : "text-gray-900"
                    }`}
                  >
                    <span>{link.label}</span>
                    <span className="text-gray-400 text-xs">&rarr;</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="pt-6 border-t border-[#E2E8F0] space-y-3">
            <div className="text-xs text-[#64748B]">
              <p className="font-semibold text-[#020617]">HS Aquatics Live Desk</p>
              <p>WhatsApp: {siteConfig.whatsapp.displayNumber}</p>
            </div>
          </div>
        </div>
      )}

      {/* Global Live Search Modal */}
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        products={initialProducts}
      />
    </>
  );
}
