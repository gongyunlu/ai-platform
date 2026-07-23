import { getSkillById, type Skill } from './skills';

export interface SkillFile {
  path: string;
  size: string;
}

export interface SkillVersion {
  version: string;
  fileCount: number;
  totalSize: string;
  publishedAt: string;
  isCurrent?: boolean;
}

export interface SkillDetail {
  skill: Skill;
  maintainer: string;
  readme: string;
  files: SkillFile[];
  versions: SkillVersion[];
  installPrompt: string;
  installCommand: string;
}

const MAINTAINERS = ['张三', '李四', '王五', '赵六', '钱七'];

// 通过 id 派生稳定的 mock 内容，避免 Math.random 破坏 SSR 一致性
const seedFromId = (id: string): number => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return hash;
};

const buildReadme = (skill: Skill): string => {
  return `# ${skill.title}

## 功能说明

${skill.desc}，提供以下功能：

- 代码规范检查
- 性能优化建议
- 安全漏洞检测
- 最佳实践推荐

## 使用示例

\`\`\`bash
/skill ${skill.id} path/to/your/code
\`\`\`

审查结果将包含：
1. 代码质量评分
2. 具体问题列表
3. 改进建议
`;
};

const buildFiles = (skill: Skill, seed: number): SkillFile[] => {
  const baseFiles: SkillFile[] = [
    { path: 'README.md', size: `${((seed % 30) / 10 + 1.5).toFixed(1)} KB` },
    { path: 'config.json', size: `${((seed % 20) / 10 + 0.8).toFixed(1)} KB` },
    { path: 'scripts/', size: '-' },
    {
      path: `scripts/${skill.agent === 'Codex' ? 'check.py' : 'review.ts'}`,
      size: `${((seed % 50) / 10 + 3).toFixed(1)} KB`,
    },
  ];
  return baseFiles;
};

const buildVersions = (skill: Skill): SkillVersion[] => {
  const current = skill.version;
  // current 形如 v1.2.0，派生历史版本
  const match = current.match(/^v(\d+)\.(\d+)\.(\d+)$/);
  if (!match) {
    return [
      {
        version: current,
        fileCount: 4,
        totalSize: '15.2 KB',
        publishedAt: '2024-05-20',
        isCurrent: true,
      },
    ];
  }
  const [, majorStr, minorStr] = match;
  const major = Number(majorStr);
  const minor = Number(minorStr);
  const versions: SkillVersion[] = [
    {
      version: current,
      fileCount: 4,
      totalSize: '15.2 KB',
      publishedAt: '2024-05-20',
      isCurrent: true,
    },
  ];
  if (minor > 0) {
    versions.push({
      version: `v${major}.${Math.max(minor - 1, 0)}.0`,
      fileCount: 3,
      totalSize: '12.8 KB',
      publishedAt: '2024-04-15',
    });
  }
  if (major > 1 || minor > 0) {
    versions.push({
      version: `v${Math.max(major - 1, 1)}.0.0`,
      fileCount: 3,
      totalSize: '10.5 KB',
      publishedAt: '2024-03-01',
    });
  }
  return versions;
};

export const getSkillDetail = (id: string): SkillDetail | null => {
  const skill = getSkillById(id);
  if (!skill) return null;

  const seed = seedFromId(id);
  return {
    skill,
    maintainer: MAINTAINERS[seed % MAINTAINERS.length] ?? '张三',
    readme: buildReadme(skill),
    files: buildFiles(skill, seed),
    versions: buildVersions(skill),
    installPrompt: `请使用 ${skill.title} 帮我 ${skill.desc}。`,
    installCommand: `ai-platform skill install ${skill.id}`,
  };
};
