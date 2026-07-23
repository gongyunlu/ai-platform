"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from "react";

// 定高虚拟滚动 Hook
// 适用场景：列表所有 item 的宽/高相同（如卡片网格、行高固定的列表）。
// 核心思路：item 尺寸固定 → 通过 scrollTop 与 itemHeight 直接算出可见区间，O(1)。
//
// 支持两种滚动源：
//  - 容器滚动：scrollElementRef 指向可滚动容器
//  - Window 滚动（默认）：使用 window，配合 innerRef 计算内容区在页面中的偏移
//    → 这样可以让"整页滚动"仍然享受虚拟化。

export interface UseFixedSizeVirtualListOptions {
  /** 列表项总数量 */
  itemCount: number;
  /** 单行高度（px），网格模式下也是一整行的高度 */
  itemHeight: number;
  /** 每行列数，默认 1 */
  columns?: number;
  /** 可视区外额外多渲染的行数 */
  overscan?: number;
  /**
   * 内容容器 ref（内部的相对定位容器）。
   * Window 模式下必填：hook 需要用它计算内容顶部相对视口的偏移。
   * 容器滚动模式下可省略。
   */
  innerRef?: RefObject<HTMLElement | null>;
  /**
   * 滚动源。传入容器 ref 使用容器滚动；不传则默认 window 滚动。
   */
  scrollElementRef?: RefObject<HTMLElement | null>;
}

export interface FixedSizeVirtualItem {
  index: number;
  style: {
    position: "absolute";
    top: number;
    left: string;
    width: string;
    height: number;
  };
}

export interface UseFixedSizeVirtualListReturn {
  virtualItems: FixedSizeVirtualItem[];
  /** 内层容器总高度（撑开滚动条用） */
  totalHeight: number;
  scrollToIndex: (index: number, behavior?: ScrollBehavior) => void;
}

export function useFixedSizeVirtualList({
  itemCount,
  itemHeight,
  columns = 1,
  overscan = 3,
  innerRef,
  scrollElementRef,
}: UseFixedSizeVirtualListOptions): UseFixedSizeVirtualListReturn {
  // 内容区相对滚动源顶部的 scrollTop（可为负数：内容还没到顶部）
  const [relativeScrollTop, setRelativeScrollTop] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  const rafRef = useRef<number | null>(null);

  const safeColumns = Math.max(1, columns);
  const rowCount = Math.ceil(itemCount / safeColumns);
  const totalHeight = rowCount * itemHeight;

  useEffect(() => {
    const isWindowMode = scrollElementRef == null;

    const compute = () => {
      if (isWindowMode) {
        const innerEl = innerRef?.current;
        setViewportHeight(window.innerHeight);
        if (innerEl) {
          const rect = innerEl.getBoundingClientRect();
          // rect.top 是内容顶部相对视口顶部的距离；
          // 反过来就是"内容区已经被滚出去多少" == 相对 scrollTop
          setRelativeScrollTop(-rect.top);
        } else {
          setRelativeScrollTop(0);
        }
      } else {
        const el = scrollElementRef.current;
        if (!el) return;
        setViewportHeight(el.clientHeight);
        setRelativeScrollTop(el.scrollTop);
      }
    };

    compute();

    const handleScroll = () => {
      if (rafRef.current != null) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        compute();
      });
    };

    const resizeObserver = new ResizeObserver(compute);

    if (isWindowMode) {
      window.addEventListener("scroll", handleScroll, { passive: true });
      window.addEventListener("resize", handleScroll);
      const innerEl = innerRef?.current;
      if (innerEl) resizeObserver.observe(innerEl);
      return () => {
        window.removeEventListener("scroll", handleScroll);
        window.removeEventListener("resize", handleScroll);
        resizeObserver.disconnect();
        if (rafRef.current != null) {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = null;
        }
      };
    }

    const el = scrollElementRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll, { passive: true });
    resizeObserver.observe(el);
    return () => {
      el.removeEventListener("scroll", handleScroll);
      resizeObserver.disconnect();
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [scrollElementRef, innerRef]);

  const virtualItems = useMemo<FixedSizeVirtualItem[]>(() => {
    if (itemCount === 0 || itemHeight <= 0) return [];

    // relativeScrollTop 可能为负（内容还没进入视口），此时可视起始行 = 0
    const startRow = Math.max(
      0,
      Math.floor(relativeScrollTop / itemHeight) - overscan,
    );
    const visibleRowCount = Math.ceil(viewportHeight / itemHeight);
    const endRow = Math.min(
      rowCount - 1,
      startRow + visibleRowCount + overscan * 2,
    );

    const items: FixedSizeVirtualItem[] = [];
    const columnWidthPct = 100 / safeColumns;

    for (let row = startRow; row <= endRow; row++) {
      for (let col = 0; col < safeColumns; col++) {
        const index = row * safeColumns + col;
        if (index >= itemCount) break;
        items.push({
          index,
          style: {
            position: "absolute",
            top: row * itemHeight,
            left: `${col * columnWidthPct}%`,
            width: `${columnWidthPct}%`,
            height: itemHeight,
          },
        });
      }
    }
    return items;
  }, [
    relativeScrollTop,
    viewportHeight,
    itemCount,
    itemHeight,
    rowCount,
    safeColumns,
    overscan,
  ]);

  const scrollToIndex = useCallback(
    (index: number, behavior: ScrollBehavior = "auto") => {
      const row = Math.floor(index / safeColumns);
      if (scrollElementRef?.current) {
        scrollElementRef.current.scrollTo({
          top: row * itemHeight,
          behavior,
        });
        return;
      }
      const innerEl = innerRef?.current;
      if (!innerEl) return;
      const rect = innerEl.getBoundingClientRect();
      // 目标绝对 y = 当前 window scrollY + 内容顶部相对视口的距离 + 目标行偏移
      const targetY = window.scrollY + rect.top + row * itemHeight;
      window.scrollTo({ top: targetY, behavior });
    },
    [scrollElementRef, innerRef, itemHeight, safeColumns],
  );

  return { virtualItems, totalHeight, scrollToIndex };
}
