import CollectionCampaignPage, { generateMetadata as getCollectionMetadata } from "@/app/collections/[slug]/page";

export async function generateMetadata() {
  return getCollectionMetadata({ params: { slug: "aquarium-plants" } });
}

export default async function AquariumPlantsPage() {
  return CollectionCampaignPage({ params: { slug: "aquarium-plants" } });
}
