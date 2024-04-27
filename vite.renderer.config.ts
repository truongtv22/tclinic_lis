import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// import { renderer } from 'unplugin-auto-expose';

// https://vitejs.dev/config
export default defineConfig({
  plugins: [
    react(),
    // renderer.vite({
    //   preloadEntry: path.resolve(__dirname, './src/preload/index.ts'),
    // }),
  ],
  resolve: {
    alias: {
      // main: path.resolve(__dirname, './src/main'),
      renderer: path.resolve(__dirname, './src/renderer'),
      shared: path.resolve(__dirname, './src/shared'),
      // components: path.resolve(__dirname, './src/components'),
      // constants: path.resolve(__dirname, './src/constants'),
      // layouts: path.resolve(__dirname, './src/layouts'),
      // pages: path.resolve(__dirname, './src/pages'),
      // routes: path.resolve(__dirname, './src/routes'),
      // services: path.resolve(__dirname, './src/services'),
      // store: path.resolve(__dirname, './src/store'),
      // types: path.resolve(__dirname, './src/types'),
      // utils: path.resolve(__dirname, './src/utils'),
      // hooks: path.resolve(__dirname, './src/hooks'),
    },
  },
  build: {
    outDir: '.vite/build/renderer',
  },
});
