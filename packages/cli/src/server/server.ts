/**
 * Express server for serving the web app
 */

import express from 'express';
import { join } from 'path';
import { existsSync } from 'fs';
import type { Server } from 'http';
import { ServerStartError } from '../util/errors';

export interface StartServerOptions {
  /** Directory containing the web build and stats.json */
  dir: string;
  /** Port to serve on */
  port: number;
}

export interface ServerResult {
  /** The URL the server is listening on */
  url: string;
  /** Function to close the server */
  close: () => void;
}

const MAX_PORT_ATTEMPTS = 5;

/**
 * Start the Express server to serve the web app
 */
export async function startServer(options: StartServerOptions): Promise<ServerResult> {
  const { dir, port: initialPort } = options;

  const app = express();

  // Serve static files
  app.use(express.static(dir));

  // SPA fallback - serve index.html for any unmatched routes
  app.get('*', (req, res) => {
    const indexPath = join(dir, 'index.html');
    if (existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send('Not found');
    }
  });

  // Try to bind to port, retrying if in use
  let server: Server | null = null;
  let actualPort = initialPort;

  for (let attempt = 0; attempt < MAX_PORT_ATTEMPTS; attempt++) {
    try {
      server = await tryListen(app, actualPort);
      break;
    } catch (error) {
      if (isAddressInUse(error) && attempt < MAX_PORT_ATTEMPTS - 1) {
        actualPort++;
        continue;
      }
      throw new ServerStartError(
        error instanceof Error ? error.message : String(error),
        actualPort
      );
    }
  }

  if (!server) {
    throw new ServerStartError('Failed to start server after multiple attempts', initialPort);
  }

  const url = `http://localhost:${actualPort}`;

  return {
    url,
    close: () => {
      server?.close();
    },
  };
}

/**
 * Attempt to listen on a port
 */
function tryListen(app: express.Application, port: number): Promise<Server> {
  return new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      resolve(server);
    });

    server.on('error', (error) => {
      reject(error);
    });
  });
}

/**
 * Check if an error is EADDRINUSE
 */
function isAddressInUse(error: unknown): boolean {
  return (
    error !== null &&
    typeof error === 'object' &&
    'code' in error &&
    error.code === 'EADDRINUSE'
  );
}
