import CollectionCampaignPage, { generateMetadata as getCollectionMetadata } from "@/app/collections/[slug]/page";

export async function generateMetadata() {
  return getCollectionMetadata({ params: { slug: "filters" } });
}

export default async function FiltersPage() {
  return CollectionCampaignPage({ params: { slug: "filters" } });
}
