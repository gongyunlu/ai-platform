import {
  BarChart3,
  BookOpen,
  Braces,
  Bug,
  Code2,
  Compass,
  Cpu,
  Database,
  FileText,
  FlaskConical,
  GitBranch,
  Layout,
  Lightbulb,
  ListChecks,
  Mail,
  Palette,
  PenLine,
  Rocket,
  Search,
  Server,
  Settings,
  Shield,
  Sparkles,
  Terminal,
  TestTube,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export type SkillCategory = "研发" | "测试" | "写作" | "数据" | "产品" | "运维";

export type SkillAgent = "Codex" | "Claude Code";

export interface Skill {
  id: string;
  title: string;
  desc: string;
  category: SkillCategory;
  agent: SkillAgent;
  version: string;
  icon: LucideIcon;
  iconClassName: string;
}

// 六个分类对应的模板，用于批量生成看起来合理的 mock 数据
interface CategoryTemplate {
  category: SkillCategory;
  iconClassName: string;
  entries: Array<{
    title: string;
    desc: string;
    icon: LucideIcon;
  }>;
}

const TEMPLATES: CategoryTemplate[] = [
  {
    category: "研发",
    iconClassName: "bg-gradient-to-br from-sky-500 to-blue-600",
    entries: [
      { title: "代码审查助手", desc: "自动进行代码审查，提供改进建议和最佳实践", icon: Code2 },
      { title: "重构建议器", desc: "识别代码坏味道并给出可执行的重构方案", icon: GitBranch },
      { title: "接口文档生成", desc: "根据代码注释与类型定义生成 OpenAPI 文档", icon: Braces },
      { title: "依赖升级顾问", desc: "评估依赖升级的兼容性风险并生成迁移清单", icon: Rocket },
      { title: "Bug 定位助手", desc: "结合堆栈与日志定位 Bug 根因", icon: Bug },
    ],
  },
  {
    category: "测试",
    iconClassName: "bg-gradient-to-br from-emerald-500 to-teal-600",
    entries: [
      { title: "单测生成器", desc: "根据代码自动生成单元测试用例", icon: TestTube },
      { title: "E2E 场景生成", desc: "根据 PRD 生成端到端测试脚本", icon: FlaskConical },
      { title: "接口自动化", desc: "基于接口契约生成回归测试集", icon: ListChecks },
      { title: "覆盖率分析", desc: "识别未覆盖的关键路径并补齐测试", icon: Shield },
    ],
  },
  {
    category: "写作",
    iconClassName: "bg-gradient-to-br from-violet-500 to-purple-600",
    entries: [
      { title: "周报整理助手", desc: "快速整理工作内容，生成结构化周报", icon: FileText },
      { title: "邮件润色", desc: "把要点扩写为正式且得体的邮件正文", icon: Mail },
      { title: "文章大纲", desc: "根据主题快速搭建可以直接执行的写作大纲", icon: PenLine },
      { title: "技术博客扩写", desc: "把技术要点扩写为完整的技术博客", icon: BookOpen },
    ],
  },
  {
    category: "数据",
    iconClassName: "bg-gradient-to-br from-amber-500 to-orange-600",
    entries: [
      { title: "数据分析提纲", desc: "帮助快速搭建数据分析框架和思路", icon: BarChart3 },
      { title: "SQL 生成器", desc: "自然语言转 SQL 并给出执行计划提示", icon: Database },
      { title: "看板配置助手", desc: "根据业务指标生成 BI 看板方案", icon: Layout },
      { title: "异常指标归因", desc: "定位关键指标异动的可能原因", icon: Compass },
    ],
  },
  {
    category: "产品",
    iconClassName: "bg-gradient-to-br from-fuchsia-500 to-pink-600",
    entries: [
      { title: "需求拆解助手", desc: "将产品需求拆解为可执行的开发任务", icon: Lightbulb },
      { title: "竞品分析大纲", desc: "结构化梳理竞品差异与机会点", icon: Search },
      { title: "PRD 模板生成", desc: "输入一句话产出结构完整的 PRD 草稿", icon: FileText },
      { title: "用户故事编写", desc: "将需求转化为 INVEST 用户故事", icon: Sparkles },
    ],
  },
  {
    category: "运维",
    iconClassName: "bg-gradient-to-br from-slate-500 to-slate-700",
    entries: [
      { title: "运维 Runbook 助手", desc: "生成标准化运维操作手册", icon: Server },
      { title: "告警根因分析", desc: "根据监控数据快速定位告警根因", icon: Cpu },
      { title: "变更前置检查", desc: "自动核对上线前的必备检查项", icon: Settings },
      { title: "脚本编写助手", desc: "根据描述生成 shell / Python 运维脚本", icon: Terminal },
      { title: "主题美化", desc: "调整终端与 IDE 主题的可读性", icon: Palette },
      { title: "工具箱", desc: "常用运维小工具集合", icon: Wrench },
    ],
  },
];

// 生成较大规模的 mock 数据：把模板循环 N 次，追加序号以形成多样的标题
function generateSkills(): Skill[] {
  const list: Skill[] = [];
  const rounds = 40; // 6 * 27 ≈ 160+，总量 ~ 1000 条
  let seq = 0;
  for (let r = 0; r < rounds; r++) {
    for (const tpl of TEMPLATES) {
      for (const entry of tpl.entries) {
        seq++;
        // 通过 seq 派生一个稳定但看似随机的版本号，避免用 Math.random（会破坏 SSR 一致性）
        const major = 1 + ((seq * 3) % 3);
        const minor = (seq * 7) % 10;
        const patch = (seq * 13) % 10;
        list.push({
          id: `skill-${seq}`,
          title: r === 0 ? entry.title : `${entry.title} · ${r + 1}`,
          desc: entry.desc,
          category: tpl.category,
          agent: seq % 2 === 0 ? "Claude Code" : "Codex",
          version: `v${major}.${minor}.${patch}`,
          icon: entry.icon,
          iconClassName: tpl.iconClassName,
        });
      }
    }
  }
  return list;
}

export const SKILLS: Skill[] = generateSkills();

export const CATEGORIES: Array<"全部" | SkillCategory> = [
  "全部",
  "研发",
  "测试",
  "写作",
  "数据",
  "产品",
  "运维",
];

export const AGENTS: Array<"全部" | SkillAgent> = [
  "全部",
  "Codex",
  "Claude Code",
];
