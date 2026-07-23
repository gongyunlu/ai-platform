import { BookOpen, FileText, Play, type LucideIcon } from 'lucide-react';

export type LearnCategory = '研发' | 'SkillHub' | '写作' | '数据' | 'Agent' | '产品';
export type LearnType = '视频' | '案例' | '操作说明';

export const CATEGORIES: Array<'全部' | LearnCategory> = [
  '全部',
  '研发',
  'SkillHub',
  '写作',
  '数据',
  'Agent',
  '产品',
];

export const TYPES: Array<'全部' | LearnType> = ['全部', '视频', '案例', '操作说明'];

export interface Chapter {
  title: string;
  duration: string;
  completed?: boolean;
}

export interface RelatedSkill {
  id: string;
  title: string;
}

export interface LearnItem {
  id: string;
  title: string;
  desc: string;
  category: LearnCategory;
  type: LearnType;
  duration: string;
  chapters: Chapter[];
  relatedAgents: string[];
  relatedSkills: RelatedSkill[];
}

// 卡片图标由类型派生，不写进数据表以避免持有 LucideIcon 组件对象、
// 让详情页 mock 数据始终保持可序列化（RSC → Client 边界更清爽）
const TYPE_ICON: Record<LearnType, LucideIcon> = {
  视频: Play,
  案例: FileText,
  操作说明: BookOpen,
};

export const getTypeIcon = (type: LearnType): LucideIcon => TYPE_ICON[type];

export const LEARN_ITEMS: LearnItem[] = [
  {
    id: 'codex-quickstart',
    title: 'Codex 从安装到提交',
    desc: '完整演示 Codex 的安装配置和使用流程',
    category: 'Agent',
    type: '视频',
    duration: '15分钟',
    chapters: [
      { title: '环境准备', duration: '2:30', completed: true },
      { title: '安装 Codex', duration: '3:15', completed: true },
      { title: '配置项目', duration: '4:20' },
      { title: '编写代码', duration: '3:45' },
      { title: '提交代码', duration: '1:40' },
    ],
    relatedAgents: ['Codex'],
    relatedSkills: [
      { id: 'skill-1', title: '代码审查助手' },
      { id: 'skill-6', title: '单测生成器' },
    ],
  },
  {
    id: 'skillhub-guide',
    title: 'SkillHub 使用指南',
    desc: '快速了解 SkillHub 的搜索、安装与使用流程',
    category: 'SkillHub',
    type: '操作说明',
    duration: '10分钟',
    chapters: [
      { title: '进入 SkillHub', duration: '1:20', completed: true },
      { title: '搜索合适的 Skill', duration: '2:10' },
      { title: '安装到对应 Agent', duration: '3:00' },
      { title: '在对话中调用 Skill', duration: '3:30' },
    ],
    relatedAgents: ['Codex', 'Claude Code'],
    relatedSkills: [
      { id: 'skill-1', title: '代码审查助手' },
      { id: 'skill-10', title: '周报整理助手' },
    ],
  },
  {
    id: 'code-review-case',
    title: '代码审查实战案例',
    desc: '通过真实项目案例讲解代码审查中的常见问题与改进思路',
    category: '研发',
    type: '案例',
    duration: '20分钟',
    chapters: [
      { title: '案例背景', duration: '3:00', completed: true },
      { title: '发现的关键问题', duration: '5:30' },
      { title: '改进建议与落地', duration: '6:20' },
      { title: '复盘要点', duration: '5:10' },
    ],
    relatedAgents: ['Claude Code'],
    relatedSkills: [
      { id: 'skill-1', title: '代码审查助手' },
      { id: 'skill-2', title: '重构建议器' },
    ],
  },
  {
    id: 'data-analysis-intro',
    title: '数据分析入门教程',
    desc: '从零搭建一套可复用的数据分析工作流',
    category: '数据',
    type: '视频',
    duration: '25分钟',
    chapters: [
      { title: '明确分析目标', duration: '3:20', completed: true },
      { title: '搭建数据管道', duration: '6:00' },
      { title: '常用指标计算', duration: '7:40' },
      { title: '可视化与结论输出', duration: '8:00' },
    ],
    relatedAgents: ['Codex'],
    relatedSkills: [
      { id: 'skill-14', title: '数据分析提纲' },
      { id: 'skill-15', title: 'SQL 生成器' },
    ],
  },
  {
    id: 'weekly-report-best-practice',
    title: '周报撰写最佳实践',
    desc: '把工作记录整理成结构化、可交付的周报',
    category: '写作',
    type: '案例',
    duration: '12分钟',
    chapters: [
      { title: '素材收集与整理', duration: '2:40', completed: true },
      { title: '结构化模板落地', duration: '4:10' },
      { title: '润色与复核', duration: '5:10' },
    ],
    relatedAgents: ['Claude Code'],
    relatedSkills: [
      { id: 'skill-10', title: '周报整理助手' },
      { id: 'skill-11', title: '邮件润色' },
    ],
  },
  {
    id: 'agent-config-guide',
    title: 'Agent 配置完全指南',
    desc: '从零到一配置 Codex 与 Claude Code 的完整流程',
    category: 'Agent',
    type: '操作说明',
    duration: '18分钟',
    chapters: [
      { title: '账号与授权准备', duration: '3:00', completed: true },
      { title: '安装 Codex', duration: '4:20' },
      { title: '安装 Claude Code', duration: '4:40' },
      { title: '常见问题排查', duration: '6:00' },
    ],
    relatedAgents: ['Codex', 'Claude Code'],
    relatedSkills: [
      { id: 'skill-1', title: '代码审查助手' },
      { id: 'skill-6', title: '单测生成器' },
    ],
  },
];

const LEARN_BY_ID = new Map<string, LearnItem>(LEARN_ITEMS.map((item) => [item.id, item]));

export const getLearnById = (id: string): LearnItem | undefined => LEARN_BY_ID.get(id);
