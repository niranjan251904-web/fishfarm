import { MessageCircle } from "lucide-react";
import { siteConfig, buildWhatsAppUrl } from "@/config/site";

export function WhatsAppBannerCTA() {
  return (
    <section className="py-14 sm:py-18 bg-[#020617] text-white border-t border-[#0F172A]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0055FF] block">
          AQUACULTURE CONCIERGE
        </span>

        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
          Consult With Our Specialists on WhatsApp
        </h2>

        <p className="text-xs sm:text-sm text-[#E2E8F0] max-w-xl mx-auto leading-relaxed">
          Need tank compatibility advice, acclimation steps, or current batch videos?
          Connect directly with our team on WhatsApp.
        </p>

        <div className="pt-2">
          <a
            href={buildWhatsAppUrl(siteConfig.whatsapp.defaultMessage, {
              source: "home_bottom_banner",
            })}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-[2px] bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold text-xs tracking-wider uppercase transition-colors shadow-lg"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>Chat on WhatsApp: {siteConfig.whatsapp.displayNumber}</span>
          </a>
        </div>

        <div className="pt-5 border-t border-[#0F172A] flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-[#64748B]">
          <span>DOA Guarantee on Train & Bus</span>
          <span>•</span>
          <span>Dispatch Within 48 Hours</span>
          <span>•</span>
          <span>Medical Oxygen EPS Packaging</span>
        </div>
      </div>
    </section>
  );
}
