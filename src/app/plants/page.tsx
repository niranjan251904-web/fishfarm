import CollectionCampaignPage, { generateMetadata as getCollectionMetadata } from "@/app/collections/[slug]/page";

export async function generateMetadata() {
  return getCollectionMetadata({ params: { slug: "plants" } });
}

export default async function PlantsPage() {
  return CollectionCampaignPage({ params: { slug: "plants" } });
}
