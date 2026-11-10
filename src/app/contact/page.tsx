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
    const formattedMessage = `Hello HS Aquatics! My name is ${formData.name || "Aquarist"} from ${formData.city || "India"} (PIN: ${formData.pinCode || "N/A"}). Tank: ${formData.tankVolume || "Planted Aquarium"}. Inquiry: ${formData.message || "I would like to inquire about current stock and dispatch."}`;
    
    trackWhatsAppEnquiry("hero_cta", "Contact Form");
    window.open(buildWhatsAppUrl(formattedMessage, { source: "contact_form" }), "_blank");
  };

  return (
    <div className="min-h-screen bg-white py-10 sm:py-16 text-[#020617]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-medium text-[#64748B] mb-8 uppercase tracking-wider">
          <Link href="/" className="hover:text-[#020617] transition-colors">
            HOME
          </Link>
          <span>&gt;</span>
          <span className="text-[#0055FF] font-semibold">CONTACT & DISPATCH DESK</span>
        </nav>

        {/* Header Hero */}
        <div className="max-w-3xl mb-12">
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#0055FF] block mb-1">
            DISPATCH COORDINATION
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold text-[#020617] mb-3">
            Aquaculture Dispatch & Concierge Desk
          </h1>
          <p className="text-sm sm:text-base text-[#64748B] leading-relaxed">
            Inquire about upcoming holding batch clearances, verify postal pin code transit coverage, or consult on tank parameter matching.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Quick Information & WhatsApp Direct (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* WhatsApp Priority Card */}
            <div className="bg-[#020617] text-white p-6 sm:p-8 rounded-none sm:rounded-[2px] border border-[#0F172A] space-y-4 shadow-sm">
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#0055FF] block">
                PRIMARY COMMUNICATION CHANNEL
              </span>

              <h2 className="text-2xl font-bold text-white">
                Direct WhatsApp Helpline
              </h2>

              <p className="text-xs sm:text-sm text-[#E2E8F0] leading-relaxed">
                Connect directly with our facility biologists for uncompressed specimen videos, tank volume sizing, and water chemistry audits.
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
                  <span>Chat on WhatsApp: {siteConfig.whatsapp.displayNumber}</span>
                </a>
              </div>

              <div className="pt-4 border-t border-[#0F172A] text-xs text-[#64748B]">
                Active 7 days a week: 9:00 AM – 7:30 PM IST
              </div>
            </div>

            {/* Logistics Assurance Card */}
            <div className="p-6 bg-gray-50 rounded-none sm:rounded-[2px] border border-[#E2E8F0] space-y-3.5 text-xs text-[#020617]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#0055FF]" />
                <h4 className="font-semibold text-xs uppercase tracking-wider text-[#020617]">
                  Transit Assurance Standards
                </h4>
              </div>
              <ul className="space-y-2 text-[#64748B]">
                <li>• 100% Live Arrival Guarantee (DOA) on train and bus consignments.</li>
                <li>• Pure medical oxygen injected double-gauge poly-bags.</li>
                <li>• High-density expanded polystyrene thermal containers.</li>
                <li>• Parcel tracking & waybill photos shared via WhatsApp.</li>
              </ul>
            </div>
          </div>

          {/* Right Column: Contact Inquiry Form (7 Cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white p-6 sm:p-8 rounded-none sm:rounded-[2px] border border-[#E2E8F0] shadow-xs">
              <h3 className="text-xl font-bold text-[#020617] mb-1">
                Consult With Our Specialists
              </h3>
              <p className="text-xs text-[#64748B] mb-6">
                Fill out the details below to generate an instant inquiry manifest on WhatsApp.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-[#020617] block mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Arun Kumar"
                      className="w-full px-3 py-2 text-xs bg-gray-50 border border-[#E2E8F0] rounded-sm text-[#020617] focus:outline-none focus:border-[#0055FF]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-[#020617] block mb-1">
                      City / State *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="e.g. Coimbatore, Tamil Nadu"
                      className="w-full px-3 py-2 text-xs bg-gray-50 border border-[#E2E8F0] rounded-sm text-[#020617] focus:outline-none focus:border-[#0055FF]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-[#020617] block mb-1">
                      Postal PIN Code *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.pinCode}
                      onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })}
                      placeholder="e.g. 641001"
                      className="w-full px-3 py-2 text-xs bg-gray-50 border border-[#E2E8F0] rounded-sm text-[#020617] focus:outline-none focus:border-[#0055FF]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-[#020617] block mb-1">
                      Tank Size / Setup Type
                    </label>
                    <input
                      type="text"
                      value={formData.tankVolume}
                      onChange={(e) => setFormData({ ...formData, tankVolume: e.target.value })}
                      placeholder="e.g. 150 Litre Planted"
                      className="w-full px-3 py-2 text-xs bg-gray-50 border border-[#E2E8F0] rounded-sm text-[#020617] focus:outline-none focus:border-[#0055FF]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-[#020617] block mb-1">
                    Species of Interest / Inquiries
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="e.g. Inquiring about current Panda Garra lot availability, water parameters, and train parcel dispatch schedule."
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-[#E2E8F0] rounded-sm text-[#020617] focus:outline-none focus:border-[#0055FF]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-[#0055FF] hover:bg-[#0041CC] text-white text-xs font-semibold uppercase tracking-wider rounded-sm transition-colors text-center shadow-xs"
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
