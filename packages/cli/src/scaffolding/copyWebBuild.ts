/**
 * Copy web build assets to a target directory
 */

import { cp } from 'fs/promises';
import { existsSync } from 'fs';
import { getWebBuildPath } from '../util/paths';
import { WebBuildNotFoundError } from '../util/errors';

/**
 * Copy the bundled web build to a target directory
 */
export async function copyWebBuildToDir(targetDir: string): Promise<void> {
  const webBuildPath = getWebBuildPath();

  if (!existsSync(webBuildPath)) {
    throw new WebBuildNotFoundError(webBuildPath);
  }

  await cp(webBuildPath, targetDir, { recursive: true });
}
