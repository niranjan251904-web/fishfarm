import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Exact user-specified Premium Aquatic Brand Palette:
        hs: {
          navy: "#123B5D",
          ocean: "#2878A5",
          brown: "#654321",
          sand: "#A67C52",
          cream: "#F5F3EE",
          charcoal: "#171717",
          ice: "#E6F4FF",
          // Utility mappings:
          blue: "#2878A5",
          lightBlue: "#E6F4FF",
          border: "#E2E8F0",
          dark: "#123B5D",
          darkest: "#171717",
          black: "#171717",
          white: "#FFFFFF",
          muted: "#64748B",
        },
        brand: {
          navy: "#123B5D",
          ocean: "#2878A5",
          brown: "#654321",
          sand: "#A67C52",
          cream: "#F5F3EE",
          charcoal: "#171717",
          ice: "#E6F4FF",
          blue: "#2878A5",
          light: "#E6F4FF",
          dark: "#123B5D",
          darkest: "#171717",
          border: "#E2E8F0",
          muted: "#64748B",
        },
      },
      fontFamily: {
        sans: ["'General Sans'", "system-ui", "-apple-system", "sans-serif"],
        heading: ["'General Sans'", "system-ui", "-apple-system", "sans-serif"],
        serif: ["'General Sans'", "system-ui", "-apple-system", "sans-serif"],
        display: ["'General Sans'", "system-ui", "-apple-system", "sans-serif"],
        'General_Sans': ["'General Sans'", "sans-serif"],
      },
      fontWeight: {
        normal: '400',
        book: '450',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
      boxShadow: {
        'subtle': '0 1px 3px rgba(15, 23, 42, 0.05)',
        'elevated': '0 8px 24px rgba(15, 23, 42, 0.08)',
        'floating': '0 16px 36px rgba(15, 23, 42, 0.12)',
      },
    },
  },
  plugins: [],
};
export default config;
