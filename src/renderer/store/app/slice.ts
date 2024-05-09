import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from './types';

export const initialState: AppState = {
  isAuth: false,
  loadState: {
    app: false,
  },
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<boolean>) => {
      state.isAuth = action.payload;
    },
    setLoading: (
      state,
      action: PayloadAction<{ scope: string; loading: boolean }>,
    ) => {
      const { scope = 'app', loading } = action.payload;
      state.loadState[scope] = loading;
    },
  },
  selectors: {
    selectIsAuth: (state) => state.isAuth,
    selectLoading: (state, scope = 'app') => state.loadState[scope],
  },
});

export const appActions = appSlice.actions;
export const { selectIsAuth, selectLoading } = appSlice.selectors;
