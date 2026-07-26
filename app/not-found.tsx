"use client";

import Link from "next/link";
import { useLanguage } from "@/components/language-provider";

export default function NotFound() {
  const { language } = useLanguage();
  return <main className="not-found"><h1>{language === "zh" ? "未找到项目" : "Project not found"}</h1><p>{language === "zh" ? "该项目可能已更名、合并或从目录中移除。" : "This project may have been renamed, merged, or removed from the catalog."}</p><Link href="/">{language === "zh" ? "返回项目库" : "Back to catalog"}</Link></main>;
}
