/**
 * Time-based activity aggregation
 */

import type { CommandEvent } from '../../history/models';
import type { DayActivity, HourActivity } from '../models';

/**
 * Format a Date as YYYY-MM-DD
 */
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Aggregate activity by day
 */
export function aggregateActivityByDay(events: CommandEvent[]): DayActivity[] {
  const dayCounts = new Map<string, number>();

  for (const event of events) {
    if (!event.timestamp) {
      continue;
    }

    const dateStr = formatDate(event.timestamp);
    dayCounts.set(dateStr, (dayCounts.get(dateStr) || 0) + 1);
  }

  // Sort by date
  const sorted = [...dayCounts.entries()].sort((a, b) => a[0].localeCompare(b[0]));

  return sorted.map(([date, count]) => ({ date, count }));
}

/**
 * Aggregate activity by hour of day
 */
export function aggregateActivityByHour(events: CommandEvent[]): HourActivity[] {
  const hourCounts = new Map<number, number>();

  // Initialize all hours to 0
  for (let h = 0; h < 24; h++) {
    hourCounts.set(h, 0);
  }

  for (const event of events) {
    if (!event.timestamp) {
      continue;
    }

    const hour = event.timestamp.getHours();
    hourCounts.set(hour, (hourCounts.get(hour) || 0) + 1);
  }

  // Return all 24 hours in order
  return Array.from({ length: 24 }, (_, hour) => ({
    hour,
    count: hourCounts.get(hour) || 0,
  }));
}

/**
 * Get the date range from events
 */
export function getDateRange(events: CommandEvent[]): { start?: Date; end?: Date } {
  let start: Date | undefined;
  let end: Date | undefined;

  for (const event of events) {
    if (!event.timestamp) {
      continue;
    }

    if (!start || event.timestamp < start) {
      start = event.timestamp;
    }

    if (!end || event.timestamp > end) {
      end = event.timestamp;
    }
  }

  return { start, end };
}
