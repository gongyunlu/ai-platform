'use client';

import { useEffect, useState, type TransitionEvent } from 'react';

import { useLinkProgress } from '@/components/link-progress';

type Phase = 'idle' | 'loading' | 'done';

const PHASE_CLASS: Record<Phase, string> = {
  idle: 'scale-x-0 opacity-0',
  loading:
    'scale-x-90 opacity-100 transition-transform duration-[8000ms] ease-[cubic-bezier(0,0.7,0.4,1)]',
  done: 'scale-x-100 opacity-0 transition-[transform,opacity] duration-200 ease-out',
};

export function TopProgressBar() {
  const { active } = useLinkProgress();
  const [phase, setPhase] = useState<Phase>('idle');

  useEffect(() => {
    queueMicrotask(() => {
      if (active > 0) {
        setPhase('loading');
      } else {
        setPhase((prev) => (prev === 'loading' ? 'done' : prev));
      }
    });
  }, [active]);

  const handleTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
    if (phase === 'done' && event.propertyName === 'opacity') {
      setPhase('idle');
    }
  };

  return (
    <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-60 h-0.5">
      <div
        onTransitionEnd={handleTransitionEnd}
        className={`h-full origin-left bg-foreground shadow-[0_0_8px_var(--color-foreground)] ${PHASE_CLASS[phase]}`}
      />
    </div>
  );
}
