import { createSlice } from 'utils/@reduxjs/toolkit';
import { PayloadAction } from '@reduxjs/toolkit';

import { AppState } from './types';

export const initialState: AppState = {
  isAuth: false,
};

const appSlice = createSlice({
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
