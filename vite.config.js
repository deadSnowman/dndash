import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Vite configuration for the React app and GitHub Pages-friendly relative assets.
 *
 * @type {import('vite').UserConfig}
 */
export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: false
  }
});
