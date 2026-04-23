import dotenv from 'dotenv';
import express from 'express';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer as createViteServer } from 'vite';
import { identifyGhost } from '../src/services/geminiService';

dotenv.config({ path: '.env.local', quiet: true });
dotenv.config({ quiet: true });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const isPreview = process.argv.includes('--preview');
const port = Number(process.env.PORT || 3000);

async function startServer() {
  const app = express();

  app.use(express.json({ limit: '1mb' }));

  app.post('/api/ai-identify', async (req, res) => {
    const description =
      typeof req.body?.description === 'string' ? req.body.description : '';

    if (!description.trim()) {
      res.status(400).json({ error: 'Описание призрака пустое.' });
      return;
    }

    try {
      const result = await identifyGhost(description);
      res.json({ result });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Не удалось выполнить AI-поиск.';
      res.status(500).json({ error: message });
    }
  });

  if (isPreview) {
    app.use(express.static(distDir));
    app.get('*', async (_req, res) => {
      const html = await readFile(path.join(distDir, 'index.html'), 'utf8');
      res.type('html').send(html);
    });
  } else {
    const vite = await createViteServer({
      root: rootDir,
      server: {
        middlewareMode: true,
      },
      appType: 'spa',
    });

    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    const modeLabel = isPreview ? 'preview' : 'dev';
    console.log(`AI server running in ${modeLabel} mode on http://localhost:${port}`);
  });
}

startServer().catch((error) => {
  console.error(error);
  process.exit(1);
});
