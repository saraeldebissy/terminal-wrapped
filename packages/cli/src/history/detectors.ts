/**
 * Shell and history format detection utilities
 */

import type { ShellType } from './models';

/**
 * Detect shell type from $SHELL environment variable
 */
export function detectShellFromEnv(): ShellType {
  const shell = process.env.SHELL || '';

  if (shell.includes('zsh')) {
    return 'zsh';
  }

  if (shell.includes('bash')) {
    return 'bash';
  }

  if (shell.includes('fish')) {
    return 'fish';
  }

  return 'unknown';
}

/**
 * Detect history format by analyzing a sample of the file content
 */
export function detectHistoryFormat(sample: string): ShellType {
  const lines = sample.split('\n').filter(line => line.trim().length > 0);

  if (lines.length === 0) {
    return 'unknown';
  }

  // Check for zsh extended history format: `: 1672531199:0;command`
  const zshExtendedPattern = /^: \d+:\d+;/;
  if (lines.some(line => zshExtendedPattern.test(line))) {
    return 'zsh';
  }

  // Check for fish YAML-like format: `- cmd: command`
  const fishPattern = /^- cmd:/;
  if (lines.some(line => fishPattern.test(line))) {
    return 'fish';
  }

  // Check for bash with timestamps: `#1672531199` followed by command
  const bashTimestampPattern = /^#\d{10,}$/;
  let foundBashTimestamp = false;
  for (let i = 0; i < lines.length - 1; i++) {
    if (bashTimestampPattern.test(lines[i])) {
      foundBashTimestamp = true;
      break;
    }
  }
  if (foundBashTimestamp) {
    return 'bash';
  }

  // If lines look like plain commands, could be bash without timestamps or unknown
  // We'll default to 'unknown' which uses the simple parser
  return 'unknown';
}

/**
 * Detect shell type from file path hints
 */
export function detectShellFromPath(filePath: string): ShellType {
  const lowerPath = filePath.toLowerCase();

  if (lowerPath.includes('zsh') || lowerPath.includes('.zsh_history')) {
    return 'zsh';
  }

  if (lowerPath.includes('bash') || lowerPath.includes('.bash_history')) {
    return 'bash';
  }

  if (lowerPath.includes('fish') || lowerPath.includes('fish_history')) {
    return 'fish';
  }

  return 'unknown';
}
