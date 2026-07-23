import {
  BarChart3,
  BookOpen,
  Code2,
  FileText,
  Headphones,
  Puzzle,
  Play,
  Search,
  Wrench,
} from 'lucide-react';

import { IconBadge } from '@/components/icon-badge';
import { Link } from '@/components/link';
import { Button } from '@/components/ui/button';

type Scenario = {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

const SCENARIOS_ROW_1: Scenario[] = [
  { label: '写代码', icon: Code2 },
  { label: '写周报', icon: FileText },
  { label: '做汇报', icon: BarChart3 },
  { label: '数据分析', icon: BarChart3 },
  { label: '找内部 Skill', icon: Search },
  { label: '安装 Codex', icon: Wrench },
  { label: '测试用例', icon: FileText },
];

const SCENARIOS_ROW_2: Scenario[] = [
  { label: '看教程', icon: Play },
  { label: '需求拆解', icon: Puzzle },
  { label: '客服话术', icon: Headphones },
];

type RecommendPath = {
  label: string;
  primary?: boolean;
};

const RECOMMEND_PATHS: RecommendPath[] = [
  { label: '写代码作战页', primary: true },
  { label: '搜索内部 Skill' },
  { label: '一键安装 Agent' },
];

type EntryCard = {
  title: string;
  desc: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  iconClassName: string;
};

const ENTRIES: EntryCard[] = [
  {
    title: 'Agent',
    desc: 'Codex 与 Claude Code 的一键安装配置',
    href: '/agent',
    icon: Wrench,
    iconClassName: 'bg-linear-to-br from-sky-500 to-blue-600',
  },
  {
    title: 'SkillHub',
    desc: '内部 Skill 搜索、安装使用、发布更新',
    href: '/skill-hub',
    icon: Search,
    iconClassName: 'bg-linear-to-br from-fuchsia-500 to-pink-600',
  },
  {
    title: '学习中心',
    desc: '操作说明、使用案例、视频教程',
    href: '/learning-center',
    icon: BookOpen,
    iconClassName: 'bg-linear-to-br from-orange-500 to-amber-600',
  },
];

const ScenarioChip = ({ icon: Icon, label }: Scenario) => {
  return (
    <Button
      type="button"
      variant="outline"
      className="h-auto rounded-full px-4 py-2 shadow-xs transition-all hover:-translate-y-0.5 hover:shadow-sm"
    >
      <Icon className="text-muted-foreground" />
      {label}
    </Button>
  );
};

export default function HomePage() {
  return (
    <div>
      <section className="mx-auto flex w-full max-w-5xl flex-col items-center px-6 pt-20 pb-16 text-center">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          从工作场景进入公司 AI 能力地图
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground">
          选择您的工作场景，平台会聚合推荐对应的 Agent、内部 Skill、教程和案例， 帮助您快速上手
        </p>

        <div className="mt-12 flex w-full flex-col items-center gap-3">
          <div className="flex flex-wrap justify-center gap-3">
            {SCENARIOS_ROW_1.map((item) => (
              <ScenarioChip key={item.label} {...item} />
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {SCENARIOS_ROW_2.map((item) => (
              <ScenarioChip key={item.label} {...item} />
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center gap-3">
          <span className="text-xs font-medium tracking-wider text-muted-foreground">
            推荐开始路径
          </span>
          <div className="flex flex-wrap justify-center gap-3">
            {RECOMMEND_PATHS.map((path) => (
              <span
                key={path.label}
                className={
                  path.primary
                    ? 'rounded-full bg-muted px-4 py-1.5 text-sm text-foreground'
                    : 'rounded-full bg-muted/60 px-4 py-1.5 text-sm text-muted-foreground'
                }
              >
                {path.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 px-6 pb-24 md:grid-cols-3">
        {ENTRIES.map((entry) => (
          <Link
            key={entry.title}
            href={entry.href}
            className="group rounded-2xl bg-card p-6 ring-1 ring-foreground/10 shadow-xs transition-all hover:-translate-y-1 hover:ring-foreground/20 hover:shadow-lg"
          >
            <IconBadge icon={entry.icon} size="lg" className={entry.iconClassName} />
            <h3 className="mt-16 text-xl font-semibold tracking-tight">{entry.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{entry.desc}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
