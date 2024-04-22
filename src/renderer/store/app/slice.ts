import { PayloadAction } from '@reduxjs/toolkit';

import { createSlice } from 'renderer/utils/@reduxjs/toolkit';
import { AppState } from './types';

export const initialState: AppState = {
  isAuth: false,
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<boolean>) => {
      state.isAuth = action.payload;
    },
  },
});

export const appActions = appSlice.actions;
export const appReducer = appSlice.reducer;
