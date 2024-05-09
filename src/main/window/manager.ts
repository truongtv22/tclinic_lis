import { Window } from './window';

class WindowManager {
  windows: Record<string, Window> = {};

  getWindow(id: string) {
    if (!this.windows[id]) return null;
    if (!this.windows[id].instance) return null;
    return this.windows[id];
  }

  createWindow(id: string, params?: any) {
    const window = this.windows[id];
    if (window) {
      window.focus();
    } else {
      const newWindow = new Window(id, params);
      newWindow.create();
      newWindow.instance.on('closed', () => {
        this.removeWindow(id);
      });
      this.windows[id] = newWindow;
    }
    return this.windows[id];
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
