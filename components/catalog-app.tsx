"use client";

import Link from "next/link";
import { CalendarDays, ChevronRight, Search, SlidersHorizontal, X } from "lucide-react";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { CatalogData, CatalogProject, Language } from "@/lib/types";
import { formatDate, labels, localizedStandards, maturityLabel, sourceLabel, uniqueLocalizedStandards, uniqueLocalizedValues, uniqueValues } from "@/lib/catalog";
import { SiteHeader } from "./site-header";
import { SysmlMotif } from "./sysml-motif";
import { FilterBar, type Filters } from "./filter-bar";
import { ProjectList } from "./project-list";
import { BrandMark } from "./brand-mark";
import { useLanguage } from "./language-provider";

const EMPTY_FILTERS: Filters = { platform: "", version: "", capability: "", useCase: "", openSource: "", maturity: "" };

function searchText(project: CatalogProject, language: Language) {
  return [project.name, project.kind, project.summary[language], project.functionality[language], ...project.useCases[language], ...project.platforms, ...project.sysmlVersions, ...project.capabilities[language]].join(" ").toLowerCase();
}

export function CatalogApp({ data }: { data: CatalogData }) {
  const { language, setLanguage } = useLanguage();
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [sort, setSort] = useState("relevance");
  const [selected, setSelected] = useState<string[]>([]);
  const router = useRouter();
  const t = labels[language];

  const values = useMemo(() => ({
    platforms: uniqueValues(data.projects, "platforms"),
    versions: uniqueLocalizedStandards(data.projects, language),
    capabilities: uniqueLocalizedValues(data.projects, "capabilities", language),
    useCases: uniqueLocalizedValues(data.projects, "useCases", language),
  }), [data.projects, language]);

  useEffect(() => {
    setFilters((current) => ({ ...current, capability: "", useCase: "", openSource: "", maturity: "" }));
  }, [language]);

  const filtered = useMemo(() => {
    const normalizedOpenSource = filters.openSource ? Object.entries(sourceLabel).find(([, label]) => label[language] === filters.openSource)?.[0] : "";
    const normalizedMaturity = filters.maturity ? Object.entries(maturityLabel).find(([, label]) => label[language] === filters.maturity)?.[0] : "";
    const result = data.projects.filter((project) => {
      if (deferredQuery && !searchText(project, language).includes(deferredQuery)) return false;
      if (filters.platform && !project.platforms.includes(filters.platform)) return false;
      if (filters.version && !localizedStandards(project, language).includes(filters.version)) return false;
      if (filters.capability && !project.capabilities[language].includes(filters.capability)) return false;
      if (filters.useCase && !project.useCases[language].includes(filters.useCase)) return false;
      if (normalizedOpenSource && project.openSource !== normalizedOpenSource) return false;
      if (normalizedMaturity && project.maturity !== normalizedMaturity) return false;
      return true;
    });
    if (sort === "name") return result.toSorted((a, b) => a.name.localeCompare(b.name));
    if (sort === "newest") return result.toSorted((a, b) => b.lastVerified.localeCompare(a.lastVerified));
    return result.toSorted((a, b) => Number(b.verification === "verified") - Number(a.verification === "verified"));
  }, [data.projects, deferredQuery, filters, language, sort]);

  function toggleProject(id: string) {
    setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : current.length < 4 ? [...current, id] : current);
  }

  function clearFilters() {
    setFilters(EMPTY_FILTERS);
    setQuery("");
  }

  function goToCompare() {
    router.push(selected.length ? `/compare?ids=${selected.join(",")}` : "/compare");
  }

  return (
    <div className="app-shell">
      <SiteHeader language={language} onLanguageChange={setLanguage} />
      <main>
        <section className="hero-section">
          <div className="hero-copy">
            <h1>{t.heroTitle}</h1>
            <p>{t.heroSubtitle}</p>
            <label className="hero-search">
              <Search size={22} />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.search} />
              {query ? <button type="button" onClick={() => setQuery("")} aria-label={language === "zh" ? "清除搜索" : "Clear search"}><X size={18} /></button> : null}
            </label>
            <div className="update-meta">
              <span><CalendarDays size={17} />{t.lastUpdated} <strong>{formatDate(data.meta.lastUpdated, language)}</strong></span>
              <span><CalendarDays size={17} />{t.nextUpdated} <strong>{formatDate(data.meta.nextUpdate, language)}</strong></span>
              <Link href="/updates">{t.viewUpdates}<ChevronRight size={16} /></Link>
            </div>
          </div>
          <SysmlMotif />
        </section>

        <FilterBar language={language} labels={t} filters={filters} values={values} onChange={(key, value) => setFilters((current) => ({ ...current, [key]: value }))} />

        <section className="results-panel">
          <div className="results-toolbar">
            <h2>{t.projects} <span>({filtered.length})</span></h2>
            <label className="sort-control"><SlidersHorizontal size={16} /><select value={sort} onChange={(event) => setSort(event.target.value)}><option value="relevance">{t.sort}</option><option value="newest">{t.newest}</option><option value="name">{t.name}</option></select></label>
          </div>
          <ProjectList projects={filtered} language={language} selected={selected} onToggle={toggleProject} onClear={clearFilters} />
        </section>
      </main>

      <aside className={selected.length ? "compare-tray is-visible" : "compare-tray is-visible is-empty"} aria-live="polite">
        <div className="compare-tray__label"><BrandMark compact /><strong>{t.selected} {selected.length} {t.projectUnit}</strong></div>
        <div className="compare-tray__items">{selected.map((id) => { const project = data.projects.find((item) => item.id === id); return project ? <button key={id} type="button" onClick={() => toggleProject(id)}>{project.name}<X size={14} /></button> : null; })}</div>
        <button className="primary-button" type="button" onClick={goToCompare} disabled={selected.length < 2}>{t.startCompare}<ChevronRight size={18} /></button>
      </aside>
    </div>
  );
}
