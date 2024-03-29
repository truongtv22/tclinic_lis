import { createIpcSlice } from 'interprocess';

export const counterIpcSlice = createIpcSlice({
  main: {
    async getPing(_, data: 'ping') {
      return `from renderer: ${data} on main process`;
    },
  },
  renderer: {
    async getPong(_, data: 'pong') {
      return `from main: ${data} on renderer process`;
    },
  },
});
