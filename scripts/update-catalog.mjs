import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const catalogPath = path.join(root, "data", "catalog.json");
const catalog = JSON.parse(await readFile(catalogPath, "utf8"));
const force = process.argv.includes("--force") || process.env.FORCE_UPDATE === "true";
const DAY = 86_400_000;
const now = new Date();
const lastRun = new Date(`${catalog.meta.lastUpdated}T00:00:00Z`);

if (!force && now.getTime() - lastRun.getTime() < 2.95 * DAY) {
  console.log(`Catalog is fresh (${catalog.meta.lastUpdated}); the 3-day gate has not elapsed.`);
  process.exit(0);
}

const githubHeaders = {
  Accept: "application/vnd.github+json",
  "User-Agent": "sysml-ai-hub-catalog-bot",
  ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
};

const today = now.toISOString().slice(0, 10);
const nextUpdate = new Date(now.getTime() + 3 * DAY).toISOString().slice(0, 10);
const knownRepos = new Set(catalog.projects.map((project) => project.githubRepo).filter(Boolean).map((repo) => repo.toLowerCase()));
const knownUrls = new Set(catalog.projects.flatMap((project) => [project.githubUrl, project.homepageUrl, project.sourceUrl]).filter(Boolean).map((url) => url.toLowerCase()));
let updated = 0;
let added = 0;
let successfulSources = 0;

async function fetchJson(url, options = {}) {
  const response = await fetch(url, { signal: AbortSignal.timeout(20_000), ...options });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText} for ${url}`);
  return response.json();
}

function inferUseCases(text) {
  const value = text.toLowerCase();
  const cases = [];
  if (/requirement|需求/.test(value)) cases.push(["需求建模", "Requirements modeling"]);
  if (/architect|structure|block|part|架构|结构/.test(value)) cases.push(["架构设计", "Architecture design"]);
  if (/behavio|state|activity|行为|状态/.test(value)) cases.push(["行为建模", "Behavior modeling"]);
  if (/validat|lint|check|校验|验证/.test(value)) cases.push(["模型验证", "Model validation"]);
  if (/document|report|文档/.test(value)) cases.push(["模型文档生成", "Model documentation"]);
  if (/query|search|browse|查询|检索/.test(value)) cases.push(["模型理解", "Model comprehension"]);
  const selected = (cases.length ? cases : [["模型理解", "Model comprehension"], ["模型审查", "Model review"]]).slice(0, 4);
  return { zh: selected.map(([zh]) => zh), en: selected.map(([, en]) => en) };
}

function inferCapabilities(text) {
  const value = text.toLowerCase();
  const items = [];
  if (/generat|creat|生成|创建/.test(value)) items.push(["模型生成", "Model generation"]);
  if (/edit|modify|修改|编辑/.test(value)) items.push(["模型编辑", "Model editing"]);
  if (/validat|lint|check|校验|验证/.test(value)) items.push(["模型验证", "Model validation"]);
  if (/query|search|parse|browse|查询|解析/.test(value)) items.push(["模型查询", "Model queries"]);
  if (/document|report|文档/.test(value)) items.push(["文档生成", "Document generation"]);
  const selected = (items.length ? items : [["待进一步分析", "Pending analysis"]]).slice(0, 4);
  return { zh: selected.map(([zh]) => zh), en: selected.map(([, en]) => en) };
}

function inferStandards(text) {
  const value = text.toLowerCase();
  if (/sysml\s*v?2|sysmlv2|sysml-?v2|kerml/.test(value)) return ["SysML v2"];
  if (/sysml\s*v?1|sysmlv1|sysml-?v1/.test(value)) return ["SysML v1"];
  return ["SysML (version unspecified)"];
}

function isStrongCandidate(name, description = "") {
  const text = `${name} ${description}`.toLowerCase();
  const modeling = /sysml|mbse|model.based systems engineering/.test(text);
  const ai = /mcp|model context protocol|agent|skill|llm|gpt|claude|copilot|artificial intelligence|\bai\b/.test(text);
  return modeling && ai;
}

function createCandidate({ name, description, homepageUrl, sourceUrl, sourceType, githubRepo = null, githubUrl = null, license = null, stars = null, lastActivity = null }) {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 70) || `candidate-${Date.now()}`;
  const summary = description?.trim() || "自动检索发现的 SysML/MBSE AI 候选项目，等待进一步核验。";
  return {
    id: slug,
    slug,
    name,
    kind: /skill|plugin/.test(`${name} ${description}`.toLowerCase()) ? "Skill" : /mcp/.test(`${name} ${description}`.toLowerCase()) ? "MCP Server" : "Agent",
    summary: { zh: summary, en: summary },
    functionality: { zh: `公开描述：${summary}。该功能说明由规则提取，需在下一次人工复核时确认。`, en: `${summary} This rule-extracted description requires human verification.` },
    useCases: inferUseCases(summary),
    platforms: /mcp/.test(summary.toLowerCase()) ? ["MCP"] : ["To verify"],
    sysmlVersions: inferStandards(`${name} ${summary}`),
    capabilities: inferCapabilities(summary),
    openSource: githubUrl ? "open" : "unknown",
    license,
    verification: "pending",
    confidence: "low",
    maturity: "emerging",
    installation: "advanced",
    privacy: { zh: "自动发现项目，数据隐私与离线能力尚待核验。", en: "Automatically discovered candidate; privacy and offline behavior are not yet verified." },
    offline: "unknown",
    githubUrl,
    githubRepo,
    homepageUrl,
    sourceUrl,
    lastVerified: today,
    lastActivity,
    stars,
    sourceType,
    related: /mbse/.test(summary.toLowerCase()) && !/sysml/.test(summary.toLowerCase()),
  };
}

async function refreshKnownGithubProjects() {
  const targets = catalog.projects.filter((project) => project.githubRepo);
  const results = await Promise.allSettled(targets.map(async (project) => {
    const repo = await fetchJson(`https://api.github.com/repos/${project.githubRepo}`, { headers: githubHeaders });
    const previous = JSON.stringify([project.stars, project.lastActivity, project.license, project.openSource]);
    project.stars = repo.stargazers_count ?? project.stars;
    project.lastActivity = repo.pushed_at?.slice(0, 10) ?? project.lastActivity;
    project.license = repo.license?.spdx_id && repo.license.spdx_id !== "NOASSERTION" ? repo.license.spdx_id : project.license;
    project.openSource = repo.private ? "closed" : "open";
    project.lastVerified = today;
    if (previous !== JSON.stringify([project.stars, project.lastActivity, project.license, project.openSource])) updated += 1;
  }));
  if (results.some((result) => result.status === "fulfilled")) successfulSources += 1;
  results.filter((result) => result.status === "rejected").forEach((result) => console.warn("GitHub refresh warning:", result.reason.message));
}

