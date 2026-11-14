import CollectionCampaignPage, { generateMetadata as getCollectionMetadata } from "@/app/collections/[slug]/page";

export async function generateMetadata() {
  return getCollectionMetadata({ params: { slug: "aquascaping" } });
}

export default async function AquaScapingPage() {
  return CollectionCampaignPage({ params: { slug: "aquascaping" } });
}
