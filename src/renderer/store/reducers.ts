/**
 * Combine all reducers in this file and export the combined reducers.
 */
import { persistReducer } from 'redux-persist';
import { combineReducers } from '@reduxjs/toolkit';
// import createElectronStorage from 'redux-persist-electron-storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';

import { InjectedReducersType } from 'renderer/utils/types/injector-typings';
import { createElectronStorage } from 'renderer/utils/electron-storage';
import { STORAGE_KEY } from 'renderer/constants/app';

import { appSlice } from './app/slice';

/**
 * Merges the main reducer with the router state and dynamically injected reducers
 */
export function createReducer(injectedReducers: InjectedReducersType = {}) {
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
    ...injectedReducers,
  });
  return persistReducer(persistConfig, rootReducer);
}
