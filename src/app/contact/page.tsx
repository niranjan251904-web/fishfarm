"use client";

import { useState } from "react";
import Link from "next/link";
import { MessageCircle, Mail, MapPin, Clock, ShieldCheck } from "lucide-react";
import { siteConfig, buildWhatsAppUrl } from "@/config/site";
import { trackWhatsAppEnquiry } from "@/lib/analytics";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    pinCode: "",
    tankVolume: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedMessage = `Hello SRM Fish Farm! My name is ${formData.name || "Aquarist"} from ${formData.city || "India"} (PIN: ${formData.pinCode || "N/A"}). Tank / Setup: ${formData.tankVolume || "Planted Aquarium"}. Inquiry: ${formData.message || "I would like to inquire about current fish stock, wholesale supply, or maintenance services."}`;
    
    trackWhatsAppEnquiry("hero_cta", "Contact Form");
    window.open(buildWhatsAppUrl(formattedMessage, { source: "contact_form" }), "_blank");
  };

  return (
    <div className="min-h-screen bg-[#F5F3EE] py-10 sm:py-16 text-[#171717]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-medium text-[#64748B] mb-8 uppercase tracking-wider">
          <Link href="/" className="hover:text-[#171717] transition-colors">
            HOME
          </Link>
          <span>&gt;</span>
          <span className="text-[#2878A5] font-semibold">CONTACT & DISPATCH DESK</span>
        </nav>

        {/* Header Hero */}
        <div className="max-w-3xl mb-12">
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#2878A5] block mb-1">
            DISPATCH COORDINATION
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold text-[#171717] mb-3">
            Aquaculture Dispatch & Concierge Desk
          </h1>
          <p className="text-sm sm:text-base text-[#64748B] leading-relaxed">
            Inquire about upcoming holding batch clearances, verify postal pin code transit coverage, or consult on tank parameter matching.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Quick Information & WhatsApp Direct (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Official Farm Profile Card */}
            <div className="p-6 bg-white rounded-none sm:rounded-[2px] border border-[#E2E8F0] space-y-4 text-xs text-[#171717] shadow-xs">
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#2878A5] block">
                BUSINESS & FARM PROFILE
              </span>
              <h2 className="text-2xl font-bold text-[#171717]">
                SRM Fish Farm
              </h2>
              <div className="space-y-3 pt-1 text-xs">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#2878A5] flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[#171717]">Farm & Facility Address</strong>
                    <span className="text-[#64748B] leading-relaxed">
                      17, Sellaji Amman (Kovil) Street, Palamedu, Madurai – 625503
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-[#2878A5] flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[#171717]">Working Days & Hours</strong>
                    <span className="text-[#64748B]">All Days: 9:00 AM – 4:00 PM</span>
                  </div>
                </div>

                <div className="p-3 bg-[#F5F3EE] border border-[#E2E8F0] rounded-xs space-y-1">
                  <p className="text-[11px] font-semibold text-[#171717]">
                    Proprietor: <span className="font-normal text-[#64748B]">R. Sankar</span>
                  </p>
                  <p className="text-[11px] font-semibold text-[#171717]">
                    Operating History: <span className="font-normal text-[#64748B]">2 Years of Breeding Excellence</span>
                  </p>
                  <p className="text-[11px] font-semibold text-[#171717]">
                    Main Services: <span className="font-normal text-[#64748B]">Wholesale, Fish Breeding, Aquascaping & Maintenance</span>
                  </p>
                </div>
              </div>
            </div>

            {/* WhatsApp Priority Card */}
            <div className="bg-[#123B5D] text-white p-6 sm:p-8 rounded-none sm:rounded-[2px] border border-[#123B5D] space-y-4 shadow-sm">
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A67C52] block">
                DIRECT OWNER & SALES HELPLINE
              </span>

              <h3 className="text-xl font-bold text-white">
                Connect With R. Sankar
              </h3>

              <p className="text-xs sm:text-sm text-[#E6F4FF]/90 leading-relaxed">
                Call or WhatsApp directly for bulk wholesale queries, farm visits, fish variety availability, and customized aquarium maintenance quotes.
              </p>

              <div className="pt-2">
                <a
                  href={buildWhatsAppUrl(siteConfig.whatsapp.defaultMessage, {
                    source: "contact_priority_box",
                  })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-[2px] bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Chat on WhatsApp: +91 83007 38588</span>
                </a>
              </div>

              <div className="pt-4 border-t border-white/10 text-xs text-[#E6F4FF]/70">
                Primary Contact: R. Sankar (83007 38588) · All Days 9:00 AM – 4:00 PM
              </div>
            </div>

            {/* Logistics Assurance Card */}
            <div className="p-6 bg-white rounded-none sm:rounded-[2px] border border-[#E2E8F0] space-y-3.5 text-xs text-[#171717]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#2878A5]" />
                <h4 className="font-semibold text-xs uppercase tracking-wider text-[#171717]">
                  Farm Assurance Standards
                </h4>
              </div>
              <ul className="space-y-2 text-[#64748B]">
                <li>• 100% Live Arrival Guarantee (DOA) on bus and train consignments.</li>
                <li>• Farm-direct pricing with genuine wholesale volume discounts.</li>
                <li>• Quarantined and biologically conditioned healthy livestock.</li>
                <li>• Complete on-site aquascaping and biotope maintenance support.</li>
              </ul>
            </div>
          </div>

          {/* Right Column: Contact Inquiry Form (7 Cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white p-6 sm:p-8 rounded-none sm:rounded-[2px] border border-[#E2E8F0] shadow-xs">
              <h3 className="text-xl font-bold text-[#171717] mb-1">
                Consult With Our Specialists
              </h3>
              <p className="text-xs text-[#64748B] mb-6">
                Fill out the details below to generate an instant inquiry manifest on WhatsApp.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-[#171717] block mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Arun Kumar"
                      className="w-full px-3 py-2 text-xs bg-white border border-[#E2E8F0] rounded-sm text-[#171717] focus:outline-none focus:border-[#2878A5]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-[#171717] block mb-1">
                      City / State *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="e.g. Coimbatore, Tamil Nadu"
                      className="w-full px-3 py-2 text-xs bg-white border border-[#E2E8F0] rounded-sm text-[#171717] focus:outline-none focus:border-[#2878A5]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-[#171717] block mb-1">
                      Postal PIN Code *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.pinCode}
                      onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })}
                      placeholder="e.g. 641001"
                      className="w-full px-3 py-2 text-xs bg-white border border-[#E2E8F0] rounded-sm text-[#171717] focus:outline-none focus:border-[#2878A5]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-[#171717] block mb-1">
                      Tank Size / Setup Type
                    </label>
                    <input
                      type="text"
                      value={formData.tankVolume}
                      onChange={(e) => setFormData({ ...formData, tankVolume: e.target.value })}
                      placeholder="e.g. 150 Litre Planted"
                      className="w-full px-3 py-2 text-xs bg-white border border-[#E2E8F0] rounded-sm text-[#171717] focus:outline-none focus:border-[#2878A5]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-[#171717] block mb-1">
                    Species of Interest / Inquiries
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="e.g. Inquiring about current Panda Garra lot availability, water parameters, and train parcel dispatch schedule."
                    className="w-full px-3 py-2 text-xs bg-white border border-[#E2E8F0] rounded-sm text-[#171717] focus:outline-none focus:border-[#2878A5]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-[#2878A5] hover:bg-[#123B5D] text-white text-xs font-semibold uppercase tracking-wider rounded-sm transition-colors text-center shadow-xs"
                >
                  Send Inquiry via WhatsApp
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