async function discoverGithub() {
  const queries = [
    'sysml mcp in:name,description,readme',
    'sysml agent in:name,description,readme',
    'sysml llm in:name,description,readme',
    '"sysml v1" ai in:name,description,readme',
    'mbse mcp in:name,description,readme'
  ];
  const results = await Promise.allSettled(queries.map((query) => fetchJson(`https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=updated&order=desc&per_page=20`, { headers: githubHeaders })));
  for (const result of results) {
    if (result.status !== "fulfilled") continue;
    successfulSources += 1;
    for (const repo of result.value.items ?? []) {
      if (knownRepos.has(repo.full_name.toLowerCase()) || !isStrongCandidate(repo.name, repo.description)) continue;
      catalog.projects.push(createCandidate({ name: repo.name, description: repo.description, homepageUrl: repo.html_url, sourceUrl: repo.html_url, sourceType: "GitHub", githubRepo: repo.full_name, githubUrl: repo.html_url, license: repo.license?.spdx_id ?? null, stars: repo.stargazers_count ?? null, lastActivity: repo.pushed_at?.slice(0, 10) ?? null }));
      knownRepos.add(repo.full_name.toLowerCase());
      knownUrls.add(repo.html_url.toLowerCase());
      added += 1;
    }
  }
}

async function discoverNpm() {
  const data = await fetchJson(`https://registry.npmjs.org/-/v1/search?text=${encodeURIComponent("sysml mcp agent ai")}&size=30`);
  successfulSources += 1;
  for (const item of data.objects ?? []) {
    const pkg = item.package;
    if (!isStrongCandidate(pkg.name, pkg.description)) continue;
    const url = pkg.links?.homepage || pkg.links?.npm;
    if (!url || knownUrls.has(url.toLowerCase())) continue;
    const repoUrl = pkg.links?.repository?.replace(/^git\+/, "").replace(/\.git$/, "") ?? null;
    catalog.projects.push(createCandidate({ name: pkg.name, description: pkg.description, homepageUrl: url, sourceUrl: pkg.links?.npm || url, sourceType: "npm", githubUrl: repoUrl?.includes("github.com") ? repoUrl : null, lastActivity: pkg.date?.slice(0, 10) ?? null }));
    knownUrls.add(url.toLowerCase());
    added += 1;
  }
}

