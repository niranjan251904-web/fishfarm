import Link from "next/link";
import { BrandLogo } from "../common/BrandLogo";
import { siteConfig, buildWhatsAppUrl } from "@/config/site";

export function Footer() {
  return (
    <footer className="bg-[#123B5D] text-[#E2E8F0] pt-14 pb-12 border-t border-[#123B5D]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Logistics and Biosecurity Header Bar */}
        <div className="pb-10 border-b border-white/10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-baseline">
          <div className="lg:col-span-4">
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#A67C52] font-semibold block mb-1">
              Aquaculture Protocol
            </span>
            <p className="text-lg font-bold text-white">
              Fourteen-Day Prophylactic Quarantine
            </p>
          </div>
          <div className="lg:col-span-8 text-xs text-slate-300 leading-relaxed">
            All livestock is held in segregated holding systems under therapeutic observation. Consignments are packed in high-density expanded polystyrene containers with pure industrial medical oxygen and transit climate buffers before train, bus, and flight cargo dispatch across India.
          </div>
        </div>

        {/* Main Footer Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-12">
          {/* Col 1 & 2: Brand Information */}
          <div className="lg:col-span-2 space-y-4">
            <BrandLogo variant="light" />
            <p className="text-xs sm:text-sm text-slate-300 max-w-sm leading-relaxed mt-2">
              SRM Fish Farm, managed by R. Sankar in Palamedu, Madurai. 2 years of farm fish breeding excellence, wholesale supply, specialized aquascaping, and nature aquarium maintenance.
            </p>
            <div className="pt-2">
              <a
                href={buildWhatsAppUrl(siteConfig.whatsapp.defaultMessage, {
                  source: "footer",
                })}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 py-2 bg-[#171717] text-white text-xs font-semibold rounded-[2px] border border-white/10 hover:bg-[#2878A5] hover:border-[#2878A5] transition-colors"
              >
                WhatsApp: {siteConfig.whatsapp.displayNumber}
              </a>
            </div>
          </div>

          {/* Col 3: Species Collections */}
          <div>
            <h5 className="text-sm font-bold text-white tracking-wider uppercase mb-4">
              Fish Collections
            </h5>
            <ul className="space-y-2.5 text-xs text-[#64748B]">
              <li>
                <Link href="/fish?category=angelfish" className="hover:text-white transition-colors">
                  Angelfish & Altums
                </Link>
              </li>
              <li>
                <Link href="/fish?category=algae-eaters" className="hover:text-white transition-colors">
                  Algae Cleaners & Otos
                </Link>
              </li>
              <li>
                <Link href="/fish?category=betta-fish" className="hover:text-white transition-colors">
                  Show Plakat Bettas
                </Link>
              </li>
              <li>
                <Link href="/fish?category=catfish" className="hover:text-white transition-colors">
                  Plecos & Catfish
                </Link>
              </li>
              <li>
                <Link href="/fish?category=barbs" className="hover:text-white transition-colors">
                  Schooling Fish & Barbs
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Policies & Dispatch */}
          <div>
            <h5 className="text-sm font-bold text-white tracking-wider uppercase mb-4">
              Policies & Dispatch
            </h5>
            <ul className="space-y-2.5 text-xs text-[#64748B]">
              <li>
                <Link href="/fish" className="hover:text-white transition-colors">
                  Fish Catalogue
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  Quarantine Protocols
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Train & Bus Dispatch
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Facility & Hours */}
          <div>
            <h5 className="text-sm font-bold text-white tracking-wider uppercase mb-4">
              Farm Location & Hours
            </h5>
            <div className="space-y-2.5 text-xs text-[#64748B]">
              <p className="text-white font-medium">17, Sellaji Amman (Kovil) Street, Palamedu, Madurai – 625503</p>
              <p>Proprietor: R. Sankar</p>
              <p>Operating Hours: All Days: 9:00 AM – 4:00 PM</p>
              <p>Services: Wholesale · Fish Breeding · Aquascaping & Maintenance</p>
              <p className="text-[#2878A5] font-semibold text-sm">+91 83007 38588</p>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Legal Links */}
        <div className="pt-8 mt-4 border-t border-white/10 text-xs text-[#E6F4FF]/70 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
          <div className="flex items-center space-x-6 text-xs text-[#E6F4FF]/70">
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/admin" className="hover:text-white transition-colors">
              Staff Portal
            </Link>
            <span>•</span>
            <span>DOA Live Arrival Guarantee</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
