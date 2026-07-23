'use client';

import { useEffect, useRef, useState, type RefObject } from 'react';

// 根据容器宽度动态计算列数。
// 不预设断点，由调用方通过 getColumns 决定映射规则，避免 hook 绑死项目特定断点。
// initialColumns 用于 SSR 首屏，避免宽度未测量前的布局抖动；调用方按页面首屏预期传入。

export interface UseResponsiveColumnsOptions {
  /** 内容容器 ref，用其 clientWidth 作为断点依据 */
  containerRef: RefObject<HTMLElement | null>;
  /** 由容器宽度返回列数 */
  getColumns: (width: number) => number;
  /** SSR / 首帧使用的初始列数，默认 1 */
  initialColumns?: number;
}

export function useResponsiveColumns({
  containerRef,
  getColumns,
  initialColumns = 1,
}: UseResponsiveColumnsOptions): number {
  const [columns, setColumns] = useState(initialColumns);

  // getColumns 存 ref，避免调用方传入内联箭头函数时反复重建 ResizeObserver。
  const getColumnsRef = useRef(getColumns);
  useEffect(() => {
    getColumnsRef.current = getColumns;
  }, [getColumns]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setColumns(getColumnsRef.current(el.clientWidth));
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [containerRef]);

  return columns;
}
