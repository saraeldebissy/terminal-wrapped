/**
 * Simple logging utility with verbose mode support
 */

export interface Logger {
  log: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
  verbose: (...args: unknown[]) => void;
}

export function createLogger(verboseEnabled: boolean): Logger {
  const prefix = '[terminal-wrapped]';

  return {
    log: (...args: unknown[]) => {
      console.log(prefix, ...args);
    },
    error: (...args: unknown[]) => {
      console.error(prefix, 'Error:', ...args);
    },
    warn: (...args: unknown[]) => {
      console.warn(prefix, 'Warning:', ...args);
    },
    verbose: (...args: unknown[]) => {
      if (verboseEnabled) {
        console.log(prefix, '[verbose]', ...args);
      }
    },
  };
}

// Default logger instance (non-verbose)
export const logger = createLogger(false);
