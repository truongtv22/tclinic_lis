import { persistReducer } from 'redux-persist';
import { combineReducers } from '@reduxjs/toolkit';
import createElectronStorage from 'redux-persist-electron-storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';

import { STORAGE_KEY } from 'shared/constants';
import { appSlice } from './app/slice';
import { connectionSlice } from './connection/slice';

export function createReducer() {
  const persistConfig = {
    key: STORAGE_KEY,
    version: 1,
    timeout: 30000,
    storage: createElectronStorage(),
    whitelist: [appSlice.name],
    stateReconciler: autoMergeLevel2,
  };

  const rootReducer = combineReducers({
    [appSlice.name]: appSlice.reducer,
    [connectionSlice.name]: connectionSlice.reducer,
  });
  return persistReducer(persistConfig, rootReducer);
  // return rootReducer;
}
