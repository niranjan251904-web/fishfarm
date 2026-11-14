import CollectionCampaignPage, { generateMetadata as getCollectionMetadata } from "@/app/collections/[slug]/page";

export async function generateMetadata() {
  return getCollectionMetadata({ params: { slug: "fish-food" } });
}

export default async function FishFoodPage() {
  return CollectionCampaignPage({ params: { slug: "fish-food" } });
}
