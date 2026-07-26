import { Braces, ChartNoAxesColumnIncreasing, Code2, Layers3, Milestone, Sparkles } from "lucide-react";
import type { Language } from "@/lib/types";
import type { UiLabels } from "@/lib/catalog";

export interface Filters {
  platform: string;
  version: string;
  capability: string;
  useCase: string;
  openSource: string;
  maturity: string;
}

type FilterKey = keyof Filters;

export function FilterBar({ language, labels: t, filters, values, onChange }: {
  language: Language;
  labels: UiLabels;
  filters: Filters;
  values: { platforms: string[]; versions: string[]; capabilities: string[]; useCases: string[] };
  onChange: (key: FilterKey, value: string) => void;
}) {
  const items: Array<{ key: FilterKey; label: string; allLabel: string; options: string[]; icon: React.ReactNode }> = [
    { key: "platform", label: t.platform, allLabel: t.allPlatforms, options: values.platforms, icon: <Layers3 size={18} /> },
    { key: "version", label: t.version, allLabel: t.allVersions, options: values.versions, icon: <Milestone size={18} /> },
    { key: "capability", label: t.capability, allLabel: t.allCapabilities, options: values.capabilities, icon: <Sparkles size={18} /> },
    { key: "useCase", label: t.useCase, allLabel: t.allUseCases, options: values.useCases, icon: <Braces size={18} /> },
    { key: "openSource", label: t.openSource, allLabel: t.all, options: language === "zh" ? ["开源", "闭源", "未确认"] : ["Open source", "Closed source", "Unknown"], icon: <Code2 size={18} /> },
    { key: "maturity", label: t.maturity, allLabel: t.all, options: language === "zh" ? ["探索期", "成长期", "成熟"] : ["Emerging", "Growing", "Established"], icon: <ChartNoAxesColumnIncreasing size={18} /> },
  ];

  return (
    <section className="filter-bar" aria-label={language === "zh" ? "项目筛选" : "Project filters"}>
      {items.map((item) => (
        <label className={filters[item.key] ? "filter-field is-active" : "filter-field"} key={item.key}>
          <span className="filter-field__label">{item.icon}{item.label}</span>
          <select value={filters[item.key]} onChange={(event) => onChange(item.key, event.target.value)}>
            <option value="">{item.allLabel}</option>
            {item.options.map((option) => <option value={option} key={option}>{option}</option>)}
          </select>
        </label>
      ))}
    </section>
  );
}
