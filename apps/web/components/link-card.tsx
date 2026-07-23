import type { ComponentType, ReactNode } from 'react';

import { IconBadge } from '@/components/icon-badge';
import { Link } from '@/components/link';
import { Badge } from '@/components/ui/badge';

interface LinkCardProps {
  href: string;
  icon: ComponentType<{ className?: string }>;
  iconClassName?: string;
  title: string;
  description: ReactNode;
  tags: string[];
  footer?: ReactNode;
  prefetch?: boolean;
}

export const LinkCard = ({
  href,
  icon,
  iconClassName,
  title,
  description,
  tags,
  footer,
  prefetch = false,
}: LinkCardProps) => {
  return (
    <Link
      href={href}
      prefetch={prefetch}
      className="group flex h-full flex-col rounded-2xl bg-card p-5 ring-1 ring-foreground/10 transition-all hover:-translate-y-0.5 hover:ring-foreground/20 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
    >
      <div className="flex items-start gap-3">
        <IconBadge icon={icon} className={iconClassName} />
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-semibold tracking-tight">{title}</h3>
          <div className="mt-1 line-clamp-2 min-h-10 text-sm leading-6 text-muted-foreground">
            {description}
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Badge key={tag} variant="secondary">
            {tag}
          </Badge>
        ))}
      </div>

      {footer !== undefined && (
        <div className="mt-auto pt-4 text-xs text-muted-foreground">{footer}</div>
      )}
    </Link>
  );
};
