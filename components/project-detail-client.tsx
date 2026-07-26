"use client";

import Link from "next/link";
import { ArrowLeft, CheckCircle2, ExternalLink, Github, HardDrive, Shield, Sparkles } from "lucide-react";
import type { CatalogProject } from "@/lib/types";
import { localizedList, localizedStandards, maturityLabel, sourceLabel } from "@/lib/catalog";
import { SiteHeader } from "./site-header";
import { useLanguage } from "./language-provider";

export function ProjectDetailClient({ project }: { project: CatalogProject }) {
  const { language, setLanguage } = useLanguage();
  return (
    <div className="app-shell app-shell--subpage">
      <SiteHeader language={language} onLanguageChange={setLanguage} />
      <main className="subpage detail-page">
        <Link href="/" className="back-link"><ArrowLeft size={17} />{language === "zh" ? "返回项目库" : "Back to catalog"}</Link>
        <section className="detail-hero">
          <div><div className="detail-hero__meta"><span>{project.kind}</span><span>{project.verification === "verified" ? (language === "zh" ? "已验证" : "Verified") : (language === "zh" ? "待验证" : "Pending")}</span>{project.related ? <span>{language === "zh" ? "相关 MBSE" : "Related MBSE"}</span> : null}</div><h1>{project.name}</h1><p>{project.summary[language]}</p><div className="detail-actions"><a className="primary-button" href={project.githubUrl ?? project.homepageUrl} target="_blank" rel="noreferrer">{project.githubUrl ? <Github size={18} /> : <ExternalLink size={18} />}{project.githubUrl ? "GitHub" : (language === "zh" ? "访问项目页面" : "Visit project")}</a><a className="secondary-button" href={project.sourceUrl} target="_blank" rel="noreferrer">{language === "zh" ? "查看核验来源" : "View source"}<ExternalLink size={16} /></a></div></div>
          <aside><div><span>{language === "zh" ? "标准" : "Standard"}</span><strong>{localizedStandards(project, language).join(" / ")}</strong></div><div><span>{language === "zh" ? "开源状态" : "Source status"}</span><strong>{sourceLabel[project.openSource][language]}{project.license ? ` · ${project.license}` : ""}</strong></div><div><span>{language === "zh" ? "成熟度" : "Maturity"}</span><strong>{maturityLabel[project.maturity][language]}</strong></div><div><span>{language === "zh" ? "最后核验" : "Last verified"}</span><strong>{project.lastVerified}</strong></div></aside>
        </section>
        <section className="detail-grid">
          <article className="detail-section detail-section--wide"><Sparkles /><div><h2>{language === "zh" ? "核心功能" : "Core function"}</h2><p>{project.functionality[language]}</p><div className="tag-list">{localizedList(project, "capabilities", language).map((item) => <span className="scenario-tag" key={item}>{item}</span>)}</div></div></article>
          <article className="detail-section"><CheckCircle2 /><div><h2>{language === "zh" ? "适用场景" : "Use cases"}</h2><ul>{localizedList(project, "useCases", language).map((item) => <li key={item}>{item}</li>)}</ul></div></article>
          <article className="detail-section"><HardDrive /><div><h2>{language === "zh" ? "支持平台" : "Platforms"}</h2><div className="tag-list">{project.platforms.map((item) => <span className="platform-tag" key={item}>{item}</span>)}</div></div></article>
          <article className="detail-section detail-section--wide"><Shield /><div><h2>{language === "zh" ? "数据隐私与离线能力" : "Privacy and offline use"}</h2><p>{project.privacy[language]}</p><p className="detail-note">{language === "zh" ? "离线能力：" : "Offline: "}{({ yes: language === "zh" ? "支持" : "Yes", partial: language === "zh" ? "部分支持" : "Partial", no: language === "zh" ? "不支持" : "No", unknown: language === "zh" ? "未确认" : "Unknown" })[project.offline]}</p></div></article>
        </section>
      </main>
    </div>
  );
}
