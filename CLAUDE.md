# CLAUDE.md

本文件为项目全局规则集。所有条目对 agent 与开发者具有同等约束力。**只写规则，不写业务与实现细节**；实现见代码本身。

## 技术栈

| 端     | 框架                                                                               | 运行时                                 |
| ------ | ---------------------------------------------------------------------------------- | -------------------------------------- |
| 前端   | Next.js 16 · React 19 · Tailwind v4                                                | shadcn (base-nova) + Base UI           |
| 后端   | NestJS 11 · Express                                                                | class-validator / class-transformer    |
| 共享层 | `@ai-platform/shared`                                                              | 源码直出（`main` 指向 `src/index.ts`） |
| 工具链 | pnpm 11 · TypeScript 6 · ESLint 9 · Prettier 3 · husky 9 · commitlint 20 · jest 30 | Node.js **24+**（`.nvmrc`）            |

## 目录规范

```
ai-platform/
├─ apps/
│  ├─ web/                # Next.js 前端（App Router，路径别名 @/*）
│  │  ├─ app/             # 页面
│  │  ├─ components/      # 组件；components/ui 存放 shadcn 生成的组件
│  │  ├─ hooks/           # 自定义 hooks
│  │  └─ lib/             # 前端工具函数（cn 等）
│  └─ api/                # NestJS 后端
│     └─ src/             # 按业务模块组织
├─ packages/
│  ├─ shared/             # 跨端类型/常量/DTO；无构建步骤，源码直出
│  ├─ tsconfig/           # 共享 tsconfig 预设：base / nextjs / nestjs
│  └─ eslint-config/      # 共享 ESLint 预设：base / next / nest
```

### 职责分离

- **通用内容**（跨前后端共享的类型、常量、DTO）放 `packages/shared`。
- **纯前端**（组件、页面、样式）放 `apps/web`。
- **纯后端**（Controller / Service / Module）放 `apps/api`。
- **工具链**（Prettier / husky / commitlint / TS / Node 类型）声明在**根**。
- **框架专属依赖**（Next、Nest、React、jest 等）声明在**各自 app**，不上提根目录。

## 前后端联调

- `API_PREFIX` 定义在 `packages/shared/src/index.ts`，**自带前导 `/`**。拼接 URL / Next rewrites 时**不要再补第二个斜杠**，否则会生成 `//api/...` 导致反代失效。
- 前端通过 `next.config.ts` 的 `rewrites` 反代 `/api/*` 到 `API_URL`。浏览器只见同源请求 → 后端**不开** `cors: true`；需要外部访问时显式配置 origin 白名单，禁止用布尔开关。
- 后端在 `main.ts` 挂 `API_PREFIX` 并全局启用 `ValidationPipe({ whitelist: true, transform: true })`。
- 修改 `API_PREFIX` 只改 `packages/shared/src/index.ts`，两端重启即可（`@ai-platform/shared` 通过 `transpilePackages` 加载，共享包改动无需 build）。

## 编码约束

- **TypeScript 严格模式** + `noUncheckedIndexedAccess`；禁止 `any`；复杂类型定义 `interface`。
- **模块解析** 使用 `moduleResolution: "bundler"`；导入路径不写 `.js` 后缀。
- **前端别名** `@/*` 指向 `apps/web` 根目录；shadcn 别名见 [apps/web/components.json](apps/web/components.json)。
- **组件** 统一使用箭头函数 + 解构赋值。
- **接口响应** 统一 `{ code, data, message }` 结构；新写业务模块起就落地对应的 Interceptor / ExceptionFilter，不要留下裸返回。
- **日期处理** 统一 `dayjs`，禁止原生 `Date`；新写业务模块起就落地，历史遗留代码修改时顺带迁移。
- **死代码识别** 一律先提醒不擅自删除；本次修改产生的无用 import / 未使用变量才可直接删。

## UI 组件约定

- **优先复用 shadcn**（`base-nova` + `neutral` + `lucide`）。缺组件时通过项目已配置的 shadcn MCP（见 [.mcp.json](.mcp.json)）查询、添加。
- 添加 shadcn 组件使用 `pnpm exec shadcn add <name>`，**不要用 `pnpm dlx`** —— dlx 的临时环境不共享 workspace overrides，会命中 zod v3/v4 冲突。
- 组件的尺寸/形状差异**优先用其 `size` / `variant` prop**，不要靠外层 className 覆盖 `h-*` / `w-*`。shadcn 内置样式常绑定在 `data-[size=*]` 选择器上，tailwind-merge 不会剔除，会出现两个高度类同时生效。
- shadcn UI 组件的**基础样式**里不塞跨语义 utility（例如全局 `cursor-pointer`），只在具体 variant 里放。
- 样式在 3 处及以上重复出现时，抽取项目通用组件（如通用图标胶囊、Chip 等），再考虑复用原子类。
- CSS 变量在 Tailwind `@theme` 中**不得自引用**；字体变量必须指向实际的 `next/font` 变量名。

