import Image from "next/image";
import Link from "next/link";

export function AboutSanctuary() {
  return (
    <section className="py-16 sm:py-24 bg-[#FAF8F3] border-b border-[#DFD8C8] text-[#14241B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Specimen Imagery Composition (5 Cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/5] rounded-md overflow-hidden border border-[#DFD8C8] bg-[#ECE7DC]">
              <Image
                src="/images/fish/angels-jet-black.webp"
                alt="Quarantined Jet Black Angel"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
            </div>

            {/* Inset Specimen Detail */}
            <div className="p-4 bg-[#ECE7DC] border border-[#DFD8C8] rounded-sm mt-3 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#9C6A28] font-semibold block">
                  Mandatory Standard
                </span>
                <span className="font-serif font-bold text-base text-[#14241B]">
                  14-Day Clinical Quarantine
                </span>
              </div>
              <span className="text-[11px] text-[#5D6B60]">Segregated 300L Tanks</span>
            </div>
          </div>

          {/* Right Column: Editorial Copy (7 Cols) */}
          <div className="lg:col-span-7 space-y-5">
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9C6A28] block">
              Sanctuary Standards
            </span>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#14241B] leading-[1.15]">
              Bio-Secure Ornamental Aquaculture.
            </h2>

            <p className="text-sm text-[#404E44] leading-relaxed">
              Operating as a dedicated quarantine and biological conditioning facility rather than a rapid warehouse, our mission is to eliminate parasite introductions and stress mortality in home displays.
            </p>

            <p className="text-sm text-[#404E44] leading-relaxed">
              Every wild Altum, pedigree Angelfish pair, and specialist algae grazer undergoes a non-negotiable two-week holding protocol, targeted prophylactic deworming, and nutritional conditioning on live foods before clearing for transport.
            </p>

            {/* Key Pillars without checkmarks */}
            <div className="pt-2 border-t border-[#DFD8C8] grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#2C3831]">
              <div className="p-3 bg-[#ECE7DC] rounded-sm border border-[#DFD8C8]">
                <strong className="block text-[#14241B] font-semibold mb-0.5">Ethical Collection:</strong>
                <span>Zero cyanide or chemically stunned wild stock.</span>
              </div>
              <div className="p-3 bg-[#ECE7DC] rounded-sm border border-[#DFD8C8]">
                <strong className="block text-[#14241B] font-semibold mb-0.5">Therapeutic Baths:</strong>
                <span>Prophylactic praziquantel and metronidazole sequences.</span>
              </div>
              <div className="p-3 bg-[#ECE7DC] rounded-sm border border-[#DFD8C8]">
                <strong className="block text-[#14241B] font-semibold mb-0.5">Medical Oxygen:</strong>
                <span>Multi-gauge oxygenated bags with thermal EPS insulation.</span>
              </div>
              <div className="p-3 bg-[#ECE7DC] rounded-sm border border-[#DFD8C8]">
                <strong className="block text-[#14241B] font-semibold mb-0.5">Water Audits:</strong>
                <span>Direct WhatsApp consultation for aquarium parameter matching.</span>
              </div>
            </div>

            <div className="pt-3">
              <Link
                href="/about"
                className="inline-block px-5 py-2.5 rounded-sm bg-[#14241B] text-[#FAF8F3] text-xs font-semibold uppercase tracking-wider hover:bg-[#23382C] transition-colors"
              >
                Read Quarantine Protocol
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
