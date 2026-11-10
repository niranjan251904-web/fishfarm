import { redirect } from "next/navigation";
import { getProducts } from "@/lib/db";

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export default function ProductsRedirectPage({ params }: PageProps) {
  redirect(`/fish/${params.slug}`);
}

