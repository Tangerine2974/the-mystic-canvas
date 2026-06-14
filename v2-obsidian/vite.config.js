import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Pin root to this folder so the dev server can be launched from the repo root:
//   node mystic-noir/node_modules/vite/bin/vite.js --config mystic-noir/vite.config.js
const root = path.dirname(fileURLToPath(import.meta.url));

// base: '/' in dev so the local preview works at localhost:5173/, and the GitHub Pages
// project sub-path ('/the-mystic-canvas/') for the production build that gets deployed.
export default defineConfig(({ command }) => ({
  root,
  base: command === 'build' ? '/the-mystic-canvas/' : '/',
  plugins: [react()],
  server: { host: true },
}));
