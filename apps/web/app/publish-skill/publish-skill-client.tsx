'use client';

import { useRef, useState, type ChangeEvent, type DragEvent, type FormEvent } from 'react';
import { Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

const CATEGORY_OPTIONS = ['研发', '测试', '写作', '数据', '产品', '运维'] as const;

export const PublishSkillClient = () => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (next: File | null) => {
    setFile(next);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFile(e.target.files?.[0] ?? null);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files?.[0] ?? null);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: 接入发布接口后落地校验与提交逻辑
  };

  return (
    <section className="mx-auto w-full max-w-3xl px-6 pt-12 pb-24">
      <header>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">发布 Skill</h1>
        <p className="mt-3 text-base text-muted-foreground">
          提交您的 Skill 到内部技能库，供团队使用
        </p>
      </header>

      <Card className="mt-10 p-8">
        <CardContent className="p-0">
          <form onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="skill-file">
                上传 Skill 文件 <span className="text-destructive">*</span>
              </Label>
              <div
                role="button"
                tabIndex={0}
                aria-label="拖拽文件到此处或点击上传"
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    fileInputRef.current?.click();
                  }
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className={cn(
                  'flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-12 text-center transition-colors',
                  'focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none',
                  dragOver
                    ? 'border-foreground/40 bg-muted/60'
                    : 'border-border hover:border-foreground/30 hover:bg-muted/40',
                )}
              >
                <Upload className="size-8 text-muted-foreground" />
                <p className="mt-3 text-sm text-muted-foreground">
                  {file ? file.name : '拖拽文件到此处或点击上传'}
                </p>
                <input
                  id="skill-file"
                  ref={fileInputRef}
                  type="file"
                  className="sr-only"
                  onChange={handleFileChange}
                />
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <Label htmlFor="skill-id">
                唯一标识符 <span className="text-destructive">*</span>
              </Label>
              <Input
                id="skill-id"
                name="id"
                required
                placeholder="例如: code-review-assistant"
                className="h-11"
              />
            </div>

            <div className="mt-6 space-y-2">
              <Label htmlFor="skill-name">
                显示名称 <span className="text-destructive">*</span>
              </Label>
              <Input
                id="skill-name"
                name="name"
                required
                placeholder="例如: 代码审查助手"
                className="h-11"
              />
            </div>

            <div className="mt-6 space-y-2">
              <Label htmlFor="skill-version">
                版本号 <span className="text-destructive">*</span>
              </Label>
              <Input
                id="skill-version"
                name="version"
                required
                placeholder="例如: v1.0.0"
                className="h-11"
              />
            </div>

            <div className="mt-6 space-y-2">
              <Label htmlFor="skill-category">分类</Label>
              <Select name="category">
                <SelectTrigger id="skill-category" size="lg" className="w-full rounded-lg">
                  <SelectValue placeholder="请选择分类" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORY_OPTIONS.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="mt-6 space-y-2">
              <Label htmlFor="skill-desc">描述</Label>
              <Textarea
                id="skill-desc"
                name="description"
                rows={3}
                placeholder="简要描述 Skill 的功能和用途"
              />
            </div>

            <div className="mt-6 space-y-2">
              <Label htmlFor="skill-changelog">变更说明</Label>
              <Textarea
                id="skill-changelog"
                name="changelog"
                rows={3}
                placeholder="本次更新的主要变更内容"
              />
            </div>

            <div className="mt-8 flex items-center gap-3">
              <Button type="submit" size="lg" className="h-11 flex-1 rounded-xl">
                提交发布
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="h-11 rounded-xl px-6"
                onClick={() => router.back()}
              >
                取消
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  );
};
