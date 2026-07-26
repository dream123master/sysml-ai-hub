import type { Metadata } from "next";
import { LanguageProvider } from "@/components/language-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "SysML AI Hub",
  description: "发现、筛选并比较面向 SysML v1、SysML v2 与 MBSE 工作流的 AI 插件、Skill、MCP 和 Agent。",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" data-scroll-behavior="smooth">
      <body><LanguageProvider>{children}</LanguageProvider></body>
    </html>
  );
}
