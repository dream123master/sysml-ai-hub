"use client";

import Link from "next/link";
import { ArrowLeft, CalendarClock, CheckCircle2, Database, GitBranch, Radar } from "lucide-react";
import type { CatalogData } from "@/lib/types";
import { formatDate } from "@/lib/catalog";
import { SiteHeader } from "./site-header";
import { useLanguage } from "./language-provider";

export function UpdatesClient({ data }: { data: CatalogData }) {
  const { language, setLanguage } = useLanguage();
  return (
    <div className="app-shell app-shell--subpage">
      <SiteHeader language={language} onLanguageChange={setLanguage} active="updates" />
      <main className="subpage updates-page">
        <Link href="/" className="back-link"><ArrowLeft size={17} />{language === "zh" ? "返回项目库" : "Back to catalog"}</Link>
        <div className="subpage-heading"><div><h1>{language === "zh" ? "更新日志" : "Update log"}</h1><p>{language === "zh" ? "查看目录的数据来源、检索周期、收录规则和每次变化。" : "Review data sources, cadence, inclusion rules, and catalog changes."}</p></div></div>
        <section className="update-overview">
          <div><CalendarClock /><span>{language === "zh" ? "下次自动更新" : "Next automatic update"}</span><strong>{formatDate(data.meta.nextUpdate, language)}</strong></div>
          <div><Radar /><span>{language === "zh" ? "更新周期" : "Cadence"}</span><strong>{language === "zh" ? `每 ${data.meta.intervalDays} 天` : `Every ${data.meta.intervalDays} days`}</strong></div>
          <div><Database /><span>{language === "zh" ? "当前项目" : "Current projects"}</span><strong>{data.projects.length}</strong></div>
          <div><GitBranch /><span>{language === "zh" ? "数据来源" : "Sources"}</span><strong>{data.meta.sources.length}</strong></div>
        </section>
        <section className="methodology-panel">
          <div><CheckCircle2 size={22} /><div><h2>{language === "zh" ? "收录方法" : "Methodology"}</h2><p>{data.meta.methodology[language]}</p></div></div>
          <ul>{data.meta.sources.map((source) => <li key={source}>{source}</li>)}</ul>
        </section>
        <section className="timeline">
          {data.updates.map((update) => <article key={`${update.date}-${update.type}`}><time>{formatDate(update.date, language)}</time><div><span className={`timeline__type timeline__type--${update.type}`}>{update.type === "initial" ? (language === "zh" ? "首次收录" : "Initial") : update.type === "discovery" ? (language === "zh" ? "新发现" : "Discovery") : (language === "zh" ? "数据刷新" : "Refresh")}</span><h2>{update.title[language]}</h2><p>{update.details[language]}</p><footer>+{update.added} {language === "zh" ? "新增" : "added"} · {update.updated} {language === "zh" ? "更新" : "updated"}</footer></div></article>)}
        </section>
      </main>
    </div>
  );
}
