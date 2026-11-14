import CollectionCampaignPage, { generateMetadata as getCollectionMetadata } from "@/app/collections/[slug]/page";

export async function generateMetadata() {
  return getCollectionMetadata({ params: { slug: "equipment" } });
}

export default async function EquipmentPage() {
  return CollectionCampaignPage({ params: { slug: "equipment" } });
}
