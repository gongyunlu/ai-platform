import { Button } from '@/components/ui/button';
import { type MouseEvent } from 'react';

export interface FilterChipProps {
  active: boolean;
  children: React.ReactNode;
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
}

export const FilterChip = ({ active, children, onClick }: FilterChipProps) => {
  return (
    <Button
      type="button"
      variant={active ? 'default' : 'secondary'}
      size="sm"
      onClick={onClick}
      className="rounded-full px-4"
    >
      {children}
    </Button>
  );
};
