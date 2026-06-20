import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useStoryNavigation } from './useStoryNavigation';

describe('useStoryNavigation', () => {
  it('starts at index 0', () => {
    const { result } = renderHook(() => useStoryNavigation(5));
    expect(result.current.index).toBe(0);
  });

  it('advances with next() and clamps at the last slide', () => {
    const { result } = renderHook(() => useStoryNavigation(3));
    act(() => result.current.next());
    expect(result.current.index).toBe(1);
    act(() => { result.current.next(); result.current.next(); result.current.next(); });
    expect(result.current.index).toBe(2);
  });

  it('goes back with prev() and clamps at 0', () => {
    const { result } = renderHook(() => useStoryNavigation(3));
    act(() => result.current.next());
    act(() => { result.current.prev(); result.current.prev(); });
    expect(result.current.index).toBe(0);
  });

  it('reports isFirst and isLast', () => {
    const { result } = renderHook(() => useStoryNavigation(2));
    expect(result.current.isFirst).toBe(true);
    expect(result.current.isLast).toBe(false);
    act(() => result.current.next());
    expect(result.current.isLast).toBe(true);
  });
});
