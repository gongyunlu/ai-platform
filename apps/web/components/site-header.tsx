"use client";

import { usePathname } from "next/navigation";
import { Sparkles, User } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/link";
import { ThemeToggle } from "@/components/theme-toggle";

type NavItem = {
  label: string;
  href: string;
};

const NAV_ITEMS: NavItem[] = [
  { label: "首页", href: "/" },
  { label: "Agent", href: "/agent" },
  { label: "SkillHub", href: "/skill-hub" },
  { label: "学习中心", href: "/learn" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-sm">
            <Sparkles className="size-4" />
          </span>
          <span className="text-base font-semibold tracking-tight">
            AI Platform
          </span>
        </Link>

        <nav className="hidden items-center gap-1 rounded-full bg-transparent p-1 md:flex">
          {NAV_ITEMS.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button
            className="rounded-full bg-foreground px-4 text-background hover:bg-foreground/90"
            size="sm"
          >
            发布 Skill
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="用户"
            className="rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white hover:from-indigo-500/90 hover:to-purple-600/90"
          >
            <User className="size-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
