/**
 * Path resolution utilities for Terminal Wrapped CLI
 */

import { homedir, tmpdir } from 'os';
import { join, dirname } from 'path';
import { mkdir } from 'fs/promises';
import { existsSync } from 'fs';

/**
 * Detect the default history file path based on $SHELL environment variable
 */
export function detectDefaultHistoryPath(): string | null {
  const shell = process.env.SHELL || '';
  const home = homedir();

  if (shell.includes('zsh')) {
    return join(home, '.zsh_history');
  }

  if (shell.includes('bash')) {
    return join(home, '.bash_history');
  }

  if (shell.includes('fish')) {
    return join(home, '.local', 'share', 'fish', 'fish_history');
  }

  // Fallback: try common paths in order
  const fallbackPaths = [
    join(home, '.zsh_history'),
    join(home, '.bash_history'),
    join(home, '.local', 'share', 'fish', 'fish_history'),
  ];

  for (const path of fallbackPaths) {
    if (existsSync(path)) {
      return path;
    }
  }

  return null;
}

/**
 * Create a temporary directory for serving the web app
 */
export async function createTempDir(prefix: string = 'terminal-wrapped'): Promise<string> {
  const timestamp = Date.now();
  const dirName = `${prefix}-${timestamp}`;
  const dirPath = join(tmpdir(), dirName);

  await mkdir(dirPath, { recursive: true });

  return dirPath;
}

/**
 * Get the path to the bundled web build assets
 * This resolves relative to the compiled dist directory
 */
export function getWebBuildPath(): string {
  // When running from dist/util/paths.js, we need to go up to cli root then into assets
  // __dirname in compiled code will be packages/cli/dist/util
  const distDir = dirname(__dirname); // packages/cli/dist
  const cliRoot = dirname(distDir);   // packages/cli
  return join(cliRoot, 'assets', 'web-build');
}

/**
 * Get suggested history file paths for error messages
 */
export function getSuggestedHistoryPaths(): string[] {
  const home = homedir();
  return [
    `zsh:  ${join(home, '.zsh_history')}`,
    `bash: ${join(home, '.bash_history')}`,
    `fish: ${join(home, '.local', 'share', 'fish', 'fish_history')}`,
  ];
}