## Next.js App Router 约定

- 静态大数据 / mock 表放服务端模块，**禁止**被 `'use client'` 组件直接 import；查询结果通过 server component 的 props 下发。
- 动态路由的 server `page.tsx` 若已做存在性 / 权限判断，其查询产物必须以 props 下发给 client 组件，不要 client 侧再查一次。
- 虚拟列表 / 长列表等"一屏内可能挂载 N 个链接"的场景，`<Link prefetch={false}>`；预取交给 hover / focus。
- 需要跳转的 shadcn Button 用 `<Link><Button/></Link>`，**不要用 `<Button render={<Link/>}/>`** —— render prop 会覆盖 children 与整棵子树，破坏项目自建 Link 包装内注入的能力（如全局进度条）。
- nav / 入口卡内的 `href` 必须对应实际 `app/` 目录路由，禁止死链。

## React / 性能约定

- 不在 render 阶段写 `ref.current`（react-hooks/refs 会报错）；用 `useEffect` 同步最新值。
- `setTimeout` / `setInterval` 必须成对清理：组件卸载时 clear、下一次触发前 clear。
- 大数组按 id 查询建 `Map` 索引，避免 O(N) `find`；同一份数据不重复扫描。
- 关键路径优先考虑 `useDeferredValue` / `useTransition` 让输入优先响应；大列表用虚拟化，硬编码行高时必须与卡片实测高度绑定或改用不定高实现。

## 依赖 / 工具链

- 通过 `pnpm exec <bin>` 走本地依赖版本，避免 `pnpm dlx` 起临时子进程忽略 workspace overrides。
- pnpm workspace 的 `overrides` / `allowBuilds` / `minimumReleaseAgeExclude` 在 [pnpm-workspace.yaml](pnpm-workspace.yaml) 集中维护，不要下放到子包 `package.json`。

## 常用脚本

根目录（递归到所有子包）：`pnpm dev` `pnpm dev:web` `pnpm dev:api` `pnpm build` `pnpm lint` `pnpm lint:fix` `pnpm typecheck` `pnpm test` `pnpm format`。

单包内定向：`pnpm --filter <pkg> <script>`；后端 e2e 使用 `pnpm --filter @ai-platform/api test:e2e`。

## 环境变量

- 后端 `.env`（拷自 [apps/api/.env.example](apps/api/.env.example)），前端 `.env.local`（拷自 [apps/web/.env.example](apps/web/.env.example)）。
- 暴露给浏览器的变量必须以 `NEXT_PUBLIC_` 前缀。

## 提交规范

遵循 Conventional Commits：`<type>(<scope>): <subject>`。

- 允许的 `type`：`feat` `fix` `docs` `style` `refactor` `perf` `test` `build` `ci` `chore` `revert`。
- 常用 `scope`：`web` / `api` / `shared` / `tsconfig` / `eslint-config` / `deps`，可留空。
- pre-commit 通过 husky + lint-staged 对暂存文件跑 `prettier --write` + `eslint --fix`。

## 自维护触发

以下场景 agent 需**主动**将 CLAUDE.md 与新发现的横切约束做 diff，并向用户提议增补/修改。规则化的判断依据是"这条经验在未来任意新任务中都会复用"，而不是"这次任务的解法"。

- **完成一次 code-review、批量修复、架构重构收尾时**：把本轮沉淀出的、可复用的规则（如新工具链禁忌、组件使用陷阱、性能反模式）与现有章节比对，缺则提议新增，冲突则提议修改。
- **修改目录结构、workspace 子包、shadcn 别名 / 生成规则、共享包导出结构时**：同步更新对应章节。
- **同一条纠正意见在两次以上对话中重复出现时**：提议沉淀为规则，避免第三次再讲。
- **引入 / 移除框架或工具（如切换 Tailwind 大版本、替换 ORM、增删 UI 库）时**：同步"技术栈"表与相关约束。

修改本文件前先向用户说明"新增 / 修改 / 删除了哪些规则、原因是什么"，得到确认后再落笔。禁止把业务、实现细节、具体文件路径写入本文件。
