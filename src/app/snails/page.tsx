import CollectionCampaignPage, { generateMetadata as getCollectionMetadata } from "@/app/collections/[slug]/page";

export async function generateMetadata() {
  return getCollectionMetadata({ params: { slug: "snails" } });
}

export default async function SnailsPage() {
  return CollectionCampaignPage({ params: { slug: "snails" } });
}
