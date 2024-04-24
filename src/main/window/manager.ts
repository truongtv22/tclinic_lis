import { Window } from './index';

class WindowManager {
  windows: Record<string, Window> = {};

  getWindow(id: string) {
    return this.windows[id] || null;
  }

  createWindow(id: string) {
    const window = this.windows[id];
    if (window) {
      window.focus();
    } else {
      const newWindow = new Window(id);
      newWindow.create();
      this.windows[id] = newWindow;
    }
  }

  focusWindow(id: string) {
    const window = this.windows[id];
    if (window) window.focus();
  }

  removeWindow(id: string) {
    if (this.windows[id]) {
      this.windows[id].destroy();
      delete this.windows[id];
    }
  }
}

export const windowManager = new WindowManager();
