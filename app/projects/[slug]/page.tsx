import { notFound } from "next/navigation";
import catalogData from "@/data/catalog.json";
import type { CatalogData } from "@/lib/types";
import { ProjectDetailClient } from "@/components/project-detail-client";

const data = catalogData as CatalogData;

export function generateStaticParams() {
  return data.projects.map((project) => ({ slug: project.slug }));
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = data.projects.find((item) => item.slug === slug);
  if (!project) notFound();
  return <ProjectDetailClient project={project} />;
}
