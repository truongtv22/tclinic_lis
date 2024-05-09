import { configureStore } from '@reduxjs/toolkit';

import { reducer, State, Action, Store } from '../shared/_reducers';

export const store: Store = configureStore<State, Action>({ reducer });
