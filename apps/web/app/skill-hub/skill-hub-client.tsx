"use client";

import {
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
  type MouseEvent,
} from "react";
import { Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { useFixedSizeVirtualList } from "@/hooks/use-fixed-size-virtual-list";
import {
  AGENTS,
  CATEGORIES,
  SKILLS,
  type Skill,
  type SkillAgent,
  type SkillCategory,
} from "./skills";

type CategoryFilter = (typeof CATEGORIES)[number];
type AgentFilter = (typeof AGENTS)[number];

// 每行高度 = 卡片本身 + 行间距（gap 通过 padding 实现）
const CARD_ROW_HEIGHT = 208;
// 分页步长：初始渲染多少、每次滚到底再追加多少
const PAGE_SIZE = 60;

function getColumnsByWidth(width: number): number {
  if (width < 640) return 1;
  if (width < 1024) return 2;
  return 3;
}

export function SkillHubClient() {
  const [rawKeyword, setRawKeyword] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("全部");
  const [agent, setAgent] = useState<AgentFilter>("全部");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  // 用于探测 filteredSkills 变化 → 在 render 中同步重置分页
  // （React 官方推荐的"在渲染时更新 state"模式，避免额外的 effect）
  const [prevFiltered, setPrevFiltered] = useState<Skill[] | null>(null);
  const [, startTransition] = useTransition();

  // 输入立即响应；过滤计算滞后执行，避免大数据下卡输入框
  const deferredKeyword = useDeferredValue(rawKeyword);
  const isFiltering = rawKeyword !== deferredKeyword;

  const innerRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [columns, setColumns] = useState(3);

  // 列数由内容容器宽度决定
  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    const update = () => setColumns(getColumnsByWidth(el.clientWidth));
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const filteredSkills = useMemo(() => {
    const kw = deferredKeyword.trim().toLowerCase();
    return SKILLS.filter((skill) => {
      if (category !== "全部" && skill.category !== category) return false;
      if (agent !== "全部" && skill.agent !== agent) return false;
      if (!kw) return true;
      return (
        skill.title.toLowerCase().includes(kw) ||
        skill.desc.toLowerCase().includes(kw)
      );
    });
  }, [deferredKeyword, category, agent]);

  // 过滤结果变化 → 在渲染中同步重置可见数量到第一页
  if (filteredSkills !== prevFiltered) {
    setPrevFiltered(filteredSkills);
    setVisibleCount(PAGE_SIZE);
  }

  // 当前实际可见的切片
  const displayedSkills = useMemo(
    () => filteredSkills.slice(0, visibleCount),
    [filteredSkills, visibleCount],
  );

  const hasMore = visibleCount < filteredSkills.length;

  const { virtualItems, totalHeight } = useFixedSizeVirtualList({
    itemCount: displayedSkills.length,
    itemHeight: CARD_ROW_HEIGHT,
    columns,
    overscan: 2,
    innerRef,
  });

  // 滚动到"哨兵"时追加下一页；使用 IntersectionObserver 挂在 window 视口上
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            startTransition(() => {
              setVisibleCount((prev) =>
                Math.min(prev + PAGE_SIZE, filteredSkills.length),
              );
            });
          }
        }
      },
      { rootMargin: "600px 0px" }, // 提前 600px 触发，感觉更顺
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, filteredSkills.length]);

  const handleCategoryChange = (value: CategoryFilter) => {
    startTransition(() => setCategory(value));
  };
  const handleAgentChange = (value: AgentFilter) => {
    startTransition(() => setAgent(value));
  };

  return (
    <section className="mx-auto w-full max-w-6xl px-6 pt-12 pb-24">
      <header>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          SkillHub
        </h1>
        <p className="mt-3 text-base text-muted-foreground">
          搜索、安装和使用内部 Skill，提升工作效率
        </p>
      </header>

      <div className="relative mt-10">
        <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          value={rawKeyword}
          onChange={(e) => setRawKeyword(e.target.value)}
          placeholder="搜索 Skill..."
          className="h-12 w-full rounded-xl border border-border/70 bg-background pr-4 pl-11 text-sm outline-none transition focus:border-foreground/30 focus:ring-3 focus:ring-ring/40"
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
            <FilterChip
              key={item}
              active={agent === item}
              onClick={() => handleAgentChange(item)}
            >
              {item}
            </FilterChip>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground">
        <span>
          共 <span className="font-medium text-foreground">{filteredSkills.length}</span> 个 Skill
          {hasMore && (
            <span className="ml-2">
              （已加载 <span className="font-medium text-foreground">{displayedSkills.length}</span>）
            </span>
          )}
        </span>
        <span
          className={cn(
            "transition-opacity",
            isFiltering ? "opacity-100" : "opacity-0",
          )}
        >
          正在过滤...
        </span>
      </div>

      {filteredSkills.length === 0 ? (
        <div className="mt-8 flex h-40 items-center justify-center rounded-2xl border border-border/60 text-sm text-muted-foreground">
          没有匹配的 Skill
        </div>
      ) : (
        <div
          ref={innerRef}
          className="relative mt-4 w-full"
          style={{ height: totalHeight }}
        >
          {virtualItems.map(({ index, style }) => {
            const skill = displayedSkills[index];
            if (!skill) return null;
            return (
              <div key={skill.id} style={style} className="p-3">
                <SkillCard skill={skill} />
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
}

function FilterChip({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full px-4 py-1.5 text-sm transition-colors",
        active
          ? "bg-foreground text-background"
          : "bg-muted text-muted-foreground hover:bg-muted/70 hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

function SkillCard({ skill }: { skill: Skill }) {
  const Icon = skill.icon;
  return (
    <article className="flex h-full flex-col rounded-2xl border border-border/70 bg-card p-5 shadow-xs transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "inline-flex size-10 shrink-0 items-center justify-center rounded-xl text-white shadow-sm",
            skill.iconClassName,
          )}
        >
          <Icon className="size-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-semibold tracking-tight">
            {skill.title}
          </h3>
          <p className="mt-1 line-clamp-2 min-h-10 text-xs leading-5 text-muted-foreground">
            {skill.desc}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <CategoryTag category={skill.category} />
        <AgentTag agent={skill.agent} />
      </div>

      <div className="mt-auto pt-4 text-xs text-muted-foreground">
        {skill.version}
      </div>
    </article>
  );
}

function CategoryTag({ category }: { category: SkillCategory }) {
  return (
    <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
      {category}
    </span>
  );
}

function AgentTag({ agent }: { agent: SkillAgent }) {
  return (
    <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
      {agent}
    </span>
  );
}
