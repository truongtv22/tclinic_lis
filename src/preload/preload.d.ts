// import type { PreloadReduxBridgeReturn } from 'reduxtron/types';
import type { ElectronAPI } from './index';

declare global {
  interface Window {
    electron: ElectronAPI;
    // reduxtron: PreloadReduxBridgeReturn<State, Action>['handlers'];
  }
}

export {};
