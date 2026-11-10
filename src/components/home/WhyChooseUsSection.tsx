export function WhyChooseUsSection() {
  const protocols = [
    {
      step: "Protocol 01",
      title: "14-Day Prophylactic Hold",
      description:
        "Every batch is segregated in dedicated hospital systems and screened for external parasites and protozoa prior to dispatch clearance.",
    },
    {
      step: "Protocol 02",
      title: "Pure Industrial Oxygen",
      description:
        "Packed in double-walled virgin polyethylene charged with 100% pure compressed medical oxygen to sustain water saturation for up to 48 hours.",
    },
    {
      step: "Protocol 03",
      title: "Thermal EPS Insulation",
      description:
        "High-density expanded polystyrene boxing fitted with calibrated phase-change heat or cooling packs matched to ambient flight temperatures.",
    },
    {
      step: "Protocol 04",
      title: "Live Arrival Guarantee",
      description:
        "Guaranteed live delivery on all direct air cargo flights with replacement or credit coverage upon 2-hour unboxing documentation.",
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-[#FAF8F3] border-b border-[#DFD8C8] text-[#14241B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12">
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9C6A28] block mb-1">
            Biosecurity Standards
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#14241B]">
            Four Core Aquaculture Protocols
          </h2>
          <p className="text-xs sm:text-sm text-[#5D6B60] mt-2 leading-relaxed">
            Eliminating transit uncertainties and parasite introduction through strict holding cycles and medical packaging standards.
          </p>
        </div>

        {/* 4-Column Architectural Grid with 1px borders */}
        <div className="border border-[#DFD8C8] rounded-md overflow-hidden grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-[#DFD8C8]">
          {protocols.map((p, idx) => (
            <div
              key={idx}
              className="bg-[#FAF8F3] p-6 sm:p-7 flex flex-col justify-between space-y-4"
            >
              <div>
                <span className="text-[10px] font-semibold tracking-wider uppercase text-[#9C6A28] block mb-2 font-mono">
                  {p.step}
                </span>
                <h3 className="font-serif text-lg font-bold text-[#14241B] mb-2 leading-snug">
                  {p.title}
                </h3>
                <p className="text-xs text-[#404E44] leading-relaxed">
                  {p.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[#EAE4D7] text-[10px] uppercase tracking-wider text-[#6D7B71] font-semibold">
                Verified Benchmark
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