async function discoverOfficialMcpRegistry() {
  const data = await fetchJson("https://registry.modelcontextprotocol.io/v0.1/servers?search=sysml&limit=100");
  successfulSources += 1;
  for (const entry of data.servers ?? []) {
    const server = entry.server ?? entry;
    const name = server.title || server.name;
    const description = server.description || "";
    const repoUrl = server.repository?.url || server.repository;
    const homepage = server.websiteUrl || repoUrl;
    if (!name || !homepage || !isStrongCandidate(name, description) || knownUrls.has(String(homepage).toLowerCase())) continue;
    catalog.projects.push(createCandidate({ name, description, homepageUrl: homepage, sourceUrl: `https://registry.modelcontextprotocol.io/?q=${encodeURIComponent(server.name || name)}`, sourceType: "Official website", githubUrl: String(repoUrl).includes("github.com") ? repoUrl : null }));
    knownUrls.add(String(homepage).toLowerCase());
    added += 1;
  }
}

async function verifyCuratedWebSources() {
  const targets = catalog.projects.filter((project) => !project.githubRepo);
  const results = await Promise.allSettled(targets.map(async (project) => {
    const response = await fetch(project.sourceUrl, { method: "GET", redirect: "follow", signal: AbortSignal.timeout(20_000), headers: { "User-Agent": "sysml-ai-hub-catalog-bot" } });
    if (response.ok) project.lastVerified = today;
  }));
  if (results.some((result) => result.status === "fulfilled")) successfulSources += 1;
}

const tasks = [refreshKnownGithubProjects(), discoverGithub(), discoverNpm(), discoverOfficialMcpRegistry(), verifyCuratedWebSources()];
const outcomes = await Promise.allSettled(tasks);
outcomes.filter((result) => result.status === "rejected").forEach((result) => console.warn("Source warning:", result.reason.message));

if (successfulSources === 0) throw new Error("No catalog source could be reached; refusing to advance update timestamps.");

catalog.meta.lastUpdated = today;
catalog.meta.nextUpdate = nextUpdate;
catalog.projects.sort((a, b) => Number(b.verification === "verified") - Number(a.verification === "verified") || a.name.localeCompare(b.name));
const noDataChanges = added === 0 && updated === 0;
catalog.updates.unshift({
  date: today,
  type: added ? "discovery" : "refresh",
  title: {
    zh: added ? `自动发现 ${added} 个候选项目` : noDataChanges ? "本次检查无数据变化" : "完成定期数据刷新",
    en: added ? `Discovered ${added} candidates` : noDataChanges ? "No data changes found" : "Scheduled data refresh completed",
  },
  details: {
    zh: noDataChanges
      ? "已检查 GitHub、npm、官方 MCP Registry 与已收录项目页面；本次未发现新候选项目或项目元数据变化。"
      : `检查 GitHub、npm、官方 MCP Registry 与已收录项目页面；更新 ${updated} 个项目元数据。新候选默认标记为待验证。`,
    en: noDataChanges
      ? "Checked GitHub, npm, the official MCP Registry, and curated project pages; no new candidates or project metadata changes were found."
      : `Checked GitHub, npm, the official MCP Registry, and curated project pages; refreshed ${updated} project records. New candidates are pending by default.`,
  },
  added,
  updated,
});
catalog.updates = catalog.updates.slice(0, 24);

await writeFile(catalogPath, `${JSON.stringify(catalog, null, 2)}\n`, "utf8");
console.log(`Catalog updated: ${added} added, ${updated} changed, ${successfulSources} source groups reached.`);
