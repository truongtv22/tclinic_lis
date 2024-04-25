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
      state.connectionStatus = reduce(
        action.payload,
        (result: any, item) => {
          result[item.id] = false;
          return result;
        },
        {},
      );
    });
  },
  selectors: {
    selectConnections: (state) => state.connectionList,
  },
});

export const connectionActions = connectionSlice.actions;
export const { selectConnections } = connectionSlice.selectors;
