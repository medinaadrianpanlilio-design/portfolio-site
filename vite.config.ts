import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { loadEnv } from 'vite'
import { defineConfig } from 'vitest/config'

import chatHandler from './api/chat.ts'

const env = loadEnv(process.env.NODE_ENV ?? 'development', process.cwd(), '')
for (const key of ['AI_API_KEY', 'OPENAI_API_KEY', 'AI_BASE_URL', 'AI_MODEL']) {
  if (!process.env[key] && env[key]) {
    process.env[key] = env[key]
  }
}

type Next = (error?: unknown) => void

function aiApiPlugin(): Plugin {
  const middleware = (
    req: IncomingMessage,
    res: ServerResponse,
    next: Next,
  ) => {
    const pathname = req.url?.split('?')[0]
    if (pathname !== '/api/chat') {
      next()
      return
    }

    void chatHandler(req, res).catch((error: unknown) => {
      console.error('Local AI guide request failed:', error)
      if (!res.headersSent) {
        res.statusCode = 500
        res.setHeader('Content-Type', 'application/json; charset=utf-8')
        res.end(JSON.stringify({ error: 'The AI guide failed locally.' }))
      }
    })
  }

  return {
    name: 'portfolio-ai-guide',
    configureServer(server) {
      server.middlewares.use(middleware)
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [aiApiPlugin(), react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    include: ['src/**/*.test.{ts,tsx}'],
    exclude: ['e2e/**', 'node_modules/**', 'dist/**'],
  },
})
