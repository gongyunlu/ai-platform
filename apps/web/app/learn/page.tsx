import { BookOpen } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';

export default function LearnPage() {
  return (
    <section className="mx-auto w-full max-w-4xl px-6 pt-16 pb-24">
      <header className="text-center">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">学习中心</h1>
        <p className="mt-4 text-base text-muted-foreground">操作说明、使用案例、视频教程</p>
      </header>

      <Card className="mt-12 px-6 py-12">
        <CardContent className="flex flex-col items-center text-center">
          <span className="inline-flex size-12 items-center justify-center rounded-xl bg-linear-to-br from-orange-500 to-amber-600 text-white shadow-sm">
            <BookOpen className="size-6" />
          </span>
          <h2 className="mt-4 text-lg font-semibold">内容筹备中</h2>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            学习中心的操作说明、案例库与视频教程正在整理中，敬请期待
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
