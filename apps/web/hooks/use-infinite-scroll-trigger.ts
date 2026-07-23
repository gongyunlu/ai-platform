'use client';

import { startTransition, useEffect, useRef, type RefObject } from 'react';

// 哨兵进入视口时触发 onLoadMore。
// 只负责 DOM 侧的"何时该加载下一批"，不关心数据是内存切片还是接口请求。
// 内部包 startTransition，让由此引发的大列表 re-render 不阻塞输入等高优交互。

export interface UseInfiniteScrollTriggerOptions {
  /** 哨兵元素 ref，通常放在列表底部 */
  sentinelRef: RefObject<HTMLElement | null>;
  /** 是否还有更多数据；为 false 时不建立 observer，避免无谓触发 */
  hasMore: boolean;
  /** 需要加载下一批时的回调 */
  onLoadMore: () => void;
  /** 提前触发的距离，默认 '600px 0px'（提前 600px 触发，滚动手感更顺） */
  rootMargin?: string;
}

export function useInfiniteScrollTrigger({
  sentinelRef,
  hasMore,
  onLoadMore,
  rootMargin = '600px 0px',
}: UseInfiniteScrollTriggerOptions): void {
  // 用 ref 存最新回调，避免调用方内联函数导致 observer 反复重建；
  // effect 依赖只锁 hasMore / rootMargin，业务侧数据变化不干扰 observer 生命周期。
  const onLoadMoreRef = useRef(onLoadMore);
  useEffect(() => {
    onLoadMoreRef.current = onLoadMore;
  }, [onLoadMore]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            startTransition(() => onLoadMoreRef.current());
          }
        }
      },
      { rootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [sentinelRef, hasMore, rootMargin]);
}
