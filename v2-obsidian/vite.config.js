import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Pin root to this folder so the dev server can be launched from the repo root:
//   node mystic-noir/node_modules/vite/bin/vite.js --config mystic-noir/vite.config.js
const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root,
  plugins: [react()],
  server: { host: true },
});
