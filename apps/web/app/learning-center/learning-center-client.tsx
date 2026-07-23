'use client';

import { useMemo, useState, useTransition } from 'react';
import { Clock } from 'lucide-react';

import { FilterChip } from '@/components/filter-chip';
import { LinkCard } from '@/components/link-card';
import { CATEGORIES, LEARN_ITEMS, TYPES, getTypeIcon } from './learning-center';

type CategoryFilter = (typeof CATEGORIES)[number];
type TypeFilter = (typeof TYPES)[number];

export const LearningCenterClient = () => {
  const [category, setCategory] = useState<CategoryFilter>('全部');
  const [type, setType] = useState<TypeFilter>('全部');
  const [, startTransition] = useTransition();

  const filteredItems = useMemo(() => {
    return LEARN_ITEMS.filter((item) => {
      if (category !== '全部' && item.category !== category) return false;
      if (type !== '全部' && item.type !== type) return false;
      return true;
    });
  }, [category, type]);

  const handleCategoryChange = (value: CategoryFilter) => {
    startTransition(() => setCategory(value));
  };
  const handleTypeChange = (value: TypeFilter) => {
    startTransition(() => setType(value));
  };

  return (
    <section className="mx-auto w-full max-w-6xl px-6 pt-12 pb-24">
      <header>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">学习中心</h1>
        <p className="mt-3 text-base text-muted-foreground">
          操作说明、使用案例、视频教程，帮助您快速掌握 AI 平台
        </p>
      </header>

      <div className="mt-8">
        <div className="text-xs font-medium text-muted-foreground">分类</div>
        <div className="mt-2 flex flex-wrap gap-2">
          {CATEGORIES.map((item) => (
            <FilterChip
              key={item}
              active={category === item}
              onClick={() => handleCategoryChange(item)}
            >
              {item}
            </FilterChip>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <div className="text-xs font-medium text-muted-foreground">类型</div>
        <div className="mt-2 flex flex-wrap gap-2">
          {TYPES.map((item) => (
            <FilterChip key={item} active={type === item} onClick={() => handleTypeChange(item)}>
              {item}
            </FilterChip>
          ))}
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="mt-8 flex h-40 items-center justify-center rounded-2xl border border-border/60 text-sm text-muted-foreground">
          没有匹配的课程
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => (
            <LinkCard
              key={item.id}
              href={`/learning-center/${item.id}`}
              icon={getTypeIcon(item.type)}
              iconClassName="bg-muted text-muted-foreground shadow-none"
              title={item.title}
              description={
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="size-3.5" />
                  {item.duration}
                </span>
              }
              tags={[item.category, item.type]}
            />
          ))}
        </div>
      )}
    </section>
  );
};
