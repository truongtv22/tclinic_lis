import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config
export default defineConfig({
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      components: path.resolve(__dirname, './src/components'),
      constants: path.resolve(__dirname, './src/constants'),
      layouts: path.resolve(__dirname, './src/layouts'),
      pages: path.resolve(__dirname, './src/pages'),
      routes: path.resolve(__dirname, './src/routes'),
      services: path.resolve(__dirname, './src/services'),
      store: path.resolve(__dirname, './src/store'),
      types: path.resolve(__dirname, './src/types'),
      utils: path.resolve(__dirname, './src/utils'),
    },
  },
});
