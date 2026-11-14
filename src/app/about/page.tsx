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
    <div className="min-h-screen bg-[#F5F3EE] py-10 sm:py-16 text-[#171717]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-medium text-[#64748B] mb-8 uppercase tracking-wider">
          <Link href="/" className="hover:text-[#171717] transition-colors">
            HOME
          </Link>
          <span>&gt;</span>
          <span className="text-[#2878A5] font-semibold">ABOUT & BIOSECURITY</span>
        </nav>

        {/* Header Hero */}
        <div className="max-w-3xl mb-12">
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#2878A5] block mb-1">
            ABOUT SRM FISH FARM
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold text-[#171717] leading-[1.15]">
            2 Years of Farm-Direct Breeding Excellence in Madurai.
          </h1>
          <p className="mt-4 text-sm sm:text-base text-[#64748B] leading-relaxed">
            Founded and managed by R. Sankar at Palamedu, Madurai, SRM Fish Farm specializes in ethical fish breeding, direct wholesale supply, bespoke aquascaping, and nature aquarium maintenance. Operating 7 days a week, we deliver healthy, acclimated livestock directly from our breeding facility to hobbyists and aquarium stores across India.
          </p>
        </div>

        {/* Feature Grid with Photography */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mb-16 bg-white rounded-none sm:rounded-[2px] p-6 sm:p-10 border border-[#E2E8F0]">
          <div className="relative aspect-[4/3] rounded-[2px] overflow-hidden bg-gray-100 border border-[#E2E8F0]">
            <Image
              src="/images/fish/angels-altum-angel.webp"
              alt="Breeding and Holding Systems at SRM Fish Farm"
              fill
              className="object-cover"
            />
          </div>

          <div className="space-y-4">
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#2878A5] block">
              OUR CORE ADVANTAGE
            </span>

            <h2 className="text-2xl sm:text-3xl font-bold text-[#171717]">
              Why Choose SRM Fish Farm?
            </h2>

            <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
              Unlike third-party traders who resell unconditioned imports, SRM Fish Farm operates direct breeding tanks and comprehensive on-site maintenance services:
            </p>

            <div className="space-y-2.5 pt-2 text-xs text-[#171717]">
              <div className="p-3 bg-[#F5F3EE] rounded-sm border border-[#E2E8F0]">
                <strong className="block text-[#171717] font-semibold mb-0.5">
                  1. Direct Farm Breeding & Wholesale Rates
                </strong>
                <span className="text-[#64748B]">Healthy, captive-bred strains conditioned in natural Madurai water parameters. True wholesale rates for hobbyists and bulk commercial orders with zero middleman markup.</span>
              </div>
              <div className="p-3 bg-[#F5F3EE] rounded-sm border border-[#E2E8F0]">
                <strong className="block text-[#171717] font-semibold mb-0.5">
                  2. Professional Aquascaping & Maintenance
                </strong>
                <span className="text-[#64748B]">Personalized planted aquarium design, rockwork hardscape setup, and periodic biotope cleaning and health maintenance.</span>
              </div>
              <div className="p-3 bg-[#F5F3EE] rounded-sm border border-[#E2E8F0]">
                <strong className="block text-[#171717] font-semibold mb-0.5">
                  3. Rigorous Conditioning & 100% Live Arrival Guarantee
                </strong>
                <span className="text-[#64748B]">Every dispatch is fasted, double-oxygenated in heavy gauge poly-bags, and insulated in EPS thermal boxing for train and bus transport.</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Protocol Steps */}
        <div className="mb-16">
          <div className="max-w-2xl mb-8 pb-3 border-b border-[#E2E8F0]">
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#2878A5] block mb-1">
              LOGISTICS SEQUENCE
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-[#171717]">
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
                  <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#2878A5] block mb-2">
                    {s.step}
                  </span>
                  <h4 className="font-bold text-base text-[#171717] mb-1">
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
        <div className="bg-[#123B5D] text-white rounded-none sm:rounded-[2px] p-8 sm:p-10 border border-[#123B5D] text-center max-w-2xl mx-auto space-y-4 shadow-sm">
          <h3 className="text-2xl font-bold text-white">
            Speak Directly With Our Live Desk
          </h3>
          <p className="text-xs text-[#E6F4FF]/90 leading-relaxed max-w-md mx-auto">
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
