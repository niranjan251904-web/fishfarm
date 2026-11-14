import Link from "next/link";

interface BrandLogoProps {
  variant?: "dark" | "light" | "footer";
  className?: string;
}

export function BrandLogo({ variant = "dark", className = "" }: BrandLogoProps) {
  const isLight = variant === "light";

  return (
    <Link href="/" className={`inline-flex items-center gap-2 group ${className}`}>
      <div className="flex flex-col items-center leading-none">
        <span
          className={`font-sans text-2xl font-black tracking-tight ${
            isLight ? "text-white" : "text-[#0A1A2F]"
          }`}
        >
          SRM
        </span>
        <span
          className={`text-[8px] font-bold tracking-[0.25em] uppercase -mt-0.5 ${
            isLight ? "text-gray-300" : "text-[#0A1A2F]"
          }`}
        >
          Fish Farm
        </span>
        {/* Blue wave accent */}
        <svg
          viewBox="0 0 40 6"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-8 h-1.5 mt-0.5 text-[#0055FF]"
        >
          <path
            d="M1 3C4 1 7 5 10 3C13 1 16 5 19 3C22 1 25 5 28 3C31 1 34 5 37 3"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </Link>
  );
}
