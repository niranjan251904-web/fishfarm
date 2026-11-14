import CollectionCampaignPage, { generateMetadata as getCollectionMetadata } from "@/app/collections/[slug]/page";

export async function generateMetadata() {
  return getCollectionMetadata({ params: { slug: "merchandise" } });
}

export default async function MerchandisePage() {
  return CollectionCampaignPage({ params: { slug: "merchandise" } });
}
