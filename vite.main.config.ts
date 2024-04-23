import path from 'path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config
export default defineConfig({
  plugins: [
    {
      name: 'restart',
      closeBundle() {
        process.stdin.emit('data', 'rs');
      },
    },
  ],
  resolve: {
    // Some libs that can run in both Web and Node.js, such as `axios`, we need to tell Vite to build them in Node.js.
    browserField: false,
    mainFields: ['module', 'jsnext:main', 'jsnext'],
    alias: {
      shared: path.resolve(__dirname, './src/shared'),
    },
  },
  build: {
    outDir: '.vite/build/main',
    rollupOptions: {
      external: ['better-sqlite3', 'serialport'],
    },
  },
});
