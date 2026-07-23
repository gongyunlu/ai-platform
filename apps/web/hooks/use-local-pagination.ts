'use client';

import { useMemo, useState } from 'react';

// 内存分页：把已加载在内存中的完整数组按页切片。
// 与 useInfiniteScrollTrigger 组合即可实现"下拉加载"，无需异步。
// 未来接入真实接口时，本 hook 直接替换为 useInfiniteQuery 等数据层方案，
// 触发层（useInfiniteScrollTrigger）与渲染层保持不变。

export interface UseLocalPaginationOptions<T> {
  /** 完整数据源；引用变化会自动重置到第一页 */
  source: readonly T[];
  /** 每页条数 */
  pageSize: number;
}

export interface UseLocalPaginationReturn<T> {
  /** 当前可见的切片 */
  items: T[];
  /** 已展示的条数 */
  visibleCount: number;
  /** 是否还有更多可展示 */
  hasMore: boolean;
  /** 追加下一页；已到末尾时无副作用 */
  loadMore: () => void;
}

export function useLocalPagination<T>({
  source,
  pageSize,
}: UseLocalPaginationOptions<T>): UseLocalPaginationReturn<T> {
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const [prevSource, setPrevSource] = useState(source);

  // 数据源引用变化 → 在渲染中同步重置到第一页
  // （React 官方推荐的"在渲染时更新 state"模式，比 useEffect 少一次多余渲染）
  if (source !== prevSource) {
    setPrevSource(source);
    setVisibleCount(pageSize);
  }

  const items = useMemo(() => source.slice(0, visibleCount) as T[], [source, visibleCount]);

  const hasMore = visibleCount < source.length;

  const loadMore = () => {
    setVisibleCount((prev) => Math.min(prev + pageSize, source.length));
  };

  return { items, visibleCount, hasMore, loadMore };
}
