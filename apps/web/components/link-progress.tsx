"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type LinkProgressContextValue = {
  active: number;
  start: () => void;
  end: () => void;
};

const LinkProgressContext = createContext<LinkProgressContextValue | null>(
  null,
);

export function LinkProgressProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState(0);
  const start = useCallback(() => setActive((c) => c + 1), []);
  const end = useCallback(() => setActive((c) => Math.max(0, c - 1)), []);
  const value = useMemo(
    () => ({ active, start, end }),
    [active, start, end],
  );
  return (
    <LinkProgressContext.Provider value={value}>
      {children}
    </LinkProgressContext.Provider>
  );
}

export function useLinkProgress() {
  const ctx = useContext(LinkProgressContext);
  if (!ctx) {
    throw new Error("useLinkProgress 必须在 LinkProgressProvider 内使用");
  }
  return ctx;
}
