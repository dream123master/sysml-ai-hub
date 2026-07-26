import catalogData from "@/data/catalog.json";
import { CatalogApp } from "@/components/catalog-app";
import type { CatalogData } from "@/lib/types";

export default function HomePage() {
  return <CatalogApp data={catalogData as CatalogData} />;
}
