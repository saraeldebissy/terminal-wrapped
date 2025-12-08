/**
 * Custom error types for Terminal Wrapped CLI
 */

export class HistoryFileNotFoundError extends Error {
  constructor(path: string) {
    super(`History file not found at: ${path}`);
    this.name = 'HistoryFileNotFoundError';
  }
}

export class HistoryParseError extends Error {
  constructor(message: string, public readonly line?: number) {
    super(line !== undefined ? `Parse error at line ${line}: ${message}` : message);
    this.name = 'HistoryParseError';
  }
}

export class ServerStartError extends Error {
  constructor(message: string, public readonly port?: number) {
    super(port !== undefined ? `Failed to start server on port ${port}: ${message}` : message);
    this.name = 'ServerStartError';
  }
}

export class WebBuildNotFoundError extends Error {
  constructor(path: string) {
    super(`Web build not found at: ${path}. Please run 'pnpm build:web' first.`);
    this.name = 'WebBuildNotFoundError';
  }
}
