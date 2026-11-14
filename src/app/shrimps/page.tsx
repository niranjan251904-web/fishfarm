import CollectionCampaignPage, { generateMetadata as getCollectionMetadata } from "@/app/collections/[slug]/page";

export async function generateMetadata() {
  return getCollectionMetadata({ params: { slug: "shrimps" } });
}

export default async function ShrimpsPage() {
  return CollectionCampaignPage({ params: { slug: "shrimps" } });
}
