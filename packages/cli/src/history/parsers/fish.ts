/**
 * Fish shell history file parser
 *
 * Fish history format (YAML-like):
 * - cmd: git status
 *   when: 1672531199
 *   paths:
 *     - /some/path
 */

import type { CommandEvent, ShellType } from '../models';
import { tokenizeCommand } from '../models';

export function parseFishHistory(content: string, shell: ShellType = 'fish'): CommandEvent[] {
  const events: CommandEvent[] = [];
  const lines = content.split('\n');

  let currentCommand: string | null = null;
  let currentTimestamp: Date | undefined;
  let currentPaths: string[] = [];
  let currentRawLines: string[] = [];
  let inPaths = false;

  for (const line of lines) {
    // New command entry
    if (line.startsWith('- cmd:')) {
      // Save previous command if exists
      if (currentCommand !== null) {
        events.push(createEvent(currentCommand, currentTimestamp, currentPaths, currentRawLines, shell));
      }

      // Extract command (handle both `- cmd: foo` and `- cmd: "foo"`)
      let cmd = line.slice(6).trim();
      // Remove surrounding quotes if present
      if ((cmd.startsWith('"') && cmd.endsWith('"')) || (cmd.startsWith("'") && cmd.endsWith("'"))) {
        cmd = cmd.slice(1, -1);
      }
      // Handle escaped characters
      cmd = cmd.replace(/\\n/g, '\n').replace(/\\\\/g, '\\');

      currentCommand = cmd;
      currentTimestamp = undefined;
      currentPaths = [];
      currentRawLines = [line];
      inPaths = false;
      continue;
    }

    // Timestamp line
    if (line.startsWith('  when:')) {
      const epochStr = line.slice(7).trim();
      const epoch = parseInt(epochStr, 10);
      if (!isNaN(epoch)) {
        currentTimestamp = new Date(epoch * 1000);
      }
      currentRawLines.push(line);
      inPaths = false;
      continue;
    }

    // Paths section start
    if (line.startsWith('  paths:')) {
      inPaths = true;
      currentRawLines.push(line);
      continue;
    }

    // Path entry
    if (inPaths && line.startsWith('    - ')) {
      const path = line.slice(6).trim();
      currentPaths.push(path);
      currentRawLines.push(line);
      continue;
    }

    // Any other indented line (continuation or other metadata)
    if (line.startsWith('  ') && currentCommand !== null) {
      currentRawLines.push(line);
      inPaths = false;
      continue;
    }

    // Empty line or unrecognized format - reset paths parsing
    inPaths = false;
  }

  // Don't forget the last command
  if (currentCommand !== null) {
    events.push(createEvent(currentCommand, currentTimestamp, currentPaths, currentRawLines, shell));
  }

  return events;
}

function createEvent(
  command: string,
  timestamp: Date | undefined,
  paths: string[],
  rawLines: string[],
  shell: ShellType
): CommandEvent {
  const event: CommandEvent = {
    command,
    argv: tokenizeCommand(command),
    timestamp,
    rawLine: rawLines.join('\n'),
    shell,
  };

  // Set cwd if paths contains exactly one entry (common case)
  if (paths.length === 1) {
    event.cwd = paths[0];
  }

  return event;
}
