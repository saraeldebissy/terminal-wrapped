/**
 * Simple/fallback history parser
 *
 * For unknown or plain history formats where each line is a command.
 * No timestamps or metadata.
 */

import type { CommandEvent, ShellType } from '../models';
import { tokenizeCommand } from '../models';

export function parseSimpleHistory(content: string, shell: ShellType = 'unknown'): CommandEvent[] {
  const events: CommandEvent[] = [];
  const lines = content.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip empty lines and comment lines
    if (trimmed.length === 0 || trimmed.startsWith('#')) {
      continue;
    }

    events.push({
      command: trimmed,
      argv: tokenizeCommand(trimmed),
      rawLine: line,
      shell,
    });
  }

  return events;
}
