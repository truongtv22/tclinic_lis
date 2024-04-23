import path from 'path';
import { defineConfig } from 'vite';
// import { preload } from 'unplugin-auto-expose';

// https://vitejs.dev/config
export default defineConfig({
  // plugins: [preload.vite()],
  resolve: {
    alias: {
      shared: path.resolve(__dirname, './src/shared'),
    },
  },
  build: {
    outDir: '.vite/build/preload',
  },
});
