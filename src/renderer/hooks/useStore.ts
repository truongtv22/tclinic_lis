import { createUseStore } from 'reduxtron/zustand-store';
import { State, Action } from 'shared/store/types';

export const useStore = createUseStore<State, Action>(window.reduxtron);
