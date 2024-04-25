import { createUseStore } from 'reduxtron/zustand-store';
import { State, Action } from 'shared/_store/types';

export const useSharedStore = createUseStore<State, Action>(window.reduxtron);
