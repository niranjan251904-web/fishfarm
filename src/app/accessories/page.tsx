import CollectionCampaignPage, { generateMetadata as getCollectionMetadata } from "@/app/collections/[slug]/page";

export async function generateMetadata() {
  return getCollectionMetadata({ params: { slug: "accessories" } });
}

export default async function AccessoriesPage() {
  return CollectionCampaignPage({ params: { slug: "accessories" } });
}
