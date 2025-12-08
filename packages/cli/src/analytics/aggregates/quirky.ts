/**
 * Quirky/fun statistics aggregation
 */

import type { CommandEvent } from '../../history/models';
import { getBaseCommand } from '../../history/models';
import type { QuirkyStats } from '../models';

/**
 * Known short commands that are NOT aliases (standard Unix commands)
 */
const STANDARD_SHORT_COMMANDS = new Set([
  'ls', 'cd', 'cp', 'mv', 'rm', 'ln', 'ps', 'bg', 'fg', 'df', 'du',
  'id', 'od', 'wc', 'tr', 'nl', 'pr', 'dd', 'bc', 'dc', 'ed', 'ex',
  'vi', 'at', 'sh', 'su', 'ar', 'as', 'cc', 'ld', 'nm', 'go',
]);

/**
 * Patterns for destructive commands
 */
const DESTRUCTIVE_PATTERNS = [
  /^rm\s+(-[a-zA-Z]*r[a-zA-Z]*\s+|.*-rf\s+|.*--recursive)/,  // rm -r, rm -rf, rm --recursive
  /^rm\s+-[a-zA-Z]*f/,                                        // rm -f (force)
  /^rmdir\s/,                                                  // rmdir
  /^kubectl\s+delete\s/,                                       // kubectl delete
  /^docker\s+(rm|rmi|system\s+prune)/,                        // docker rm, rmi, prune
  /DROP\s+(TABLE|DATABASE)/i,                                  // SQL DROP
  /^git\s+(reset\s+--hard|clean\s+-fd|push\s+.*--force)/,     // git destructive ops
  /^:(q!|wq!)/,                                                // vim force quit (counts as quitting without saving)
];

/**
 * Aggregate quirky statistics
 */
export function aggregateQuirky(events: CommandEvent[]): QuirkyStats {
  let sudoCount = 0;
  let aliasLikeCount = 0;
  let destructiveCount = 0;

  for (const event of events) {
    const command = event.command;
    const baseCmd = getBaseCommand(command);

    // Count sudo
    if (command.startsWith('sudo ')) {
      sudoCount++;
    }

    // Count alias-like (short commands not in standard list)
    if (baseCmd.length <= 2 && !STANDARD_SHORT_COMMANDS.has(baseCmd)) {
      aliasLikeCount++;
    }

    // Count destructive commands
    for (const pattern of DESTRUCTIVE_PATTERNS) {
      if (pattern.test(command)) {
        destructiveCount++;
        break;
      }
    }
  }

  return {
    sudoCount,
    aliasLikeCount,
    destructiveCount,
  };
}
