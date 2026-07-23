'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Check, ChevronLeft, Clock, Copy, File as FileIcon, User } from 'lucide-react';

import { Link } from '@/components/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MarkdownContent } from '@/components/markdown-content';
import type { SkillDetail } from '../skill-detail';

interface Props {
  detail: SkillDetail;
}

// 每次点击复制持续 1.5s "已复制" 反馈；复用同一个 timer，避免快速切换时
// 前一次的 setTimeout 提前把新一次的状态清掉、以及组件卸载时残留定时器。
const COPIED_HINT_DURATION = 1500;

const useCopy = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  const copy = useCallback(async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
      timerRef.current = window.setTimeout(() => {
        setCopiedKey(null);
        timerRef.current = null;
      }, COPIED_HINT_DURATION);
    } catch {
      // 剪贴板 API 不可用时静默失败，占位页不做额外提示
    }
  }, []);

  return { copiedKey, copy };
};

interface InstallCardProps {
  title: string;
  description: string;
  copyLabel: string;
  copyKey: string;
  copyText: string;
  variant?: 'default' | 'outline';
  copiedKey: string | null;
  onCopy: (key: string, text: string) => void;
}

const InstallCard = ({
  title,
  description,
  copyLabel,
  copyKey,
  copyText,
  variant = 'default',
  copiedKey,
  onCopy,
}: InstallCardProps) => {
  const copied = copiedKey === copyKey;
  return (
    <Card className="p-5">
      <CardContent className="p-0">
        <h3 className="text-base font-semibold">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        <Button variant={variant} className="mt-4 w-full" onClick={() => onCopy(copyKey, copyText)}>
          {copied ? (
            <>
              <Check className="size-4" />
              已复制
            </>
          ) : (
            <>
              <Copy className="size-4" />
              {copyLabel}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export const SkillDetailClient = ({ detail }: Props) => {
  const { skill, maintainer, readme, files, versions } = detail;
  const { copiedKey, copy } = useCopy();

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <nav className="mb-4 flex items-center gap-1 text-sm text-muted-foreground">
        <Link href="/skill-hub" className="inline-flex items-center gap-1 hover:text-foreground">
          <ChevronLeft className="size-4" />
          技能
        </Link>
        <span className="px-1">/</span>
        <span className="text-foreground">{skill.title}</span>
      </nav>

      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">{skill.title}</h1>
        <p className="mt-2 text-base text-muted-foreground">{skill.desc}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge variant="secondary">{skill.category}</Badge>
          <Badge variant="secondary">{skill.agent}</Badge>
          <Badge className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
            {skill.version}
          </Badge>
        </div>
        <div className="mt-4 flex items-center gap-1.5 text-sm text-muted-foreground">
          <User className="size-4" />
          <span>维护者: {maintainer}</span>
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Tabs defaultValue="overview" className="min-w-0">
          <TabsList variant="line">
            <TabsTrigger value="overview">概览</TabsTrigger>
            <TabsTrigger value="files">文件</TabsTrigger>
            <TabsTrigger value="versions">版本</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="pt-6">
            <Card className="p-6">
              <CardContent className="p-0">
                <MarkdownContent content={readme} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="files" className="pt-6">
            <Card className="p-6">
              <CardContent className="p-0">
                <h2 className="text-lg font-semibold">文件列表 ({files.length} 个文件)</h2>
                <ul className="mt-4 divide-y divide-border/60">
                  {files.map((file) => (
                    <li key={file.path} className="flex items-center justify-between py-3 text-sm">
                      <span className="inline-flex items-center gap-2 font-mono text-foreground">
                        <FileIcon className="size-4 text-muted-foreground" />
                        {file.path}
                      </span>
                      <span className="text-muted-foreground">{file.size}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="versions" className="pt-6">
            <Card className="p-6">
              <CardContent className="p-0">
                <h2 className="text-lg font-semibold">版本历史</h2>
                <ul className="mt-4 space-y-3">
                  {versions.map((v) => (
                    <li key={v.version} className="rounded-xl border border-border/70 p-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{v.version}</span>
                        {v.isCurrent ? <Badge>当前版本</Badge> : null}
                      </div>
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        <span>{v.fileCount} 个文件</span>
                        <span>{v.totalSize}</span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="size-3.5" />
                          {v.publishedAt}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <InstallCard
            title="对话安装"
            description="复制下方提示词，在对话中使用"
            copyLabel="复制提示词"
            copyKey="prompt"
            copyText={detail.installPrompt}
            copiedKey={copiedKey}
            onCopy={copy}
          />
          <InstallCard
            title="命令行安装"
            description="使用 CLI 工具快速安装"
            copyLabel="复制 CLI 命令"
            copyKey="cli"
            copyText={detail.installCommand}
            variant="outline"
            copiedKey={copiedKey}
            onCopy={copy}
          />
        </aside>
      </div>
    </div>
  );
};
