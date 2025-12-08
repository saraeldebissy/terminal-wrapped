/**
 * Hook for fetching stats from the local server
 */

import { useEffect, useState } from 'react';
import type { Stats } from './types';

export interface UseStatsResult {
  stats: Stats | null;
  loading: boolean;
  error: string | null;
}

/**
 * Fetch stats.json from the local server
 */
export function useStats(): UseStatsResult {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/stats.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load stats: ${response.status}`);
        }
        return response.json();
      })
      .then((data: Stats) => {
        setStats(data);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : String(err));
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { stats, loading, error };
}
