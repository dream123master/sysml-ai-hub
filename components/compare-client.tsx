"use client";

import Link from "next/link";
import { ArrowLeft, Check, ExternalLink, Github, Minus } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import type { CatalogData } from "@/lib/types";
import { labels, localizedList, localizedStandards, maturityLabel, sourceLabel } from "@/lib/catalog";
import { SiteHeader } from "./site-header";
import { useLanguage } from "./language-provider";

export function CompareClient({ data }: { data: CatalogData }) {
  const params = useSearchParams();
  const initial = params.get("ids")?.split(",").filter((id) => data.projects.some((project) => project.id === id)).slice(0, 4) ?? [];
  const [selected, setSelected] = useState<string[]>(initial);
  const { language, setLanguage } = useLanguage();
  const t = labels[language];
  const projects = useMemo(() => selected.map((id) => data.projects.find((project) => project.id === id)).filter(Boolean), [data.projects, selected]);

  function toggle(id: string) {
    setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : current.length < 4 ? [...current, id] : current);
  }

  const rows = [
    { label: language === "zh" ? "适用场景" : "Use cases", render: (project: CatalogData["projects"][number]) => localizedList(project, "useCases", language).join(language === "zh" ? "、" : ", ") },
    { label: language === "zh" ? "核心功能" : "Core function", render: (project: CatalogData["projects"][number]) => project.functionality[language] },
    { label: language === "zh" ? "SysML 标准" : "SysML standard", render: (project: CatalogData["projects"][number]) => localizedStandards(project, language).join(" / ") },
    { label: language === "zh" ? "支持平台" : "Platforms", render: (project: CatalogData["projects"][number]) => project.platforms.join(language === "zh" ? "、" : ", ") },
    { label: language === "zh" ? "核心能力" : "Capabilities", render: (project: CatalogData["projects"][number]) => localizedList(project, "capabilities", language).join(language === "zh" ? "、" : ", ") },
    { label: language === "zh" ? "开源状态" : "Source status", render: (project: CatalogData["projects"][number]) => `${sourceLabel[project.openSource][language]}${project.license ? ` · ${project.license}` : ""}` },
    { label: language === "zh" ? "成熟度" : "Maturity", render: (project: CatalogData["projects"][number]) => maturityLabel[project.maturity][language] },
    { label: language === "zh" ? "离线能力" : "Offline", render: (project: CatalogData["projects"][number]) => ({ yes: language === "zh" ? "支持" : "Yes", partial: language === "zh" ? "部分支持" : "Partial", no: language === "zh" ? "不支持" : "No", unknown: language === "zh" ? "未确认" : "Unknown" })[project.offline] },
    { label: language === "zh" ? "数据隐私" : "Data privacy", render: (project: CatalogData["projects"][number]) => project.privacy[language] },
  ];

  return (
    <div className="app-shell app-shell--subpage">
      <SiteHeader language={language} onLanguageChange={setLanguage} active="compare" />
      <main className="subpage">
        <Link href="/" className="back-link"><ArrowLeft size={17} />{language === "zh" ? "返回项目库" : "Back to catalog"}</Link>
        <div className="subpage-heading"><div><h1>{t.navCompare}</h1><p>{language === "zh" ? "选择 2–4 个项目，按 SysML 工作阶段、功能、标准和部署特征进行横向比较。" : "Select 2–4 projects and compare workflow stages, functions, standards, and deployment characteristics."}</p></div><span className="selection-count">{selected.length} / 4</span></div>
        <section className="compare-picker" aria-label={language === "zh" ? "选择对比项目" : "Select projects to compare"}>
          {data.projects.map((project) => <button type="button" key={project.id} className={selected.includes(project.id) ? "compare-option is-selected" : "compare-option"} onClick={() => toggle(project.id)}><span>{selected.includes(project.id) ? <Check size={15} /> : <Minus size={15} />}</span>{project.name}<small>{localizedStandards(project, language).join(" / ")}</small></button>)}
        </section>
        {projects.length >= 2 ? (
          <section className="comparison-table-wrap">
            <table className="comparison-table">
              <thead><tr><th>{language === "zh" ? "比较维度" : "Dimension"}</th>{projects.map((project) => project ? <th key={project.id}><Link href={`/projects/${project.slug}`}>{project.name}</Link><small>{project.kind}</small></th> : null)}</tr></thead>
              <tbody>{rows.map((row) => <tr key={row.label}><th>{row.label}</th>{projects.map((project) => project ? <td key={project.id}>{row.render(project)}</td> : null)}</tr>)}</tbody>
              <tfoot><tr><th>{language === "zh" ? "访问项目" : "Visit"}</th>{projects.map((project) => project ? <td key={project.id}><a href={project.githubUrl ?? project.homepageUrl} target="_blank" rel="noreferrer">{project.githubUrl ? <Github size={16} /> : <ExternalLink size={16} />}{project.githubUrl ? "GitHub" : t.official}</a></td> : null)}</tr></tfoot>
            </table>
          </section>
        ) : <div className="comparison-empty"><h2>{language === "zh" ? "请选择至少两个项目" : "Select at least two projects"}</h2><p>{language === "zh" ? "建议先选择相同 SysML 版本或相似适用场景的项目。" : "Start with projects supporting the same SysML version or similar use cases."}</p></div>}
      </main>
    </div>
  );
}
