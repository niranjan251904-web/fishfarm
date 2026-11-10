import Link from "next/link";
import Image from "next/image";
import { Category } from "@/types";

interface FeaturedCategoriesProps {
  categories: Category[];
}

export function FeaturedCategories({ categories }: FeaturedCategoriesProps) {
  // Exclude 'all' from display grid
  const displayCategories = categories.filter((c) => c.slug !== "all");

  return (
    <section className="py-16 sm:py-20 bg-gray-50/50 border-b border-gray-100 text-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-gray-200">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#0052FF] block mb-1">
              Aquatic Categories
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              Curated Collections
            </h2>
          </div>
          <Link
            href="/fish"
            className="mt-3 sm:mt-0 text-xs font-semibold text-[#0052FF] uppercase tracking-wider hover:underline"
          >
            Explore Complete Collection &rarr;
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayCategories.map((category) => (
            <Link
              key={category.categoryId}
              href={`/fish?category=${category.slug}`}
              className="group bg-white rounded-none sm:rounded-sm border border-gray-200 hover:border-[#0052FF] transition-all flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-md"
            >
              {/* Category Image */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Card Meta Content */}
              <div className="p-5 flex-grow flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#0052FF] transition-colors mb-1">
                    {category.name}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                    {category.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                  <span>Quarantined Stock</span>
                  <span className="font-semibold text-[#0052FF] group-hover:underline">
                    View Species &rarr;
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
