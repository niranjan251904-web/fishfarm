import { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Terms of Service | ${siteConfig.name}`,
  description:
    "Official terms and conditions governing live ornamental fish orders, train and bus parcel dispatches, live arrival guarantee conditions, and acclimation protocols.",
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-white py-10 sm:py-16 text-[#020617]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[#64748B] mb-8 uppercase tracking-wider">
          <Link href="/" className="hover:text-[#020617] transition-colors">
            HOME
          </Link>
          <span>&gt;</span>
          <span className="text-[#0055FF] font-semibold">TERMS OF SERVICE</span>
        </nav>

        {/* Header */}
        <header className="border-b border-[#E2E8F0] pb-8 mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0055FF] mb-3">
            LEGAL AGREEMENT & DISPATCH PROTOCOL
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#020617] mb-4">
            Terms of Service
          </h1>
          <p className="text-sm text-[#64748B] max-w-2xl leading-relaxed">
            These terms govern the procurement, quarantine, handling, and pan-India logistics of live biological specimens provided by {siteConfig.legalName}.
          </p>
        </header>

        {/* Content sections */}
        <article className="space-y-8 text-sm leading-relaxed text-[#020617]/85">
          <section className="bg-white border border-[#E2E8F0] p-6 sm:p-8 rounded-none sm:rounded-[2px] shadow-xs">
            <h2 className="text-xl font-bold text-[#020617] mb-3">
              1. Nature of Live Biological Specimens
            </h2>
            <p className="mb-3 text-[#64748B]">
              All specimens offered in this catalogue are live freshwater animals acclimated and quarantined at our aquaculture facility. Because each organism is a unique living specimen, subtle variations in pigmentation intensity, pattern distribution, and exact measurements are inherent and natural.
            </p>
            <p className="text-[#64748B]">
              Catalog photographs display mature or representative individuals from the quarantined batch under balanced aquatic illumination.
            </p>
          </section>

          <section className="bg-white border border-[#E2E8F0] p-6 sm:p-8 rounded-none sm:rounded-[2px] shadow-xs">
            <h2 className="text-xl font-bold text-[#020617] mb-3">
              2. Strict 14-Day Quarantine Standards
            </h2>
            <p className="mb-3 text-[#64748B]">
              Prior to clearance for customer shipment, every incoming specimen undergoes a mandatory 14-day prophylactic holding sequence. This protocol includes observation for external parasites, internal deworming via medicated feed or immersion baths, and verification of vigorous feeding behavior.
            </p>
            <p className="text-[#64748B]">
              We reserve the right to temporarily pause or reschedule dispatch if our chief aquarist notes any behavioural anomaly or temporary stress during final pre-transit inspection.
            </p>
          </section>

          <section className="bg-white border border-[#E2E8F0] p-6 sm:p-8 rounded-none sm:rounded-[2px] shadow-xs">
            <h2 className="text-xl font-bold text-[#020617] mb-3">
              3. Live Arrival Guarantee (DOA) Protocol
            </h2>
            <p className="mb-3 text-[#64748B]">
              We provide a 100% Live Arrival Guarantee (DOA) on all train and bus consignments when the recipient adheres to the following verification procedure:
            </p>
            <div className="space-y-2 border-l-2 border-[#0055FF] pl-4 my-4">
              <p className="font-semibold text-[#020617]">
                Requirement A: Unbroken Unboxing Video
              </p>
              <p className="text-xs text-[#64748B]">
                A continuous, unedited video recording showing the sealed courier shipping label, the outer EPS foam container being opened, and the fish bags prior to opening.
              </p>
              <p className="font-semibold text-[#020617] mt-3">
                Requirement B: 2-Hour Timeframe
              </p>
              <p className="text-xs text-[#64748B]">
                Notification and unboxing documentation must be submitted via our official WhatsApp line (+91 80981 47347) within exactly 2 hours of arrival.
              </p>
            </div>
            <p className="text-[#64748B]">
              Upon verification of Dead-On-Arrival (DOA), we will issue a store credit or dispatch a replacement specimen in the subsequent scheduled consignment.
            </p>
          </section>

          <section className="bg-white border border-[#E2E8F0] p-6 sm:p-8 rounded-none sm:rounded-[2px] shadow-xs">
            <h2 className="text-xl font-bold text-[#020617] mb-3">
              4. Packaging & Dispatch Logistics
            </h2>
            <p className="mb-3 text-[#64748B]">
              Specimens are packaged in heavy-gauge polyethylene bags charged with pure industrial medical oxygen. Bags are insulated within high-density expanded polystyrene (EPS) boxes with custom temperature buffers.
            </p>
            <p className="text-[#64748B]">
              Consignments are dispatched via express train or bus parcel networks across India within 48 hours of order confirmation.
            </p>
          </section>
        </article>

        {/* Footer contact link */}
        <div className="mt-12 pt-6 border-t border-[#E2E8F0] flex items-center justify-between text-xs text-[#64748B]">
          <span>{siteConfig.legalName}</span>
          <Link href="/contact" className="text-[#0055FF] font-semibold hover:underline">
            Contact Support Desk &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
