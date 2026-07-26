import catalogData from "@/data/catalog.json";
import type { CatalogData } from "@/lib/types";
import { UpdatesClient } from "@/components/updates-client";

export default function UpdatesPage() {
  return <UpdatesClient data={catalogData as CatalogData} />;
}
