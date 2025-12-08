/**
 * Core types for shell history parsing
 */

export type ShellType = 'zsh' | 'bash' | 'fish' | 'unknown';

export interface CommandEvent {
  /** Full command line, e.g. "git status" */
  command: string;

  /** Tokenized form, e.g. ["git", "status"] */
  argv: string[];

  /** Parsed from history if available */
  timestamp?: Date;

  /** Optional; only set if history includes cwd */
  cwd?: string;

  /** Original line(s) from history file */
  rawLine: string;

  /** Detected shell type */
  shell: ShellType;
}

/**
 * Tokenize a command string into argv array
 * Handles basic quoted strings but not all edge cases
 */
export function tokenizeCommand(command: string): string[] {
  const tokens: string[] = [];
  let current = '';
  let inSingleQuote = false;
  let inDoubleQuote = false;
  let escape = false;

  for (let i = 0; i < command.length; i++) {
    const char = command[i];

    if (escape) {
      current += char;
      escape = false;
      continue;
    }

    if (char === '\\' && !inSingleQuote) {
      escape = true;
      continue;
    }

    if (char === "'" && !inDoubleQuote) {
      inSingleQuote = !inSingleQuote;
      continue;
    }

    if (char === '"' && !inSingleQuote) {
      inDoubleQuote = !inDoubleQuote;
      continue;
    }

    if (char === ' ' && !inSingleQuote && !inDoubleQuote) {
      if (current.length > 0) {
        tokens.push(current);
        current = '';
      }
      continue;
    }

    current += char;
  }

  if (current.length > 0) {
    tokens.push(current);
  }

  return tokens;
}

/**
 * Extract the base command (first token) from a command string
 */
export function getBaseCommand(command: string): string {
  const trimmed = command.trim();

  // Handle sudo prefix
  if (trimmed.startsWith('sudo ')) {
    const rest = trimmed.slice(5).trim();
    const spaceIndex = rest.indexOf(' ');
    return spaceIndex === -1 ? rest : rest.slice(0, spaceIndex);
  }

  const spaceIndex = trimmed.indexOf(' ');
  return spaceIndex === -1 ? trimmed : trimmed.slice(0, spaceIndex);
}
