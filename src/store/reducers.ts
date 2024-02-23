/**
 * Combine all reducers in this file and export the combined reducers.
 */
import { combineReducers } from '@reduxjs/toolkit';

import { InjectedReducersType } from 'utils/types/injector-typings';

import { appReducer } from './app/slice';

/**
 * Merges the main reducer with the router state and dynamically injected reducers
 */
export function createReducer(injectedReducers: InjectedReducersType = {}) {
  const rootReducer = combineReducers({
    app: appReducer,
    ...injectedReducers,
  });
  return rootReducer;
}
