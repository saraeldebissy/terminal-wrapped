/**
 * Bash history file parser
 *
 * Bash history formats:
 * 1. With timestamps (HISTTIMEFORMAT set):
 *    #1672531199
 *    command here
 *
 * 2. Without timestamps: just the command per line
 */

import type { CommandEvent, ShellType } from '../models';
import { tokenizeCommand } from '../models';

// Pattern for bash timestamp line: #epoch
const BASH_TIMESTAMP_PATTERN = /^#(\d{10,})$/;

export function parseBashHistory(content: string, shell: ShellType = 'bash'): CommandEvent[] {
  const events: CommandEvent[] = [];
  const lines = content.split('\n');

  let pendingTimestamp: Date | undefined;

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.length === 0) {
      continue;
    }

    // Check for timestamp line
    const match = BASH_TIMESTAMP_PATTERN.exec(trimmed);

    if (match) {
      const epoch = parseInt(match[1], 10);
      pendingTimestamp = new Date(epoch * 1000);
      continue;
    }

    // This is a command line
    events.push({
      command: trimmed,
      argv: tokenizeCommand(trimmed),
      timestamp: pendingTimestamp,
      rawLine: pendingTimestamp ? `#${Math.floor(pendingTimestamp.getTime() / 1000)}\n${line}` : line,
      shell,
    });

    // Reset pending timestamp after using it
    pendingTimestamp = undefined;
  }

  return events;
}
