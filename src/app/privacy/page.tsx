import { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Privacy Policy | ${siteConfig.name}`,
  description:
    "Official privacy policy governing customer data, courier dispatch information, WhatsApp inquiries, and payment records.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white py-10 sm:py-16 text-[#020617]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[#64748B] mb-8 uppercase tracking-wider">
          <Link href="/" className="hover:text-[#020617] transition-colors">
            HOME
          </Link>
          <span>&gt;</span>
          <span className="text-[#0055FF] font-semibold">PRIVACY POLICY</span>
        </nav>

        {/* Header */}
        <header className="border-b border-[#E2E8F0] pb-8 mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0055FF] mb-3">
            DATA PROTECTION & DISPATCH INTEGRITY
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#020617] mb-4">
            Privacy Policy
          </h1>
          <p className="text-sm text-[#64748B] max-w-2xl leading-relaxed">
            This policy outlines how {siteConfig.legalName} collects, protects, and handles personal data submitted through our website and WhatsApp communication channels.
          </p>
        </header>

        {/* Policy Sections */}
        <article className="space-y-8 text-sm leading-relaxed text-[#020617]/85">
          <section className="bg-white border border-[#E2E8F0] p-6 sm:p-8 rounded-none sm:rounded-[2px] shadow-xs">
            <h2 className="text-xl font-bold text-[#020617] mb-3">
              1. Information We Collect
            </h2>
            <p className="mb-3 text-[#64748B]">
              To arrange live biological specimen freight and legal logistics documentation, we collect only necessary logistical identifiers:
            </p>
            <div className="space-y-2 border-l-2 border-[#0055FF] pl-4 my-3 text-xs text-[#64748B]">
              <p>
                <strong className="text-[#020617]">Logistical Details:</strong> Full legal consignee name, destination postal PIN code, and contact phone number.
              </p>
              <p>
                <strong className="text-[#020617]">Order Specifications:</strong> Species items, preferred dispatch dates, and tank water parameter consultations requested over WhatsApp.
              </p>
              <p>
                <strong className="text-[#020617]">Verification Media:</strong> Unboxing videos submitted for the Live Arrival Guarantee (DOA) claims.
              </p>
            </div>
          </section>

          <section className="bg-white border border-[#E2E8F0] p-6 sm:p-8 rounded-none sm:rounded-[2px] shadow-xs">
            <h2 className="text-xl font-bold text-[#020617] mb-3">
              2. Use of Information
            </h2>
            <p className="mb-3 text-[#64748B]">
              Personal information is used solely for the following operational tasks:
            </p>
            <div className="space-y-1.5 text-xs text-[#64748B] my-2">
              <p>• Generating train and bus parcel transport manifests.</p>
              <p>• Communicating dispatch schedules and parcel tracking waybills via WhatsApp.</p>
              <p>• Processing Live Arrival Guarantee DOA replacements and credit notes.</p>
            </div>
            <p className="mt-3 text-[#64748B]">
              We never sell, lease, or monetize customer data to third-party advertising brokers.
            </p>
          </section>

          <section className="bg-white border border-[#E2E8F0] p-6 sm:p-8 rounded-none sm:rounded-[2px] shadow-xs">
            <h2 className="text-xl font-bold text-[#020617] mb-3">
              3. WhatsApp Communications
            </h2>
            <p className="text-[#64748B]">
              When you initiate an inquiry through our verified WhatsApp concierge (+91 80981 47347), your phone number and chat transcripts are retained securely to maintain continuity of care for your aquatic livestock, facilitate quarantine health reports, and preserve DOA proof documentation.
            </p>
          </section>
        </article>

        {/* Footer contact link */}
        <div className="mt-12 pt-6 border-t border-[#E2E8F0] flex items-center justify-between text-xs text-[#64748B]">
          <span>{siteConfig.legalName}</span>
          <Link href="/terms" className="text-[#0055FF] font-semibold hover:underline">
            View Terms of Service &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
