/**
 * Stats model and related types for Terminal Wrapped analytics
 * This interface is shared with the web frontend
 */

export interface StatsMeta {
  /** ISO timestamp when stats were generated */
  generatedAt: string;
  /** CLI version */
  version: string;
  /** Total number of commands processed */
  totalCommands: number;
  /** Number of distinct base commands */
  distinctCommands: number;
  /** Date range of the analyzed commands */
  dateRange: {
    start?: string;
    end?: string;
  };
  /** Filters that were applied */
  filters: {
    year?: number;
    since?: string;
    until?: string;
  };
}

export interface TopCommand {
  /** Base command name, e.g. "git" */
  name: string;
  /** Number of times this command was used */
  count: number;
  /** Sample full commands for display */
  fullExamples: string[];
  /** Percentile rank (0-1) relative to top command */
  percentile: number;
}

export interface TopFullCommand {
  /** Full command string, e.g. "git status" */
  command: string;
  /** Number of times this exact command was used */
  count: number;
}

export interface Category {
  /** Display name, e.g. "Version Control" */
  name: string;
  /** Slug for styling/icons, e.g. "git" */
  slug: string;
  /** Total commands in this category */
  count: number;
  /** Example commands from this category */
  exampleCommands: string[];
}

export interface DayActivity {
  /** Date in YYYY-MM-DD format */
  date: string;
  /** Number of commands on this day */
  count: number;
}

export interface HourActivity {
  /** Hour of day (0-23) */
  hour: number;
  /** Number of commands during this hour */
  count: number;
}

export interface TopDirectory {
  /** Directory path */
  path: string;
  /** Number of commands run in this directory */
  count: number;
}

export interface Streaks {
  /** Longest consecutive days with terminal activity */
  longestStreakDays: number;
  /** Current streak (ending on last active day) */
  currentStreakDays: number;
}

export interface QuirkyStats {
  /** Number of commands starting with sudo */
  sudoCount: number;
  /** Very short commands that might be aliases */
  aliasLikeCount: number;
  /** Dangerous commands (rm -rf, etc.) */
  destructiveCount: number;
}

export interface Highlight {
  /** Unique identifier for this highlight */
  id: string;
  /** Display title */
  title: string;
  /** Descriptive text */
  description: string;
  /** Optional icon key for the UI */
  iconKey?: string;
}

export interface Stats {
  meta: StatsMeta;
  topCommands: TopCommand[];
  topFullCommands: TopFullCommand[];
  categories: Category[];
  activityByDay: DayActivity[];
  activityByHour: HourActivity[];
  topDirectories: TopDirectory[];
  streaks: Streaks;
  quirky: QuirkyStats;
  highlights: Highlight[];
}
