import { Suspense } from "react";
import catalogData from "@/data/catalog.json";
import type { CatalogData } from "@/lib/types";
import { CompareClient } from "@/components/compare-client";

export default function ComparePage() {
  return <Suspense fallback={<div className="page-loading" role="status" aria-label="Loading" />}><CompareClient data={catalogData as CatalogData} /></Suspense>;
}
