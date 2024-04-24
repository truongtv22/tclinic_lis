import { createSelector } from '@reduxjs/toolkit';

import { initialState } from './slice';

// First select the relevant part from the state
const selectApp = (state: any) => state.app || initialState;

export const selectIsAuth = createSelector(
  [selectApp],
  (appState) => appState.isAuth,
);
