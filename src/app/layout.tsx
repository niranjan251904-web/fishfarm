import type { Metadata, Viewport } from "next";
import "./globals.css";
import { StoreLayoutShell } from "@/components/layout/StoreLayoutShell";
import { CartProvider } from "@/context/CartContext";
import { SettingsProvider } from "@/context/SettingsContext";
import { siteConfig } from "@/config/site";

export const viewport: Viewport = {
  themeColor: "#2878A5",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | Wholesale, Fish Breeding & Aquascaping by R. Sankar`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "SRM Fish Farm",
    "SRM Fish Farm Madurai",
    "R. Sankar fish farm",
    "fish breeding Palamedu",
    "ornamental fish wholesale",
    "aquascaping and maintenance",
    "freshwater aquarium fish",
    "angelfish wholesale India",
    "algae eaters wholesale",
    "betta fish breeding",
    "live arrival guarantee fish",
  ],
  authors: [{ name: "R. Sankar - SRM Fish Farm" }],
  creator: siteConfig.name,
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteConfig.url,
    title: `${siteConfig.name} | Premium Live Aquatic Livestock`,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: `${siteConfig.url}/images/fish/angels-altum-angel.webp`,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} Live Aquatic Livestock`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | Premium Live Aquatic Livestock`,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cdn.fontshare.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=general-sans@400,450,500,600,700&display=swap"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#F5F3EE] text-[#171717] font-sans selection:bg-[#2878A5] selection:text-white">
        <SettingsProvider>
          <CartProvider>
            <StoreLayoutShell>{children}</StoreLayoutShell>
          </CartProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
