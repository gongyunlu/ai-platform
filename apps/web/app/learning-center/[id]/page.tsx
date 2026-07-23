import { notFound } from 'next/navigation';
import { CheckCircle2, ChevronLeft, Circle } from 'lucide-react';

import { Link } from '@/components/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { getLearnById } from '../learning-center';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function LearnDetailPage({ params }: PageProps) {
  const { id } = await params;
  const item = getLearnById(id);
  if (!item) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <nav className="mb-6 flex items-center gap-1 text-sm text-muted-foreground">
        <Link
          href="/learning-center"
          className="inline-flex items-center gap-1 hover:text-foreground"
        >
          <ChevronLeft className="size-4" />
          学习中心
        </Link>
        <span className="px-1">/</span>
        <span className="text-foreground">{item.title}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0">
          {/* 视频占位：仅用 <video>，暂不接入实际源 */}
          <video controls className="aspect-video w-full rounded-2xl bg-black" />

          <header className="mt-6">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{item.title}</h1>
            <p className="mt-3 text-base text-muted-foreground">{item.desc}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge variant="outline">{item.category}</Badge>
              <Badge variant="secondary">{item.duration}</Badge>
            </div>
          </header>

          <Card className="mt-8 p-6">
            <CardContent className="p-0">
              <h2 className="text-base font-semibold">关联资源</h2>

              <div className="mt-4">
                <div className="text-xs text-muted-foreground">推荐 Agent</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {item.relatedAgents.map((name) => (
                    <Link
                      key={name}
                      href="/agent"
                      className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 rounded-full"
                    >
                      <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                        {name}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="mt-5">
                <div className="text-xs text-muted-foreground">推荐 Skill</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {item.relatedSkills.map((skill) => (
                    <Link
                      key={skill.id}
                      href={`/skill-hub/${skill.id}`}
                      className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 rounded-full"
                    >
                      <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                        {skill.title}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Card className="p-5">
            <CardContent className="p-0">
              <h2 className="text-base font-semibold">章节列表</h2>
              <ul className="mt-4 space-y-1">
                {item.chapters.map((chapter, index) => (
                  <li
                    key={chapter.title}
                    className={cn(
                      'flex items-start gap-3 rounded-xl px-3 py-2.5',
                      index === 0 && 'bg-muted ring-1 ring-border/60',
                    )}
                  >
                    {chapter.completed ? (
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                    ) : (
                      <Circle className="mt-0.5 size-4 shrink-0 text-muted-foreground/60" />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium">{chapter.title}</div>
                      <div className="mt-0.5 text-xs text-muted-foreground">{chapter.duration}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
