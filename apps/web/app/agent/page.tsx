import { Code2, Download, Sparkles } from 'lucide-react';

import { IconBadge } from '@/components/icon-badge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

type AgentCard = {
  name: string;
  desc: string;
  tags: string[];
  icon: React.ComponentType<{ className?: string }>;
  iconClassName: string;
};

const AGENTS: AgentCard[] = [
  {
    name: 'Codex',
    desc: '强大的代码生成和理解能力，支持多种编程语言，帮助开发者提高编码效率',
    tags: ['代码生成', '代码补全', '多语言支持'],
    icon: Code2,
    iconClassName: 'bg-linear-to-br from-sky-500 to-blue-600',
  },
  {
    name: 'Claude Code',
    desc: '智能代码助手，提供代码审查、重构建议、bug 修复等全方位支持',
    tags: ['代码审查', '重构', 'Bug 修复'],
    icon: Sparkles,
    iconClassName: 'bg-linear-to-br from-fuchsia-500 to-pink-600',
  },
];

const TIPS = [
  '点击“一键安装配置”按钮即可自动完成 Agent 的安装和配置',
  '安装完成后，可在对应的开发环境中直接使用',
  '如遇到问题，请查看学习中心的教程或联系技术支持',
];

export default function AgentPage() {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 pt-16 pb-24">
      <header className="text-center">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Agent</h1>
        <p className="mt-4 text-base text-muted-foreground">
          一键安装配置 AI 智能助手，提升您的工作效率
        </p>
      </header>

      <div className="mt-12 grid grid-cols-1 items-stretch gap-6 md:grid-cols-2">
        {AGENTS.map((agent) => (
          <Card key={agent.name} className="p-6">
            <CardContent className="flex h-full flex-col p-0">
              <div className="flex items-start gap-4">
                <IconBadge icon={agent.icon} size="lg" className={agent.iconClassName} />
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-xl font-semibold tracking-tight">{agent.name}</h3>
                  <p className="mt-2 line-clamp-2 min-h-12 text-sm leading-6 text-muted-foreground">
                    {agent.desc}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {agent.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* TODO: 接入一键安装接口后，为按钮补齐 onClick 与状态 */}
              <Button size="lg" className="mt-8 h-11 w-full rounded-xl">
                <Download className="size-4" />
                <span className="ml-1">一键安装配置</span>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-8 bg-muted/60 p-6">
        <CardContent className="p-0">
          <h4 className="text-sm font-semibold">使用提示</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {TIPS.map((tip) => (
              <li key={tip} className="flex gap-2">
                <span className="mt-2 inline-block size-1 shrink-0 rounded-full bg-muted-foreground/60" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </section>
  );
}
