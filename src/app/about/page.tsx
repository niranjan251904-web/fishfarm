import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { siteConfig, buildWhatsAppUrl } from "@/config/site";

export const metadata: Metadata = {
  title: `About & Biosecurity Protocols | ${siteConfig.name}`,
  description:
    "Learn about our 14-day therapeutic quarantine, temperature-stabilized oxygen transport, and ethical ornamental fish breeding standards.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white py-10 sm:py-16 text-[#020617]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-medium text-[#64748B] mb-8 uppercase tracking-wider">
          <Link href="/" className="hover:text-[#020617] transition-colors">
            HOME
          </Link>
          <span>&gt;</span>
          <span className="text-[#0055FF] font-semibold">ABOUT & BIOSECURITY</span>
        </nav>

        {/* Header Hero */}
        <div className="max-w-3xl mb-12">
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#0055FF] block mb-1">
            FACILITY ETHOS
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold text-[#020617] leading-[1.15]">
            Clinical Biosecurity in Ornamental Aquaculture.
          </h1>
          <p className="mt-4 text-sm sm:text-base text-[#64748B] leading-relaxed">
            Operating dedicated quarantine holding systems on the Tamil Nadu coastal belt, we eliminate parasite introductions and stress mortality through structured 14-day observation and acclimatization protocols.
          </p>
        </div>

        {/* Feature Grid with Photography */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mb-16 bg-white rounded-none sm:rounded-[2px] p-6 sm:p-10 border border-[#E2E8F0]">
          <div className="relative aspect-[4/3] rounded-[2px] overflow-hidden bg-gray-100 border border-[#E2E8F0]">
            <Image
              src="/images/fish/angels-altum-angel.webp"
              alt="Quarantine Tank at HS Aquatics"
              fill
              className="object-cover"
            />
          </div>

          <div className="space-y-4">
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#0055FF] block">
              QUARANTINE REGIMEN
            </span>

            <h2 className="text-2xl sm:text-3xl font-bold text-[#020617]">
              The Fourteen-Day Clinical Standard
            </h2>

            <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
              Unlike commercial clearinghouses that re-box livestock within hours of arrival, every batch entering our facility undergoes a systematic prophylactic holding sequence:
            </p>

            <div className="space-y-2.5 pt-2 text-xs text-[#020617]">
              <div className="p-3 bg-gray-50 rounded-sm border border-[#E2E8F0]">
                <strong className="block text-[#020617] font-semibold mb-0.5">
                  1. Parasitic Prophylaxis
                </strong>
                <span className="text-[#64748B]">Targeted immersion baths for monogenean gill flukes, protozoan ciliates, and internal flagellates.</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-sm border border-[#E2E8F0]">
                <strong className="block text-[#020617] font-semibold mb-0.5">
                  2. Nutritional Conditioning
                </strong>
                <span className="text-[#64748B]">Gradual transition onto live decapsulated artemia, blackworms, and fortified micro-granules to restore vitality.</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-sm border border-[#E2E8F0]">
                <strong className="block text-[#020617] font-semibold mb-0.5">
                  3. Water Parameter Hardening
                </strong>
                <span className="text-[#64748B]">Acclimation to standard domestic aquarium parameters (TDS 140 to 220 ppm, pH 6.6 to 7.4).</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Protocol Steps */}
        <div className="mb-16">
          <div className="max-w-2xl mb-8 pb-3 border-b border-[#E2E8F0]">
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#0055FF] block mb-1">
              LOGISTICS SEQUENCE
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-[#020617]">
              Four-Stage Dispatch Protocol
            </h3>
          </div>

          <div className="border border-[#E2E8F0] rounded-none sm:rounded-[2px] overflow-hidden grid grid-cols-1 md:grid-cols-4 gap-px bg-[#E2E8F0]">
            {[
              {
                step: "Stage 01",
                title: "Pre-Transit Fasting",
                desc: "Specimens are fasted for 24 to 36 hours prior to packaging to prevent waste generation and ammonia spikes during transit.",
              },
              {
                step: "Stage 02",
                title: "Medical Grade Oxygen",
                desc: "Triple-layer virgin round-corner polyethylene bags injected with pure industrial medical oxygen sustaining dissolved levels for 48 hours.",
              },
              {
                step: "Stage 03",
                title: "Thermal EPS Boxing",
                desc: "Sealed within high-density expanded polystyrene insulation boxes fitted with temperature-stabilizing packs.",
              },
              {
                step: "Stage 04",
                title: "Train & Bus Express",
                desc: "Dispatched on verified train and bus routes across India with 100% DOA Live Arrival Guarantee protection.",
              },
            ].map((s) => (
              <div
                key={s.step}
                className="bg-white p-6 flex flex-col justify-between space-y-3"
              >
                <div>
                  <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#0055FF] block mb-2">
                    {s.step}
                  </span>
                  <h4 className="font-bold text-base text-[#020617] mb-1">
                    {s.title}
                  </h4>
                  <p className="text-xs text-[#64748B] leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to action */}
        <div className="bg-[#020617] text-white rounded-none sm:rounded-[2px] p-8 sm:p-10 border border-[#0F172A] text-center max-w-2xl mx-auto space-y-4 shadow-sm">
          <h3 className="text-2xl font-bold text-white">
            Speak Directly With Our Live Desk
          </h3>
          <p className="text-xs text-[#E2E8F0] leading-relaxed max-w-md mx-auto">
            Have questions about tank water compatibility, community stocking density, or dispatch schedules? Connect with us on WhatsApp.
          </p>
          <div className="pt-2">
            <a
              href={buildWhatsAppUrl(siteConfig.whatsapp.defaultMessage, {
                source: "about_page",
              })}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-[2px] bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current" />
              <span>Message WhatsApp Desk ({siteConfig.whatsapp.displayNumber})</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
