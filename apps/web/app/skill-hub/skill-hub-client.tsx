'use client';

import { useDeferredValue, useMemo, useRef, useState, useTransition } from 'react';
import { Search } from 'lucide-react';

import { cn } from '@/lib/utils';
import { LinkCard } from '@/components/link-card';
import { Input } from '@/components/ui/input';
import { useFixedSizeVirtualList } from '@/hooks/use-fixed-size-virtual-list';
import { useResponsiveColumns } from '@/hooks/use-responsive-columns';
import { useInfiniteScrollTrigger } from '@/hooks/use-infinite-scroll-trigger';
import { useLocalPagination } from '@/hooks/use-local-pagination';
import { AGENTS, CATEGORIES, SKILLS } from './skills';
import { FilterChip } from '@/components/filter-chip';

type CategoryFilter = (typeof CATEGORIES)[number];
type AgentFilter = (typeof AGENTS)[number];

// 每行高度 = 卡片本身 + 行间距（gap 通过 padding 实现）
const CARD_ROW_HEIGHT = 208;
// 分页步长：初始渲染多少、每次滚到底再追加多少
const PAGE_SIZE = 60;

const getColumnsByWidth = (width: number): number => {
  if (width < 640) return 1;
  if (width < 1024) return 2;
  return 3;
};

export const SkillHubClient = () => {
  const [rawKeyword, setRawKeyword] = useState('');
  const [category, setCategory] = useState<CategoryFilter>('全部');
  const [agent, setAgent] = useState<AgentFilter>('全部');
  const [, startTransition] = useTransition();

  // 输入立即响应；过滤计算滞后执行，避免大数据下卡输入框
  const deferredKeyword = useDeferredValue(rawKeyword);
  const isFiltering = rawKeyword !== deferredKeyword;

  const innerRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const columns = useResponsiveColumns({
    containerRef: innerRef,
    getColumns: getColumnsByWidth,
    initialColumns: 3,
  });

  const filteredSkills = useMemo(() => {
    const kw = deferredKeyword.trim().toLowerCase();
    return SKILLS.filter((skill) => {
      if (category !== '全部' && skill.category !== category) return false;
      if (agent !== '全部' && skill.agent !== agent) return false;
      if (!kw) return true;
      return skill.title.toLowerCase().includes(kw) || skill.desc.toLowerCase().includes(kw);
    });
  }, [deferredKeyword, category, agent]);

  const {
    items: displayedSkills,
    hasMore,
    loadMore,
  } = useLocalPagination({ source: filteredSkills, pageSize: PAGE_SIZE });

  const { virtualItems, totalHeight } = useFixedSizeVirtualList({
    itemCount: displayedSkills.length,
    itemHeight: CARD_ROW_HEIGHT,
    columns,
    overscan: 2,
    innerRef,
  });

  useInfiniteScrollTrigger({ sentinelRef, hasMore, onLoadMore: loadMore });

  const handleCategoryChange = (value: CategoryFilter) => {
    startTransition(() => setCategory(value));
  };
  const handleAgentChange = (value: AgentFilter) => {
    startTransition(() => setAgent(value));
  };

  return (
    <section className="mx-auto w-full max-w-6xl px-6 pt-12 pb-24">
      <header>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">SkillHub</h1>
        <p className="mt-3 text-base text-muted-foreground">
          搜索、安装和使用内部 Skill，提升工作效率
        </p>
      </header>

      <div className="relative mt-10">
        <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          value={rawKeyword}
          onChange={(e) => setRawKeyword(e.target.value)}
          placeholder="搜索 Skill..."
          className="h-12 rounded-xl bg-background pr-4 pl-11 text-sm"
        />
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
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

      <div className="mt-6">
        <div className="text-xs font-medium text-muted-foreground">适用 Agent</div>
        <div className="mt-2 flex flex-wrap gap-2">
          {AGENTS.map((item) => (
            <FilterChip key={item} active={agent === item} onClick={() => handleAgentChange(item)}>
              {item}
            </FilterChip>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground">
        <span>
          共 <span className="font-medium text-foreground">{filteredSkills.length}</span> 个 Skill
        </span>
        <span className={cn('transition-opacity', isFiltering ? 'opacity-100' : 'opacity-0')}>
          正在过滤...
        </span>
      </div>

      {filteredSkills.length === 0 ? (
        <div className="mt-8 flex h-40 items-center justify-center rounded-2xl border border-border/60 text-sm text-muted-foreground">
          没有匹配的 Skill
        </div>
      ) : (
        <div ref={innerRef} className="relative mt-4 w-full" style={{ height: totalHeight }}>
          {virtualItems.map(({ index, style }) => {
            const skill = displayedSkills[index];
            if (!skill) return null;
            return (
              <div key={skill.id} style={style} className="p-3">
                <LinkCard
                  href={`/skill-hub/${skill.id}`}
                  icon={skill.icon}
                  iconClassName={skill.iconClassName}
                  title={skill.title}
                  description={skill.desc}
                  tags={[skill.category, skill.agent]}
                  footer={skill.version}
                />
              </div>
            );
          })}
        </div>
      )}

      {hasMore && (
        <div
          ref={sentinelRef}
          className="mt-6 flex h-10 items-center justify-center text-xs text-muted-foreground"
        >
          加载中...
        </div>
      )}
    </section>
  );
};
