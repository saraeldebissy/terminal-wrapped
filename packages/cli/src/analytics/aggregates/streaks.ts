/**
 * Streak calculation utilities
 */

import type { DayActivity, Streaks } from '../models';

/**
 * Parse YYYY-MM-DD string to Date
 */
function parseDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Check if two dates are consecutive days
 */
function isConsecutive(date1: Date, date2: Date): boolean {
  const oneDay = 24 * 60 * 60 * 1000;
  const diff = date2.getTime() - date1.getTime();
  return diff === oneDay;
}

/**
 * Calculate activity streaks from daily activity data
 */
export function calculateStreaks(activityByDay: DayActivity[]): Streaks {
  if (activityByDay.length === 0) {
    return {
      longestStreakDays: 0,
      currentStreakDays: 0,
    };
  }

  // Sort by date (should already be sorted, but ensure it)
  const sorted = [...activityByDay].sort((a, b) => a.date.localeCompare(b.date));

  let longestStreak = 1;
  let currentStreak = 1;

  // Calculate longest streak
  for (let i = 1; i < sorted.length; i++) {
    const prevDate = parseDate(sorted[i - 1].date);
    const currDate = parseDate(sorted[i].date);

    if (isConsecutive(prevDate, currDate)) {
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }

  // Calculate current streak (counting back from the last day)
  // Check if the last active day is recent (within last 2 days)
  const lastActiveDate = parseDate(sorted[sorted.length - 1].date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const daysSinceLastActive = Math.floor(
    (today.getTime() - lastActiveDate.getTime()) / (24 * 60 * 60 * 1000)
  );

  // If more than 1 day since last activity, current streak is 0
  if (daysSinceLastActive > 1) {
    return {
      longestStreakDays: longestStreak,
      currentStreakDays: 0,
    };
  }

  // Count backwards from the end to find current streak
  let currentStreakFromEnd = 1;
  for (let i = sorted.length - 1; i > 0; i--) {
    const prevDate = parseDate(sorted[i - 1].date);
    const currDate = parseDate(sorted[i].date);

    if (isConsecutive(prevDate, currDate)) {
      currentStreakFromEnd++;
    } else {
      break;
    }
  }

  return {
    longestStreakDays: longestStreak,
    currentStreakDays: currentStreakFromEnd,
  };
}
