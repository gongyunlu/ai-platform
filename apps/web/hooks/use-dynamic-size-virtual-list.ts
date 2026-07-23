"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from "react";

// 不定高虚拟滚动 Hook
// 适用场景：每个 item 高度未知或不同（如富文本卡片、评论、瀑布流单列）
// 核心思路：
//   1. 每个 item 先用 estimatedItemHeight 占位，得到粗略总高度；
//   2. ResizeObserver 测量已挂载 item 的真实高度，写入 measurements state；
//   3. 维护 offsets 前缀和数组（第 i 个 item 的顶部 y 坐标），通过二分查找
//      快速定位 scrollTop 对应的起始 index，避免 O(n) 扫描；
//   4. 多次高度变化在一帧内合并，减少重渲染。

export interface UseDynamicSizeVirtualListOptions {
  /** 列表项总数量 */
  itemCount: number;
  /** 每个 item 的估算高度；估得越准，滚动条越稳定 */
  estimatedItemHeight: number;
  /** 通过 index 获取一个稳定 key，用于跨渲染保留已测量高度 */
  getItemKey: (index: number) => string | number;
  /** 可视区外额外多渲染的条数 */
  overscan?: number;
  /** 滚动容器 ref */
  scrollElementRef: RefObject<HTMLElement | null>;
}

export interface DynamicSizeVirtualItem {
  index: number;
  key: string | number;
  /** 该 item 顶部相对内容区的 y 坐标 */
  offset: number;
  /** 该 item 当前高度（已测量则真实，否则为估算值） */
  size: number;
}

export interface UseDynamicSizeVirtualListReturn {
  virtualItems: DynamicSizeVirtualItem[];
  /** 内层容器总高度（已测量 + 未测量的估算之和） */
  totalHeight: number;
  scrollToIndex: (index: number, behavior?: ScrollBehavior) => void;
  /**
   * 用法：<div ref={(el) => measureElement(item.key, el)}>...</div>
   * hook 内部通过 ResizeObserver 持续观测该元素的真实高度。
   * 采用外部 curry 而不是每个 item 各带一个函数，是为了让引用稳定，
   * 也避免在 render 阶段把 ref 泄露到返回值里。
   */
  measureElement: (key: string | number, element: HTMLElement | null) => void;
}

