"use client";

import { useState, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";
import { siteConfig, buildWhatsAppUrl } from "@/config/site";
import { trackWhatsAppEnquiry } from "@/lib/analytics";

export function FloatingWhatsApp() {
  const [showTooltip, setShowTooltip] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    // Show welcoming tooltip after 3.5 seconds
    const timer = setTimeout(() => {
      if (!hasInteracted) {
        setShowTooltip(true);
      }
    }, 3500);
    return () => clearTimeout(timer);
  }, [hasInteracted]);

  const handleClick = () => {
    setHasInteracted(true);
    setShowTooltip(false);
    trackWhatsAppEnquiry("floating_cta", "Floating WhatsApp");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Speech bubble tooltip */}
      {showTooltip && (
        <div className="mb-3 p-3.5 max-w-xs bg-white text-gray-900 rounded-2xl shadow-xl border border-gray-100 relative animate-in fade-in slide-in-from-bottom-2 duration-300">
          <button
            type="button"
            onClick={() => {
              setShowTooltip(false);
              setHasInteracted(true);
            }}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 p-0.5 rounded-full"
            aria-label="Dismiss message"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-600">
              Live Aquarium Chat
            </span>
          </div>
          <p className="text-xs text-gray-700 leading-relaxed pr-3 font-normal">
            Need live specimen video clips, stock check, or water parameter advice? Chat directly with us on WhatsApp!
          </p>
          {/* Speech bubble tail */}
          <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white border-b border-r border-gray-100 rotate-45 transform" />
        </div>
      )}

      {/* Floating Action Button with pulsing halo */}
      <a
        href={buildWhatsAppUrl(siteConfig.whatsapp.defaultMessage, {
          source: "floating_button",
        })}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        aria-label="Chat with us on WhatsApp"
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-xl hover:bg-[#20bd5a] hover:scale-105 active:scale-95 transition-all duration-300"
      >
        {/* Pulsing halo animation */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-35 animate-ping group-hover:opacity-50" />
        <MessageCircle className="w-7 h-7 fill-current relative z-10 transition-transform group-hover:scale-110" />
      </a>
    </div>
  );
}
