import { defineConfig } from 'vite';
import electron from 'vite-plugin-electron';
import renderer from 'vite-plugin-electron-renderer';

// https://vitejs.dev/config
export default defineConfig({
  // plugins: [
  //   electron({}),
  //   renderer({
  //     resolve: {
  //       // JavaScript cjs lib
  //       'electron-store': { type: 'cjs' },
  //     },
  //   }),
  // ],
  resolve: {
    // Some libs that can run in both Web and Node.js, such as `axios`, we need to tell Vite to build them in Node.js.
    browserField: false,
    mainFields: ['module', 'jsnext:main', 'jsnext'],
  },
});
