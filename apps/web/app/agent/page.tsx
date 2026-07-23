import { Code2, Download, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

type AgentCard = {
  name: string;
  desc: string;
  tags: string[];
  icon: React.ComponentType<{ className?: string }>;
  iconClassName: string;
};

const AGENTS: AgentCard[] = [
  {
    name: "Codex",
    desc: "强大的代码生成和理解能力，支持多种编程语言，帮助开发者提高编码效率",
    tags: ["代码生成", "代码补全", "多语言支持"],
    icon: Code2,
    iconClassName: "bg-gradient-to-br from-sky-500 to-blue-600",
  },
  {
    name: "Claude Code",
    desc: "智能代码助手，提供代码审查、重构建议、bug 修复等全方位支持",
    tags: ["代码审查", "重构", "Bug 修复"],
    icon: Sparkles,
    iconClassName: "bg-gradient-to-br from-fuchsia-500 to-pink-600",
  },
];

const TIPS = [
  "点击“一键安装配置”按钮即可自动完成 Agent 的安装和配置",
  "安装完成后，可在对应的开发环境中直接使用",
  "如遇到问题，请查看学习中心的教程或联系技术支持",
];

export default function AgentPage() {
  return (
    <div>
      <section className="mx-auto w-full max-w-6xl px-6 pt-16 pb-24">
        <header className="text-center">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Agent
          </h1>
          <p className="mt-4 text-base text-muted-foreground">
            一键安装配置 AI 智能助手，提升您的工作效率
          </p>
        </header>

        <div className="mt-12 grid grid-cols-1 items-stretch gap-6 md:grid-cols-2">
          {AGENTS.map((agent) => (
            <article
              key={agent.name}
              className="flex flex-col rounded-2xl border border-border/70 bg-card p-6 shadow-xs"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`inline-flex size-12 shrink-0 items-center justify-center rounded-xl text-white shadow-sm ${agent.iconClassName}`}
                >
                  <agent.icon className="size-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-xl font-semibold tracking-tight">
                    {agent.name}
                  </h3>
                  <p className="mt-2 line-clamp-2 min-h-12 text-sm leading-6 text-muted-foreground">
                    {agent.desc}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex h-7 gap-2 overflow-hidden">
                {agent.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex max-w-full shrink-0 items-center truncate rounded-full border border-border/70 bg-background px-3 text-xs text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <Button
                size="lg"
                className="mt-8 h-11 w-full rounded-xl bg-foreground text-background hover:bg-foreground/90"
              >
                <Download className="size-4" />
                <span className="ml-1">一键安装配置</span>
              </Button>
            </article>
          ))}
        </div>

        <aside className="mt-8 rounded-2xl border border-border/70 bg-muted/60 p-6">
          <h4 className="text-sm font-semibold">使用提示</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {TIPS.map((tip) => (
              <li key={tip} className="flex gap-2">
                <span className="mt-2 inline-block size-1 shrink-0 rounded-full bg-muted-foreground/60" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </aside>
      </section>
    </div>
  );
}
