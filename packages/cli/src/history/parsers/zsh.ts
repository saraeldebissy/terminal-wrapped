/**
 * Zsh history file parser
 *
 * Zsh history formats:
 * 1. Extended format (EXTENDED_HISTORY): `: 1672531199:0;command here`
 * 2. Simple format: just the command per line
 */

import type { CommandEvent, ShellType } from '../models';
import { tokenizeCommand } from '../models';

// Pattern for zsh extended history: `: epoch:duration;command`
const ZSH_EXTENDED_PATTERN = /^: (\d+):(\d+);(.*)$/;

export function parseZshHistory(content: string, shell: ShellType = 'zsh'): CommandEvent[] {
  const events: CommandEvent[] = [];
  const lines = content.split('\n');

  let currentCommand = '';
  let currentTimestamp: Date | undefined;
  let currentRawLines: string[] = [];

  for (const line of lines) {
    // Check for extended history format
    const match = ZSH_EXTENDED_PATTERN.exec(line);

    if (match) {
      // If we have a pending multi-line command, save it first
      if (currentCommand.length > 0) {
        events.push(createEvent(currentCommand, currentTimestamp, currentRawLines.join('\n'), shell));
      }

      const epoch = parseInt(match[1], 10);
      const command = match[3];

      // Check if this command continues on the next line (ends with \)
      if (command.endsWith('\\')) {
        currentCommand = command.slice(0, -1);
        currentTimestamp = new Date(epoch * 1000);
        currentRawLines = [line];
      } else {
        events.push(createEvent(command, new Date(epoch * 1000), line, shell));
        currentCommand = '';
        currentTimestamp = undefined;
        currentRawLines = [];
      }
    } else if (currentCommand.length > 0) {
      // Continuation of a multi-line command
      currentRawLines.push(line);
      if (line.endsWith('\\')) {
        currentCommand += '\n' + line.slice(0, -1);
      } else {
        currentCommand += '\n' + line;
        events.push(createEvent(currentCommand, currentTimestamp, currentRawLines.join('\n'), shell));
        currentCommand = '';
        currentTimestamp = undefined;
        currentRawLines = [];
      }
    } else if (line.trim().length > 0 && !line.startsWith(':')) {
      // Simple format (no timestamp) - just a command per line
      events.push(createEvent(line, undefined, line, shell));
    }
  }

  // Handle any remaining multi-line command
  if (currentCommand.length > 0) {
    events.push(createEvent(currentCommand, currentTimestamp, currentRawLines.join('\n'), shell));
  }

  return events;
}

function createEvent(
  command: string,
  timestamp: Date | undefined,
  rawLine: string,
  shell: ShellType
): CommandEvent {
  const trimmedCommand = command.trim();
  return {
    command: trimmedCommand,
    argv: tokenizeCommand(trimmedCommand),
    timestamp,
    rawLine,
    shell,
  };
}
