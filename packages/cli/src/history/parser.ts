/**
 * Main history parser orchestrator
 *
 * Reads a history file, detects its format, parses it into CommandEvent[],
 * and applies the limit.
 */

import { readFile } from 'fs/promises';
import { existsSync } from 'fs';

import type { CommandEvent, ShellType } from './models';
import { detectHistoryFormat, detectShellFromPath } from './detectors';
import { parseZshHistory } from './parsers/zsh';
import { parseBashHistory } from './parsers/bash';
import { parseFishHistory } from './parsers/fish';
import { parseSimpleHistory } from './parsers/simple';
import { HistoryFileNotFoundError, HistoryParseError } from '../util/errors';

export interface ParseHistoryOptions {
  /** Maximum number of commands to return (most recent N) */
  limit?: number;
  /** Override shell type detection */
  shell?: ShellType;
}

/**
 * Parse a shell history file into CommandEvent array
 */
export async function parseHistory(
  filePath: string,
  options: ParseHistoryOptions = {}
): Promise<CommandEvent[]> {
  const { limit = 50000, shell: shellOverride } = options;

  // Validate file exists
  if (!existsSync(filePath)) {
    throw new HistoryFileNotFoundError(filePath);
  }

  // Read file content
  let content: string;
  try {
    content = await readFile(filePath, 'utf-8');
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new HistoryParseError(`Failed to read history file: ${message}`);
  }

  if (content.trim().length === 0) {
    return [];
  }

  // Detect format
  let shell: ShellType;
  if (shellOverride) {
    shell = shellOverride;
  } else {
    // Try path-based detection first, then content-based
    shell = detectShellFromPath(filePath);
    if (shell === 'unknown') {
      // Get a sample of the file for format detection
      const sample = content.slice(0, 10000);
      shell = detectHistoryFormat(sample);
    }
  }

  // Parse based on detected format
  let events: CommandEvent[];
  switch (shell) {
    case 'zsh':
      events = parseZshHistory(content, shell);
      break;
    case 'bash':
      events = parseBashHistory(content, shell);
      break;
    case 'fish':
      events = parseFishHistory(content, shell);
      break;
    default:
      events = parseSimpleHistory(content, shell);
  }

  // Apply limit (keep most recent)
  if (limit > 0 && events.length > limit) {
    events = events.slice(-limit);
  }

  return events;
}

/**
 * Filter events by date range
 */
export function filterEventsByDate(
  events: CommandEvent[],
  options: {
    since?: Date;
    until?: Date;
    year?: number;
  }
): CommandEvent[] {
  let { since, until } = options;
  const { year } = options;

  // Convert year to date range
  if (year !== undefined) {
    since = new Date(year, 0, 1); // Jan 1
    until = new Date(year, 11, 31, 23, 59, 59, 999); // Dec 31
  }

  if (!since && !until) {
    return events;
  }

  return events.filter(event => {
    // If event has no timestamp, include it (we can't filter)
    if (!event.timestamp) {
      return true;
    }

    if (since && event.timestamp < since) {
      return false;
    }

    if (until && event.timestamp > until) {
      return false;
    }

    return true;
  });
}

// Re-export types and utilities
export type { CommandEvent, ShellType } from './models';
export { tokenizeCommand, getBaseCommand } from './models';
