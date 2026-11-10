export function FishGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="bg-white border border-[#E2E8F0] rounded-none sm:rounded-[2px] overflow-hidden flex flex-col"
        >
          {/* Image skeleton */}
          <div className="aspect-square w-full bg-gray-100 animate-pulse relative">
            <div className="absolute top-2 left-2 w-12 h-3.5 bg-gray-200 rounded-[1px]" />
          </div>

          {/* Details skeleton */}
          <div className="p-3 flex-1 flex flex-col justify-between space-y-3">
            <div className="space-y-1.5">
              <div className="w-4/5 h-4 bg-gray-200 rounded-[1px] animate-pulse" />
              <div className="w-1/2 h-3 bg-gray-100 rounded-[1px] animate-pulse" />
            </div>

            <div className="pt-2 flex items-baseline gap-2">
              <div className="w-16 h-3 bg-gray-100 rounded-[1px] animate-pulse" />
              <div className="w-20 h-4 bg-gray-200 rounded-[1px] animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
