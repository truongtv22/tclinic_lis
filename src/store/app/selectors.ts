import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './slice';

// First select the relevant part from the state
const selectApp = (state: RootState) => state.app || initialState;

export const selectIsAuth = createSelector(
  [selectApp],
  (appState) => appState.isAuth,
);
