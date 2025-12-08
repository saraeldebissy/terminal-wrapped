/**
 * Directory frequency aggregation
 */

import type { CommandEvent } from '../../history/models';
import type { TopDirectory } from '../models';

const MAX_DIRECTORIES = 10;

/**
 * Aggregate top directories from command events
 * Only events with cwd set will be counted
 */
export function aggregateDirectories(events: CommandEvent[]): TopDirectory[] {
  const dirCounts = new Map<string, number>();

  for (const event of events) {
    if (!event.cwd) {
      continue;
    }

    dirCounts.set(event.cwd, (dirCounts.get(event.cwd) || 0) + 1);
  }

  // Sort by count descending and take top N
  const sorted = [...dirCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, MAX_DIRECTORIES);

  return sorted.map(([path, count]) => ({ path, count }));
}
