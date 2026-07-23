import { cn } from '@/lib/utils';

interface MarkdownContentProps {
  content: string;
  className?: string;
}

// 占位实现：直出原文，后续会替换为 markstream-stream / incremark 或自研 renderer
export const MarkdownContent = ({ content, className }: MarkdownContentProps) => {
  return (
    <pre
      className={cn('whitespace-pre-wrap font-mono text-sm leading-6 text-foreground', className)}
    >
      {content}
    </pre>
  );
};
