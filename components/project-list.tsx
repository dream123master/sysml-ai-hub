import Link from "next/link";
import { Bot, Box, Check, ExternalLink, Github, PackageSearch, Puzzle, ShieldCheck, ShieldQuestion } from "lucide-react";
import type { CatalogProject, Language } from "@/lib/types";
import { labels, localized, localizedList, localizedStandards, sourceLabel } from "@/lib/catalog";

function ProjectIcon({ kind }: { kind: CatalogProject["kind"] }) {
  const Icon = kind === "MCP Server" ? Puzzle : kind === "Skill" ? PackageSearch : kind === "IDE Extension" ? Box : Bot;
  return <span className={`project-icon project-icon--${kind.toLowerCase().replaceAll(" ", "-")}`}><Icon size={25} /></span>;
}

export function ProjectList({ projects, language, selected, onToggle, onClear }: {
  projects: CatalogProject[];
  language: Language;
  selected: string[];
  onToggle: (id: string) => void;
  onClear: () => void;
}) {
  const t = labels[language];
  if (projects.length === 0) {
    return (
      <div className="empty-state">
        <PackageSearch size={36} />
        <p>{t.noResults}</p>
        <button type="button" className="text-button" onClick={onClear}>{t.clearFilters}</button>
      </div>
    );
  }

  return (
    <div className="project-list">
      <div className="project-list__head" aria-hidden="true">
        <span>{language === "zh" ? "项目" : "Project"}</span>
        <span>{t.coreFunction}</span>
        <span>{t.applicable}</span>
        <span>{t.supportedPlatforms}</span>
        <span>{language === "zh" ? "标准 / 状态" : "Standard / status"}</span>
        <span>{language === "zh" ? "操作" : "Actions"}</span>
      </div>
      {projects.map((project) => {
        const isSelected = selected.includes(project.id);
        return (
          <article className={isSelected ? "project-row is-selected" : "project-row"} key={project.id}>
            <div className="project-row__identity">
              <button type="button" className={isSelected ? "compare-check is-checked" : "compare-check"} onClick={() => onToggle(project.id)} aria-label={isSelected ? t.removeCompare : t.addCompare}>
                {isSelected ? <Check size={15} /> : null}
              </button>
              <ProjectIcon kind={project.kind} />
              <div>
                <Link className="project-name" href={`/projects/${project.slug}`}>{project.name}</Link>
                <div className="project-kind">{project.kind}{project.related ? ` · ${t.related}` : ""}</div>
              </div>
            </div>
            <div className="project-row__function">
              <span className="mobile-label">{t.coreFunction}</span>
              <p>{localized(project, "functionality", language)}</p>
              <Link href={`/projects/${project.slug}`} className="detail-link">{language === "zh" ? "查看详情" : "Details"}<ExternalLink size={13} /></Link>
            </div>
            <div className="project-row__scenarios">
              <span className="mobile-label">{t.applicable}</span>
              <div className="tag-list">{localizedList(project, "useCases", language).slice(0, 4).map((useCase) => <span className="scenario-tag" key={useCase}>{useCase}</span>)}</div>
            </div>
            <div className="project-row__platforms">
              <span className="mobile-label">{t.supportedPlatforms}</span>
              <div className="tag-list tag-list--stacked">{project.platforms.slice(0, 3).map((platform) => <span className="platform-tag" key={platform}>{platform}</span>)}</div>
            </div>
            <div className="project-row__status">
              <span className="version-text">{localizedStandards(project, language).join(" / ")}</span>
              <span className={`source-badge source-badge--${project.openSource}`}>{sourceLabel[project.openSource][language]}{project.license ? ` · ${project.license}` : ""}</span>
              <span className={project.verification === "verified" ? "verify-badge is-verified" : "verify-badge is-pending"}>
                {project.verification === "verified" ? <ShieldCheck size={14} /> : <ShieldQuestion size={14} />}
                {project.verification === "verified" ? t.verified : t.pending}
              </span>
            </div>
            <div className="project-row__actions">
              {project.githubUrl ? (
                <a href={project.githubUrl} target="_blank" rel="noreferrer"><Github size={17} />{t.github}</a>
              ) : (
                <span className="no-github">{t.noGithub}</span>
              )}
              <button type="button" onClick={() => onToggle(project.id)}>{isSelected ? t.removeCompare : t.addCompare}</button>
            </div>
          </article>
        );
      })}
    </div>
  );
}
