"use client";

import { useEffect, type ComponentProps } from "react";
import NextLink, { useLinkStatus } from "next/link";

import { useLinkProgress } from "@/components/link-progress";

function LinkStatusReporter() {
  const { pending } = useLinkStatus();
  const { start, end } = useLinkProgress();

  useEffect(() => {
    if (!pending) return;
    start();
    return () => end();
  }, [pending, start, end]);

  return null;
}

type LinkProps = ComponentProps<typeof NextLink>;

export function Link({ children, ...props }: LinkProps) {
  return (
    <NextLink {...props}>
      <LinkStatusReporter />
      {children}
    </NextLink>
  );
}
