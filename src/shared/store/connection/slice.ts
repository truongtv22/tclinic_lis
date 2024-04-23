import { createSlice } from '@reduxjs/toolkit';
import { reduce } from 'lodash';
import { ConnectionState } from './types';
import { getConnections } from './actions';

export const initialState: ConnectionState = {
  connectionList: [],
  connectionStatus: {},
};

export const connectionSlice = createSlice({
  name: 'connection',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getConnections.SUCCESS, (state, action: any) => {
      state.connectionList = action.payload;
      state.connectionStatus = reduce(action.payload, (result, item) => {
        result[item.id] = 0;
        return result;
      });
    });
  },
  selectors: {
    selectConnections: (state) => state.connectionList,
  },
});

export const connectionActions = connectionSlice.actions;
export const connectionReducer = connectionSlice.reducer;
export const connectionSelectors = connectionSlice.selectors;
