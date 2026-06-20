import { useCallback, useState } from 'react';

export interface StoryNavigation {
  index: number;
  next: () => void;
  prev: () => void;
  goTo: (i: number) => void;
  isFirst: boolean;
  isLast: boolean;
}

export function useStoryNavigation(count: number): StoryNavigation {
  const [index, setIndex] = useState(0);
  const clamp = useCallback((i: number) => Math.max(0, Math.min(count - 1, i)), [count]);
  const next = useCallback(() => setIndex((i) => clamp(i + 1)), [clamp]);
  const prev = useCallback(() => setIndex((i) => clamp(i - 1)), [clamp]);
  const goTo = useCallback((i: number) => setIndex(clamp(i)), [clamp]);
  return { index, next, prev, goTo, isFirst: index === 0, isLast: index === count - 1 };
}
