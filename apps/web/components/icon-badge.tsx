import type { ComponentType } from 'react';

import { cn } from '@/lib/utils';

type IconBadgeSize = 'sm' | 'md' | 'lg';

interface IconBadgeProps {
  icon: ComponentType<{ className?: string }>;
  size?: IconBadgeSize;
  /** 背景样式：一般是 bg-linear-to-br from-... to-... 的渐变色 class */
  className?: string;
  iconClassName?: string;
}

const CONTAINER_SIZE: Record<IconBadgeSize, string> = {
  sm: 'size-8 rounded-lg',
  md: 'size-10 rounded-xl',
  lg: 'size-12 rounded-xl',
};

const ICON_SIZE: Record<IconBadgeSize, string> = {
  sm: 'size-4',
  md: 'size-5',
  lg: 'size-6',
};

/**
 * 项目通用图标胶囊：一个带渐变背景的方形图标块，
 * 用于首页入口卡片、Agent 卡片、SkillCard、site-header logo 等场景。
 */
export const IconBadge = ({
  icon: Icon,
  size = 'md',
  className,
  iconClassName,
}: IconBadgeProps) => {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center text-white shadow-sm',
        CONTAINER_SIZE[size],
        className,
      )}
    >
      <Icon className={cn(ICON_SIZE[size], iconClassName)} />
    </span>
  );
};
