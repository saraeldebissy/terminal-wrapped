/**
 * Main CLI implementation for Terminal Wrapped
 */

import { resolve } from 'path';
import { writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import open from 'open';

import { parseHistory, filterEventsByDate } from './history/parser';
import { calculateStats } from './analytics';
import { startServer } from './server/server';
import { copyWebBuildToDir } from './scaffolding/copyWebBuild';
import { createLogger, type Logger } from './util/logger';
import { detectDefaultHistoryPath, createTempDir, getSuggestedHistoryPaths } from './util/paths';
import { HistoryFileNotFoundError } from './util/errors';

export interface CLIOptions {
  /** Filter to commands in a specific year */
  year?: number;
  /** Include commands on or after this date (YYYY-MM-DD) */
  since?: string;
  /** Include commands on or before this date (YYYY-MM-DD) */
  until?: string;
  /** Maximum number of commands to parse */
  limit: string;
  /** Port to serve the UI on */
  port: string;
  /** Whether to open the browser automatically */
  open: boolean;
  /** Enable verbose logging */
  verbose: boolean;
  /** Path to write JSON stats instead of starting UI */
  json?: string;
}

/**
 * Main entry point for the CLI
 */
export async function runTerminalWrapped(
  historyPath: string | undefined,
  options: CLIOptions
): Promise<void> {
  const logger = createLogger(options.verbose);

  try {
    // 1. Resolve history path
    const resolvedPath = resolveHistoryPath(historyPath, logger);

    // 2. Validate file exists
    if (!existsSync(resolvedPath)) {
      throw new HistoryFileNotFoundError(resolvedPath);
    }

    logger.log(`Reading history from: ${resolvedPath}`);

    // 3. Parse history
    const limit = parseInt(options.limit, 10) || 50000;
    logger.verbose(`Parsing history with limit: ${limit}`);

    const events = await parseHistory(resolvedPath, { limit });
    logger.verbose(`Parsed ${events.length} commands`);

    if (events.length === 0) {
      logger.warn('No commands found in history file.');
      logger.log('The history file may be empty or in an unrecognized format.');
      return;
    }

    // 4. Apply date filters
    const dateFilters = parseDateFilters(options);
    const filteredEvents = filterEventsByDate(events, dateFilters);
    logger.verbose(`After date filtering: ${filteredEvents.length} commands`);

    if (filteredEvents.length === 0) {
      logger.warn('No commands match the specified date filters.');
      return;
    }

    // 5. Calculate stats
    logger.verbose('Calculating statistics...');
    const stats = calculateStats(filteredEvents, dateFilters);
    logger.verbose(`Generated stats with ${stats.topCommands.length} top commands`);

    // 6. Handle --json flag
    if (options.json) {
      const jsonPath = resolve(options.json);
      await writeFile(jsonPath, JSON.stringify(stats, null, 2));
      logger.log(`Stats written to: ${jsonPath}`);
      return;
    }

    // 7. Set up and serve the web UI
    logger.log('Starting Terminal Wrapped UI...');

    // Create temp directory
    const tempDir = await createTempDir();
    logger.verbose(`Created temp directory: ${tempDir}`);

    // Copy web build
    await copyWebBuildToDir(tempDir);
    logger.verbose('Copied web build to temp directory');

    // Write stats.json
    const statsPath = resolve(tempDir, 'stats.json');
    await writeFile(statsPath, JSON.stringify(stats, null, 2));
    logger.verbose(`Wrote stats to: ${statsPath}`);

    // Start server
    const port = parseInt(options.port, 10) || 3000;
    const { url, close } = await startServer({ dir: tempDir, port });

    logger.log(`\n✨ Terminal Wrapped is ready!`);
    logger.log(`   ${url}\n`);

    // Open browser
    if (options.open) {
      logger.verbose('Opening browser...');
      await open(url);
    }

    // Keep process running
    logger.log('Press Ctrl+C to stop the server.');

    // Handle graceful shutdown
    process.on('SIGINT', () => {
      logger.log('\nShutting down...');
      close();
      process.exit(0);
    });

    process.on('SIGTERM', () => {
      close();
      process.exit(0);
    });

    // Keep the process alive
    await new Promise(() => {});

  } catch (error) {
    handleError(error, logger);
    process.exit(1);
  }
}

/**
 * Resolve the history file path
 */
function resolveHistoryPath(historyPath: string | undefined, logger: Logger): string {
  if (historyPath) {
    return resolve(historyPath);
  }

  // Auto-detect
  const detected = detectDefaultHistoryPath();

  if (detected) {
    logger.verbose(`Auto-detected history file: ${detected}`);
    return detected;
  }

  // Could not detect, show error with suggestions
  const suggestions = getSuggestedHistoryPaths();
  throw new Error(
    `Could not auto-detect history file.\n\n` +
    `Please specify the path explicitly:\n` +
    `  terminal-wrapped /path/to/your/history\n\n` +
    `Common history file locations:\n` +
    suggestions.map(s => `  ${s}`).join('\n')
  );
}

/**
 * Parse date filter options
 */
function parseDateFilters(options: CLIOptions): {
  year?: number;
  since?: Date;
  until?: Date;
} {
  const result: { year?: number; since?: Date; until?: Date } = {};

  if (options.year !== undefined) {
    result.year = options.year;
  }

  if (options.since) {
    const parsed = new Date(options.since);
    if (!isNaN(parsed.getTime())) {
      result.since = parsed;
    }
  }

  if (options.until) {
    const parsed = new Date(options.until);
    if (!isNaN(parsed.getTime())) {
      result.until = parsed;
    }
  }

  return result;
}

/**
 * Handle errors with user-friendly messages
 */
function handleError(error: unknown, logger: Logger): void {
  if (error instanceof HistoryFileNotFoundError) {
    logger.error(error.message);
    logger.log('\nTip: Try specifying the path explicitly:');
    logger.log('  terminal-wrapped /path/to/your/history\n');
    logger.log('Common history file locations:');
    for (const suggestion of getSuggestedHistoryPaths()) {
      logger.log(`  ${suggestion}`);
    }
    return;
  }

  if (error instanceof Error) {
    logger.error(error.message);
    if (error.stack && process.env.DEBUG) {
      console.error(error.stack);
    }
    return;
  }

  logger.error(String(error));
}
