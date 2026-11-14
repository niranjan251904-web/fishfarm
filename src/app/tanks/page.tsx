import CollectionCampaignPage, { generateMetadata as getCollectionMetadata } from "@/app/collections/[slug]/page";

export async function generateMetadata() {
  return getCollectionMetadata({ params: { slug: "tanks" } });
}

export default async function TanksPage() {
  return CollectionCampaignPage({ params: { slug: "tanks" } });
}
