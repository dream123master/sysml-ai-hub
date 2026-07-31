import type { CatalogProject, Language, Maturity, OpenSourceStatus } from "./types";

export const labels = {
  zh: {
    navCatalog: "项目库",
    navCompare: "同类对比",
    navUpdates: "更新日志",
    heroTitle: "SysML AI 工具目录",
    heroSubtitle: "每 3 天自动检索 GitHub、公开 Registry、官方市场与项目官网",
    search: "搜索插件、Skill、MCP、Agent、功能或适用场景",
    lastUpdated: "最近更新",
    nextUpdated: "下次更新",
    viewUpdates: "查看更新日志",
    downloadReport: "下载 Word 调研报告",
    platform: "平台",
    version: "SysML 版本",
    capability: "核心能力",
    useCase: "适用场景",
    openSource: "开源状态",
    maturity: "成熟度",
    all: "全部",
    allPlatforms: "全部平台",
    allVersions: "全部版本",
    allCapabilities: "全部能力",
    allUseCases: "全部场景",
    projects: "发现的项目",
    sort: "综合排序",
    newest: "最近验证",
    name: "名称排序",
    coreFunction: "核心功能",
    applicable: "适用场景",
    supportedPlatforms: "支持平台",
    verified: "已验证",
    pending: "待验证",
    addCompare: "加入对比",
    removeCompare: "移出对比",
    selected: "已选择",
    projectUnit: "个项目",
    startCompare: "开始对比",
    github: "GitHub",
    official: "项目页面",
    noGithub: "未发现公开 GitHub",
    noResults: "没有符合当前条件的项目",
    clearFilters: "清除筛选",
    related: "相关 MBSE",
  },
  en: {
    navCatalog: "Catalog",
    navCompare: "Compare",
    navUpdates: "Updates",
    heroTitle: "SysML AI Tool Directory",
    heroSubtitle: "Automatically checks GitHub, public registries, marketplaces, and project websites every 3 days",
    search: "Search plugins, skills, MCP servers, agents, functions, or use cases",
    lastUpdated: "Last updated",
    nextUpdated: "Next update",
    viewUpdates: "View update log",
    downloadReport: "Download Word report",
    platform: "Platform",
    version: "SysML version",
    capability: "Capability",
    useCase: "Use case",
    openSource: "Source status",
    maturity: "Maturity",
    all: "All",
    allPlatforms: "All platforms",
    allVersions: "All versions",
    allCapabilities: "All capabilities",
    allUseCases: "All use cases",
    projects: "Discovered projects",
    sort: "Relevance",
    newest: "Recently verified",
    name: "Name",
    coreFunction: "Core function",
    applicable: "Use cases",
    supportedPlatforms: "Platforms",
    verified: "Verified",
    pending: "Pending",
    addCompare: "Add to compare",
    removeCompare: "Remove",
    selected: "Selected",
    projectUnit: "projects",
    startCompare: "Compare",
    github: "GitHub",
    official: "Project page",
    noGithub: "No public GitHub found",
    noResults: "No projects match these filters",
    clearFilters: "Clear filters",
    related: "Related MBSE",
  },
} as const;

export type UiLabels = (typeof labels)[Language];

export const maturityLabel: Record<Maturity, Record<Language, string>> = {
  emerging: { zh: "探索期", en: "Emerging" },
  growing: { zh: "成长期", en: "Growing" },
  established: { zh: "成熟", en: "Established" },
};

export const sourceLabel: Record<OpenSourceStatus, Record<Language, string>> = {
  open: { zh: "开源", en: "Open source" },
  closed: { zh: "闭源", en: "Closed source" },
  unknown: { zh: "未确认", en: "Unknown" },
};

export function localized(project: CatalogProject, field: "summary" | "functionality" | "privacy", language: Language) {
  return project[field][language];
}

export function localizedList(project: CatalogProject, field: "capabilities" | "useCases", language: Language) {
  return project[field][language];
}

export function localizedStandards(project: CatalogProject, language: Language) {
  return project.sysmlVersions.map((value) => {
    if (value === "通用 MBSE") return language === "zh" ? value : "General MBSE";
    if (value === "SysML（版本未注明）") return language === "zh" ? value : "SysML (version unspecified)";
    return value;
  });
}

export function uniqueValues(projects: CatalogProject[], field: "platforms" | "sysmlVersions") {
  return Array.from(new Set(projects.flatMap((project) => project[field]))).sort((a, b) => a.localeCompare(b, "zh-CN"));
}

export function uniqueLocalizedValues(projects: CatalogProject[], field: "capabilities" | "useCases", language: Language) {
  return Array.from(new Set(projects.flatMap((project) => project[field][language]))).sort((a, b) => a.localeCompare(b, language === "zh" ? "zh-CN" : "en-US"));
}

export function uniqueLocalizedStandards(projects: CatalogProject[], language: Language) {
  return Array.from(new Set(projects.flatMap((project) => localizedStandards(project, language)))).sort((a, b) => a.localeCompare(b, language === "zh" ? "zh-CN" : "en-US"));
}

export function formatDate(value: string, language: Language) {
  return new Intl.DateTimeFormat(language === "zh" ? "zh-CN" : "en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(`${value}T00:00:00Z`));
}
