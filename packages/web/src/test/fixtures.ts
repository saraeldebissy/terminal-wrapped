import type { Stats } from '../api/types';

/** Full stats with every section populated. */
export const fullStats: Stats = {
  meta: {
    generatedAt: '2026-06-20T00:00:00Z',
    version: '0.1.0',
    totalCommands: 1000,
    distinctCommands: 35,
    dateRange: { start: '2026-01-01T00:00:00Z', end: '2026-06-20T00:00:00Z' },
    filters: {},
  },
  topCommands: [
    { name: 'git', count: 630, fullExamples: ['git status'], percentile: 1 },
    { name: 'claude', count: 75, fullExamples: ['claude'], percentile: 0.8 },
    { name: 'pnpm', count: 75, fullExamples: ['pnpm install'], percentile: 0.8 },
    { name: 'cd', count: 65, fullExamples: ['cd ..'], percentile: 0.7 },
    { name: 'ls', count: 22, fullExamples: ['ls -la'], percentile: 0.5 },
  ],
  topFullCommands: [{ command: 'git status', count: 200 }],
  categories: [
    { name: 'Version Control', slug: 'git', count: 620, exampleCommands: ['git status'] },
    { name: 'Navigation', slug: 'nav', count: 200, exampleCommands: ['cd'] },
  ],
  activityByDay: [
    { date: '2026-06-13', count: 40 },
    { date: '2026-06-14', count: 183 },
  ],
  activityByHour: [
    { hour: 2, count: 120 },
    { hour: 14, count: 60 },
  ],
  topDirectories: [{ path: '~/builds', count: 400 }],
  parameters: {
    topFlags: [{ flag: '-la', count: 90, commands: ['ls'] }],
    commandFlagCombos: [{ command: 'ls', flags: ['-la'], count: 90 }],
  },
  secrets: {
    potentialSecrets: [
      { type: 'GitHub Token', redactedCommand: 'export GH_TOKEN=ghp_****', originalCommand: 'export GH_TOKEN=ghp_realtoken' },
    ],
    totalSecretsFound: 3,
    secretTypes: [{ type: 'GitHub Token', count: 3 }],
  },
  quirky: { sudoCount: 42, aliasLikeCount: 18, destructiveCount: 4 },
  highlights: [
    { id: 'night-owl', title: 'Night Owl', description: 'Most active at **2AM**', iconKey: 'moon' },
  ],
};

/** Minimal stats: no timestamps, no secrets, no flags, no categories. */
export const minimalStats: Stats = {
  meta: {
    generatedAt: '2026-06-20T00:00:00Z',
    version: '0.1.0',
    totalCommands: 50,
    distinctCommands: 8,
    dateRange: {},
    filters: {},
  },
  topCommands: [{ name: 'ls', count: 20, fullExamples: ['ls'], percentile: 1 }],
  topFullCommands: [],
  categories: [],
  activityByDay: [],
  activityByHour: [{ hour: 0, count: 0 }],
  topDirectories: [],
  parameters: { topFlags: [], commandFlagCombos: [] },
  secrets: { potentialSecrets: [], totalSecretsFound: 0, secretTypes: [] },
  quirky: { sudoCount: 0, aliasLikeCount: 0, destructiveCount: 0 },
  highlights: [],
};
