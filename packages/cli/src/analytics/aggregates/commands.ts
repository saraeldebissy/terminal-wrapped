/**
 * Command frequency aggregation
 */

import type { CommandEvent } from '../../history/models';
import { getBaseCommand } from '../../history/models';
import type { TopCommand, TopFullCommand } from '../models';

interface CommandsAggregation {
  topCommands: TopCommand[];
  topFullCommands: TopFullCommand[];
  totalCommands: number;
  distinctCommands: number;
}

const MAX_TOP_COMMANDS = 20;
const MAX_FULL_COMMANDS = 30;
const MAX_EXAMPLES = 5;

/**
 * Aggregate command frequency statistics
 */
export function aggregateCommands(events: CommandEvent[]): CommandsAggregation {
  const baseCommandCounts = new Map<string, number>();
  const fullCommandCounts = new Map<string, number>();
  const baseToExamples = new Map<string, Set<string>>();

  for (const event of events) {
    const baseCmd = getBaseCommand(event.command);
    const fullCmd = event.command;

    // Count base commands
    baseCommandCounts.set(baseCmd, (baseCommandCounts.get(baseCmd) || 0) + 1);

    // Count full commands
    fullCommandCounts.set(fullCmd, (fullCommandCounts.get(fullCmd) || 0) + 1);

    // Collect examples for base commands
    if (!baseToExamples.has(baseCmd)) {
      baseToExamples.set(baseCmd, new Set());
    }
    const examples = baseToExamples.get(baseCmd)!;
    if (examples.size < MAX_EXAMPLES) {
      examples.add(fullCmd);
    }
  }

  // Sort and create top commands
  const sortedBase = [...baseCommandCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, MAX_TOP_COMMANDS);

  const maxCount = sortedBase.length > 0 ? sortedBase[0][1] : 1;

  const topCommands: TopCommand[] = sortedBase.map(([name, count]) => ({
    name,
    count,
    fullExamples: [...(baseToExamples.get(name) || [])].slice(0, MAX_EXAMPLES),
    percentile: count / maxCount,
  }));

  // Sort and create top full commands
  const sortedFull = [...fullCommandCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, MAX_FULL_COMMANDS);

  const topFullCommands: TopFullCommand[] = sortedFull.map(([command, count]) => ({
    command,
    count,
  }));

  return {
    topCommands,
    topFullCommands,
    totalCommands: events.length,
    distinctCommands: baseCommandCounts.size,
  };
}
