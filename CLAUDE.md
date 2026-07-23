# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# AI Platform

基于 pnpm workspace 的全栈 monorepo：**Next.js 前端 + NestJS 后端**，用于学习和搭建 AI 应用。

## 技术架构

| 端     | 框架                                           | 版本要点                                     |
| ------ | ---------------------------------------------- | -------------------------------------------- |
| 前端   | Next.js 16 · React 19 · Tailwind v4            | Turbopack 驱动 dev/build；shadcn + Base UI   |
| 后端   | NestJS 11 · Express                            | class-validator / class-transformer 全局启用 |
| 共享层 | `@ai-platform/shared`                          | 源码直出（`main` 直接指向 `src/index.ts`）   |
| 工具链 | pnpm 11 · TypeScript 6 · ESLint 9 · Prettier 3 | husky 9 · commitlint 20 · jest 30            |
| 运行时 | Node.js **24+**                                | 见 `.nvmrc`                                  |

## 目录规范

```
ai-platform/
├─ apps/
│  ├─ web/                # Next.js 前端（App Router，路径别名 @/*）
│  │  ├─ app/             # 页面（layout.tsx / page.tsx / 子路由目录）
│  │  ├─ components/      # 组件；components/ui 存放 shadcn 生成的组件
│  │  ├─ hooks/           # 自定义 hooks
│  │  └─ lib/             # 前端工具函数（cn 等）
│  └─ api/                # NestJS 后端
│     └─ src/             # 按业务模块组织（如 src/health）
├─ packages/
│  ├─ shared/             # 跨端类型/常量/DTO；无构建步骤，源码直出
│  ├─ tsconfig/           # 共享 tsconfig 预设：base / nextjs / nestjs
│  └─ eslint-config/      # 共享 ESLint 预设：base / next / nest
```

### 职责分离原则（重要）

- **通用内容**（跨前后端共享的类型、常量、DTO）放 `packages/shared`。
- **纯前端**（组件、页面、样式）放 `apps/web`。
- **纯后端**（Controller / Service / Module）放 `apps/api`。
- **工具链**（Prettier / husky / commitlint / TS / Node 类型）声明在**根**。
- **框架专属依赖**（Next、Nest、React、jest 等）声明在**各自 app**，不上提根目录。

## 前后端联调机制

- 后端在 `main.ts` 里统一挂 `API_PREFIX`（值来自 `@ai-platform/shared`，当前为 `/api`），并启用全局 `ValidationPipe({ whitelist: true, transform: true })`。
- 前端 `next.config.ts` 通过 `rewrites` 把 `/api/*` 反代到 `API_URL`（默认 `http://localhost:3001`），因此**开发期不需要开 CORS**，浏览器只见同源请求。
- 修改 `API_PREFIX` 要同步影响两端；仅在 `packages/shared/src/index.ts` 修改，重启前后端即可。
- `@ai-platform/shared` 通过 Next 的 `transpilePackages` 加载，改动共享包**无需重新 build**，热更新即可。

## 常用脚本

根目录（会递归到所有子包）：

```bash
pnpm dev          # 并行启动前后端
pnpm dev:web      # 仅前端（等价 pnpm --filter @ai-platform/web dev）
pnpm dev:api      # 仅后端（等价 pnpm --filter @ai-platform/api start:dev）
pnpm build        # 全量构建
pnpm lint         # ESLint 全量检查
pnpm lint:fix     # ESLint 自动修复
pnpm typecheck    # TS 全量类型检查
pnpm test         # 所有单测
pnpm format       # Prettier 全量格式化
```

单包内定向执行：

```bash
pnpm --filter @ai-platform/api test               # 后端 jest
pnpm --filter @ai-platform/api test -- health     # 只跑名字含 health 的用例
pnpm --filter @ai-platform/api test:e2e           # e2e（配置见 apps/api/test/jest-e2e.json）
pnpm --filter @ai-platform/api test:cov           # 带覆盖率
pnpm --filter @ai-platform/web build              # 仅前端构建
```

后端 jest 配置内嵌在 [apps/api/package.json](apps/api/package.json)（`rootDir: src`，`testRegex: .*\.spec\.ts$`）。

## 环境变量

- 后端：拷贝 [apps/api/.env.example](apps/api/.env.example) 为 `apps/api/.env`。
- 前端：拷贝 [apps/web/.env.example](apps/web/.env.example) 为 `apps/web/.env.local`；暴露给浏览器的变量必须以 `NEXT_PUBLIC_` 前缀。

## 编码约束

- **TypeScript 严格模式** + `noUncheckedIndexedAccess`（见 [packages/tsconfig/base.json](packages/tsconfig/base.json)），禁止使用 `any`，复杂类型定义 `interface`。
- **模块解析** 使用 `moduleResolution: "bundler"`，导入路径不写 `.js` 后缀。
- **前端别名** `@/*` 指向 `apps/web` 根目录（见 [apps/web/tsconfig.json](apps/web/tsconfig.json)），shadcn 的额外别名见 [apps/web/components.json](apps/web/components.json)（`@/components`、`@/lib/utils`、`@/components/ui`、`@/hooks`）。
- **UI 组件** 优先使用 shadcn（`base-nova` 风格 + `neutral` baseColor + `lucide` 图标）。可通过配置好的 shadcn MCP（见 [.mcp.json](.mcp.json)）查询、添加组件。
- **接口响应** 统一 `{ code, data, message }` 结构。
- **日期处理** 统一 `dayjs`，避免原生 `Date`。
- 组件统一使用箭头函数 + 解构赋值。

## 提交规范

启用 husky + commitlint（[commitlint.config.mjs](commitlint.config.mjs)），遵循 Conventional Commits：

```
<type>(<scope>): <subject>

feat(web): 新增登录页
fix(api): 修复 health 接口时区问题
chore(deps): 升级 pnpm 到 11.5
```

- 允许的 `type`：`feat` `fix` `docs` `style` `refactor` `perf` `test` `build` `ci` `chore` `revert`。
- `scope` 常用值：`web` / `api` / `shared` / `tsconfig` / `eslint-config` / `deps`，可留空。
- lint-staged 在 pre-commit 会对暂存文件跑 `prettier --write` + `eslint --fix`（`*.{ts,tsx,js,jsx,mjs,cjs}`）。

## 目录变更须知

任何涉及目录**新建 / 调整 / 删除**、或影响 agent 读取项目全局上下文的改动（例如新增 workspace 子包、迁移 `packages/shared` 导出结构、调整 shadcn 别名），完成后须同步更新本文件对应章节，保持文档与工程结构一致。
