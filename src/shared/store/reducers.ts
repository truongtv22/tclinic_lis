import { combineReducers } from '@reduxjs/toolkit';
import { connectionSlice } from './connection/slice';

export const rootReducer = combineReducers({
  [connectionSlice.name]: connectionSlice.reducer,
});