export function useDynamicSizeVirtualList({
  itemCount,
  estimatedItemHeight,
  getItemKey,
  overscan = 3,
  scrollElementRef,
}: UseDynamicSizeVirtualListOptions): UseDynamicSizeVirtualListReturn {
  const [scrollTop, setScrollTop] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  // 测量结果放到 state：render 阶段只读 state，遵守 React Compiler 规则
  // 用 key 而非 index 是为了在数据插入/删除后仍能命中
  const [measurements, setMeasurements] = useState<Map<string | number, number>>(
    () => new Map(),
  );

  // 这些 ref 只在事件回调 / effect 中读写，不在 render 中读，符合规则
  const scrollRafRef = useRef<number | null>(null);
  const pendingMeasurementsRef = useRef<Map<string | number, number> | null>(
    null,
  );
  const measureRafRef = useRef<number | null>(null);
  const observerRef = useRef<ResizeObserver | null>(null);
  const elementToKeyRef = useRef<Map<Element, string | number>>(new Map());

  // 滚动 & 视口尺寸监听
  useEffect(() => {
    const el = scrollElementRef.current;
    if (!el) return;

    setViewportHeight(el.clientHeight);
    setScrollTop(el.scrollTop);

    const handleScroll = () => {
      if (scrollRafRef.current != null) return;
      scrollRafRef.current = requestAnimationFrame(() => {
        scrollRafRef.current = null;
        setScrollTop(el.scrollTop);
      });
    };
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setViewportHeight(entry.contentRect.height);
      }
    });
    el.addEventListener("scroll", handleScroll, { passive: true });
    resizeObserver.observe(el);
    return () => {
      el.removeEventListener("scroll", handleScroll);
      resizeObserver.disconnect();
      if (scrollRafRef.current != null) {
        cancelAnimationFrame(scrollRafRef.current);
        scrollRafRef.current = null;
      }
    };
  }, [scrollElementRef]);

  // item 尺寸监听器：一整个 hook 实例共用一个 ResizeObserver
  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      // 合并多次变化，一帧内只 setState 一次
      let batch = pendingMeasurementsRef.current;
      if (batch == null) {
        batch = new Map();
        pendingMeasurementsRef.current = batch;
      }
      for (const entry of entries) {
        const key = elementToKeyRef.current.get(entry.target);
        if (key == null) continue;
        // offsetHeight 包含 padding + border，比 contentRect 更符合布局占位
        batch.set(key, (entry.target as HTMLElement).offsetHeight);
      }
      if (measureRafRef.current != null) return;
      measureRafRef.current = requestAnimationFrame(() => {
        measureRafRef.current = null;
        const pending = pendingMeasurementsRef.current;
        pendingMeasurementsRef.current = null;
        if (!pending || pending.size === 0) return;
        setMeasurements((prev) => {
          let changed = false;
          const next = new Map(prev);
          for (const [k, v] of pending) {
            if (next.get(k) !== v) {
              next.set(k, v);
              changed = true;
            }
          }
          return changed ? next : prev;
        });
      });
    });
    observerRef.current = observer;
    const elementToKey = elementToKeyRef.current;
    return () => {
      observer.disconnect();
      observerRef.current = null;
      elementToKey.clear();
      if (measureRafRef.current != null) {
        cancelAnimationFrame(measureRafRef.current);
        measureRafRef.current = null;
      }
      pendingMeasurementsRef.current = null;
    };
  }, []);

  // 稳定的 measureElement：ref 访问只在回调触发时发生（元素挂载/卸载），
  // 不会在 render 期间执行
  const measureElement = useCallback(
    (key: string | number, element: HTMLElement | null) => {
      const observer = observerRef.current;
      if (!observer) return;
      const map = elementToKeyRef.current;
      if (element == null) {
        for (const [el, k] of map) {
          if (k === key) {
            observer.unobserve(el);
            map.delete(el);
            break;
          }
        }
        return;
      }
      if (map.get(element) === key) return;
      for (const [el, k] of map) {
        if (k === key) {
          observer.unobserve(el);
          map.delete(el);
        }
      }
      map.set(element, key);
      observer.observe(element);
    },
    [],
  );

  // offsets 前缀和：offsets[i] 表示第 i 个 item 顶部相对内容区的 y
  // 长度 = itemCount + 1，最后一项即总高度
  const offsets = useMemo(() => {
    const arr = new Array<number>(itemCount + 1);
    arr[0] = 0;
    for (let i = 0; i < itemCount; i++) {
      const key = getItemKey(i);
      const measured = measurements.get(key);
      arr[i + 1] = arr[i]! + (measured ?? estimatedItemHeight);
    }
    return arr;
  }, [itemCount, estimatedItemHeight, getItemKey, measurements]);

  const totalHeight: number = offsets[itemCount] ?? 0;

  const virtualItems = useMemo<DynamicSizeVirtualItem[]>(() => {
    if (itemCount === 0) return [];

    // 二分查找：找到 y 坐标 top 对应的 item index
    const findIndexByOffset = (top: number): number => {
      let low = 0;
      let high = itemCount - 1;
      while (low <= high) {
        const mid = (low + high) >>> 1;
        const midStart = offsets[mid]!;
        const midEnd = offsets[mid + 1]!;
        if (midEnd <= top) {
          low = mid + 1;
        } else if (midStart > top) {
          high = mid - 1;
        } else {
          return mid;
        }
      }
      return Math.max(0, Math.min(itemCount - 1, low));
    };

    const startIndex = Math.max(0, findIndexByOffset(scrollTop) - overscan);
    const endIndex = Math.min(
      itemCount - 1,
      findIndexByOffset(scrollTop + viewportHeight) + overscan,
    );

    const items: DynamicSizeVirtualItem[] = [];
    for (let i = startIndex; i <= endIndex; i++) {
      const key = getItemKey(i);
      const size = measurements.get(key) ?? estimatedItemHeight;

      items.push({
        index: i,
        key,
        offset: offsets[i]!,
        size,
      });
    }
    return items;
  }, [
    itemCount,
    scrollTop,
    viewportHeight,
    offsets,
    overscan,
    estimatedItemHeight,
    getItemKey,
    measurements,
  ]);

  const scrollToIndex = (
    index: number,
    behavior: ScrollBehavior = "auto",
  ) => {
    const el = scrollElementRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(itemCount - 1, index));
    el.scrollTo({ top: offsets[clamped] ?? 0, behavior });
  };

  return { virtualItems, totalHeight, scrollToIndex, measureElement };
}
