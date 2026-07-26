export type Language = "zh" | "en";
export type VerificationStatus = "verified" | "pending";
export type OpenSourceStatus = "open" | "closed" | "unknown";
export type Maturity = "emerging" | "growing" | "established";

export interface LocalizedText {
  zh: string;
  en: string;
}

export interface CatalogProject {
  id: string;
  slug: string;
  name: string;
  kind: "MCP Server" | "Skill" | "Agent" | "IDE Extension" | "Agent Toolkit";
  summary: LocalizedText;
  functionality: LocalizedText;
  useCases: LocalizedList;
  platforms: string[];
  sysmlVersions: string[];
  capabilities: LocalizedList;
  openSource: OpenSourceStatus;
  license: string | null;
  verification: VerificationStatus;
  confidence: "high" | "medium" | "low";
  maturity: Maturity;
  installation: "easy" | "medium" | "advanced";
  privacy: LocalizedText;
  offline: "yes" | "partial" | "no" | "unknown";
  githubUrl: string | null;
  githubRepo: string | null;
  homepageUrl: string;
  sourceUrl: string;
  lastVerified: string;
  lastActivity: string | null;
  stars: number | null;
  sourceType: "GitHub" | "npm" | "Marketplace" | "Skill directory" | "Official website";
  related: boolean;
}

export interface LocalizedList {
  zh: string[];
  en: string[];
}

export interface UpdateEntry {
  date: string;
  type: "initial" | "refresh" | "discovery";
  title: LocalizedText;
  details: LocalizedText;
  added: number;
  updated: number;
}

export interface CatalogData {
  meta: {
    lastUpdated: string;
    nextUpdate: string;
    intervalDays: number;
    sources: string[];
    methodology: LocalizedText;
  };
  projects: CatalogProject[];
  updates: UpdateEntry[];
}
