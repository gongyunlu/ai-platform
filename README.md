# AI Platform

基于 pnpm workspace 的全栈 monorepo：**Next.js 前端 + NestJS 后端**，用于学习和搭建 AI 应用。

## 技术栈

| 端 | 框架 | 主要版本 |
| --- | --- | --- |
| 前端 | Next.js 16 · React 19 · Tailwind v4 | Turbopack (dev/build) |
| 后端 | NestJS 11 · Express | class-validator / class-transformer |
| 语言 | TypeScript 7 | 严格模式 + `moduleResolution: bundler` |
| 工具链 | pnpm 11 · ESLint 10 · Prettier 3 · husky 9 · commitlint 20 · jest 30 | Node 22 |

## 目录结构

```
ai-platform/
├─ apps/
│  ├─ web/                # Next.js 前端应用
│  └─ api/                # NestJS 后端应用
├─ packages/
│  ├─ shared/             # 跨端类型 / 常量 / DTO（源码直出，无需构建）
│  ├─ tsconfig/           # 共享 tsconfig 预设（base / nextjs / nestjs）
│  └─ eslint-config/      # 共享 ESLint 预设（next / nest）
├─ .husky/                # Git hooks（pre-commit / commit-msg）
├─ .prettierrc.json       # 全局 Prettier 配置
├─ commitlint.config.mjs  # Conventional Commits 校验
└─ pnpm-workspace.yaml
```

### 职责分离原则

- **通用内容**（跨前后端共享的类型、常量、DTO）放 `packages/shared`。
- **纯前端**（组件、页面、样式）放 `apps/web`。
- **纯后端**（Controller / Service / Module）放 `apps/api`。
- **工具链**（Prettier / husky / commitlint / TS / Node 类型）声明在**根**。
- **框架专属依赖**（Next、Nest、React、jest 等）声明在**各自 app**。

## 环境准备

- Node.js **24+**（见 `.nvmrc`，推荐 `nvm use`）
- pnpm **11+**（`corepack enable` 即可）

## 快速开始

```bash
# 安装依赖（首次会自动初始化 husky）
pnpm install

# 拷贝环境变量
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local

# 同时启动前后端
pnpm dev

# 或分别启动
pnpm --filter @ai-platform/api start:dev
pnpm --filter @ai-platform/web dev
```

前端 [http://localhost:3000](http://localhost:3000)，后端 [http://localhost:3001](http://localhost:3001)。前端通过 `next.config.ts` 的 rewrites 反代 `/api/*` 到后端，无需开 CORS。

## 常用脚本

在根目录执行，会递归到所有子包：

```bash
pnpm lint         # ESLint 全量检查
pnpm format       # Prettier 全量格式化
pnpm typecheck    # TS 全量类型检查
pnpm test         # 运行所有单元测试
pnpm build        # 构建所有可构建的子包
```

## 提交规范

启用了 husky + commitlint，遵循 [Conventional Commits](https://www.conventionalcommits.org/)：

```
<type>(<scope>): <subject>

feat(web): 新增登录页
fix(api): 修复 health 接口时间戳时区问题
chore(deps): 升级 pnpm 到 11.5
```

允许的 type：`feat` `fix` `docs` `style` `refactor` `perf` `test` `build` `ci` `chore` `revert`。

## 常见问题

**Q：IDE 报"找不到文件 @ai-platform/tsconfig/nextjs.json"？**
运行一次 `pnpm install` 让 workspace 软链生效，然后在 VSCode 里执行 `TypeScript: Restart TS Server`。

**Q：能否在子包各自装 typescript？**
不推荐。工程语言版本必须在整个 monorepo 里统一，避免类型解析不一致。特殊情况才在子包覆盖。
