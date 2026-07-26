# SysML AI Hub

一个面向 SysML v1、SysML v2 与相关 MBSE 工作流的 AI 插件、Skill、MCP Server、Agent 和工具集目录。

## 本地运行

```bash
npm install
npm run dev
```

浏览器访问 `http://localhost:3000`。

## 数据更新

- GitHub Actions 每天唤醒一次，脚本内置 72 小时门控，因此目录每 3 天实际更新一次。
- 数据源包括 GitHub Search API、npm Registry、官方 MCP Registry、已收录的官方市场与项目页面。
- 自动发现的新项目会标记为“待验证”，不会伪装成已核验项目。
- 可使用 `npm run catalog:update:force` 在本地立即刷新。
- GitHub API 可选使用 `GITHUB_TOKEN` 提高速率上限；GitHub Actions 会自动提供。

## 页面

- `/`：搜索、筛选、排序与选择对比项目
- `/projects/[slug]`：项目功能、适用场景、标准、平台和隐私详情
- `/compare`：2–4 个项目的横向比较
- `/updates`：数据来源、方法和更新记录

## 首批公开来源

- [hni-ase/SysMLV2-mcp](https://github.com/hni-ase/SysMLV2-mcp)
- [@engineer-fumi/sysml-v2-mcp](https://www.npmjs.com/package/@engineer-fumi/sysml-v2-mcp)
- [VPATH AI SysML v2 Agent](https://marketplace.visualstudio.com/items?itemName=VPATHAIGmbH.vpathai-sysmlv2-agent)
- [sysmlv2 Claude Skill](https://skills.rest/skill/sysmlv2)
- [melodic-software/claude-code-plugins](https://github.com/melodic-software/claude-code-plugins)
- [SysML v2 MCP Server by Raghunath Torase](https://www.linkedin.com/pulse/sysml-v2-mcp-server-available-all-raghunath-torase-dvirf)
- [matlab/simulink-agentic-toolkit](https://github.com/matlab/simulink-agentic-toolkit)

项目功能与适用场景是基于公开说明的结构化归纳；请以对应项目的最新文档为准。
