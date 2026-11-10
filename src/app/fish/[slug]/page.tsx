import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug, getProducts, getProductsByCategory } from "@/lib/db";
import { ProductDetailView } from "@/components/fish/ProductDetailView";
import { siteConfig } from "@/config/site";

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) {
    return {
      title: `Species Not Found | ${siteConfig.name}`,
    };
  }

  const title = `${product.name} | ${siteConfig.name}`;
  const description = `${product.description.slice(0, 160)}... Quarantined ornamental ${product.categoryName}. Shipped with 100% Live Arrival Guarantee across India.`;

  return {
    title,
    description,
    openGraph: {
      title: `${product.name} | ${siteConfig.name}`,
      description,
      images: [
        {
          url: product.images[0] || "/images/fish/algae-eaters-otocinclus.jpg",
          width: 800,
          height: 600,
          alt: product.name,
        },
      ],
    },
    alternates: {
      canonical: `${siteConfig.url}/fish/${product.slug}`,
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  // Get related species in same category (excluding current)
  const categoryProducts = await getProductsByCategory(product.categoryId);
  const relatedProducts = categoryProducts.filter((p) => p.productId !== product.productId);

  // Structured Data (JSON-LD) for Google Rich Snippets
  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    image: product.images.map((img) => `${siteConfig.url}${img}`),
    description: product.description,
    sku: product.productId,
    brand: {
      "@type": "Brand",
      name: siteConfig.name,
    },
    offers: {
      "@type": "Offer",
      url: `${siteConfig.url}/fish/${product.slug}`,
      priceCurrency: "INR",
      price: product.sellingPrice,
      availability:
        product.availability === "in_stock"
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: siteConfig.legalName,
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailView product={product} relatedProducts={relatedProducts} />
    </>
  );
}
