import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './slice';

// First select the relevant part from the state
const selectDevice = (state: RootState) => state.device || initialState;

export const selectDevices = createSelector(
  [selectDevice],
  (deviceState) => deviceState.devices,
);
