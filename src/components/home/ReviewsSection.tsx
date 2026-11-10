import { Star, CheckCircle, Quote } from "lucide-react";
import { initialTestimonials } from "@/data/initialData";

export function ReviewsSection() {
  return (
    <section className="py-20 bg-white border-b border-ivory-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-forest-700 font-bold block mb-2">
            Verified Experiences
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest-950">
            Trusted by Connoisseurs Across India
          </h2>
          <p className="text-xs sm:text-sm text-forest-900/60 mt-2">
            Read unboxing reports from hobbyists, planted tank aquascapers, and breeders.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {initialTestimonials.map((review) => (
            <div
              key={review.id}
              className="bg-ivory-50 p-7 sm:p-8 rounded-3xl border border-ivory-300 shadow-subtle hover:shadow-elevated transition-all flex flex-col justify-between relative"
            >
              <div>
                <Quote className="w-8 h-8 text-forest-300 mb-4" />

                {/* Star rating */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>

                <p className="text-xs sm:text-sm text-forest-950/80 leading-relaxed font-light italic">
                  &ldquo;{review.comment}&rdquo;
                </p>
              </div>

              <div className="mt-6 pt-5 border-t border-ivory-200">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-serif font-bold text-forest-950 text-sm">
                    {review.author}
                  </h4>
                  {review.verifiedPurchase && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                      <CheckCircle className="w-3 h-3 text-emerald-700" />
                      <span>Verified Consignment</span>
                    </span>
                  )}
                </div>

                <div className="text-xs text-forest-700/80">
                  {review.location}
                </div>

                {review.speciesPurchased && (
                  <div className="mt-2 text-[11px] font-medium text-forest-600 bg-white p-2 rounded-xl border border-ivory-200">
                    <span className="text-forest-400 block text-[9px] uppercase tracking-wider">
                      Species Acquired
                    </span>
                    <span className="truncate block font-semibold text-forest-900">
                      {review.speciesPurchased}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
