import { MetadataRoute } from "next";
import { getProducts, getCategories } from "@/lib/db";
import { siteConfig } from "@/config/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();
  const categories = await getCategories();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${siteConfig.url}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${siteConfig.url}/fish`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...categories.map((c) => ({
      url: `${siteConfig.url}/fish?category=${c.slug}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.85,
    })),
    {
      url: `${siteConfig.url}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteConfig.url}/gallery`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${siteConfig.url}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/cart`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${siteConfig.url}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${siteConfig.url}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];

  // Campaign Landing Pages
  const campaignPages: MetadataRoute.Sitemap = siteConfig.campaignCollections.map((c) => ({
    url: `${siteConfig.url}/collections/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  // Individual Fish Pages
  const productPages: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${siteConfig.url}/fish/${product.slug}`,
    lastModified: new Date(product.updatedAt || new Date()),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticPages, ...campaignPages, ...productPages];
}
