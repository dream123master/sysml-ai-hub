"use client";

import Link from "next/link";
import { Globe2, Menu, X } from "lucide-react";
import { useState } from "react";
import { BrandMark } from "./brand-mark";
import type { Language } from "@/lib/types";
import { labels } from "@/lib/catalog";

export function SiteHeader({ language, onLanguageChange, active = "catalog" }: { language: Language; onLanguageChange?: (language: Language) => void; active?: "catalog" | "compare" | "updates" }) {
  const [open, setOpen] = useState(false);
  const t = labels[language];
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link href="/" className="brand" aria-label={language === "zh" ? "SysML AI Hub 首页" : "SysML AI Hub home"}>
          <BrandMark />
          <span className="brand__name">SysML AI Hub</span>
          <span className="brand__tagline">{language === "zh" ? "发现面向系统建模的 AI 插件与技能" : "Discover AI plugins and skills for systems modeling"}</span>
        </Link>
        <button className="mobile-menu" type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label={language === "zh" ? "切换导航" : "Toggle navigation"}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
        <nav className={open ? "main-nav main-nav--open" : "main-nav"} aria-label={language === "zh" ? "主导航" : "Main navigation"}>
          <Link className={active === "catalog" ? "main-nav__link is-active" : "main-nav__link"} href="/">{t.navCatalog}</Link>
          <Link className={active === "compare" ? "main-nav__link is-active" : "main-nav__link"} href="/compare">{t.navCompare}</Link>
          <Link className={active === "updates" ? "main-nav__link is-active" : "main-nav__link"} href="/updates">{t.navUpdates}</Link>
        </nav>
        <button className="language-switch" type="button" onClick={() => onLanguageChange?.(language === "zh" ? "en" : "zh")} aria-label={language === "zh" ? "切换到英文" : "Switch to Chinese"}>
          <Globe2 size={17} />
          <span>{language === "zh" ? "中 / EN" : "EN / 中"}</span>
        </button>
      </div>
    </header>
  );
}
