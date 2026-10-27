import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { IncomingMessage, ServerResponse } from 'node:http';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, loadEnv, type ViteDevServer } from 'vite';
import vercelConfig from './vercel.json' with { type: 'json' };
import { getVercelEntries } from 'vite-plugin-vercel';
import vercel from 'vite-plugin-vercel/vite';

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const apiSourceDir = path.resolve(rootDir, 'api');
const apiSourceDirForScan = apiSourceDir.replace(/\\/g, '/').replace(/^[A-Za-z]:/, '');
const scanDir = path.relative(process.cwd(), apiSourceDir).replace(/\\/g, '/');
const apiEntries = (await getVercelEntries(scanDir, { destination: 'api' })).map((entry) => ({
  ...entry,
  id: path.resolve(apiSourceDir, path.posix.relative(apiSourceDirForScan, entry.id)),
}));

interface ApiRequest {
  method?: string;
  query: Record<string, string | string[]>;
}

interface ApiResponse {
  setHeader(name: string, value: string): void;
  status(code: number): ApiResponse;
  json(body: unknown): void;
}

type ApiHandler = (req: ApiRequest, res: ApiResponse) => unknown | Promise<unknown>;

function isApiHandler(handler: unknown): handler is ApiHandler {
  return typeof handler === 'function';
}

function localApiPlugin(entries: typeof apiEntries) {
  return {
    name: 'local-api-dev',
    apply: 'serve' as const,
    configureServer(server: ViteDevServer) {
      server.middlewares.use(async (
        request: IncomingMessage,
        response: ServerResponse,
        next: (error?: Error) => void,
      ) => {
        if (!request.url) {
          next();
          return;
        }

        const url = new URL(request.url, 'http://localhost');
        const entry = entries.find((candidate) => candidate.route === url.pathname);
        if (!entry) {
          next();
          return;
        }

        try {
          const module = await server.ssrLoadModule(entry.id);
          if (!isApiHandler(module.default)) {
            throw new Error(`API route ${url.pathname} must have a default handler export`);
          }

          const query: ApiRequest['query'] = {};
          for (const [key, value] of url.searchParams) {
            const existing = query[key];
            query[key] = existing === undefined
              ? value
              : Array.isArray(existing) ? [...existing, value] : [existing, value];
          }

          const apiResponse: ApiResponse = {
            setHeader: (name, value) => response.setHeader(name, value),
            status(code) {
              response.statusCode = code;
              return apiResponse;
            },
            json(body) {
              response.setHeader('Content-Type', 'application/json; charset=utf-8');
              response.end(JSON.stringify(body));
            },
          };

          await module.default({ method: request.method, query }, apiResponse);
          if (!response.writableEnded) {
            throw new Error(`API route ${url.pathname} did not send a response`);
          }
        } catch (error) {
          server.config.logger.error(
            `Local API route failed for ${url.pathname}: ${error instanceof Error ? error.message : String(error)}`,
          );
          if (!response.headersSent) {
            response.statusCode = 500;
            response.setHeader('Content-Type', 'application/json; charset=utf-8');
            response.end(JSON.stringify({ error: 'Internal Server Error' }));
          } else if (!response.writableEnded) {
            response.end();
          }
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, rootDir, '');
  for (const [key, value] of Object.entries(env)) {
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }

  return {
    base: process.env.GITHUB_PAGES ? '/debybel-site/' : '/',
    plugins: [
      localApiPlugin(apiEntries),
      react(),
      tailwindcss(),
      vercel({
        entries: apiEntries,
        rewrites: vercelConfig.rewrites.map((rewrite) => ({ ...rewrite, enforce: 'post' })),
      }),
    ],
    resolve: {
      alias: { '@': path.resolve(rootDir, 'src') },
      dedupe: ['react', 'react-dom'],
    },
    server: {
      host: '0.0.0.0',
      port: Number(process.env.PORT ?? 5173),
      allowedHosts: true,
    },
    preview: { host: '0.0.0.0', allowedHosts: true },
  };
});
