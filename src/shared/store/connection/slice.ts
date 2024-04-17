import { createSlice } from '@reduxjs/toolkit';
import { ConnectionState } from './types';

export const initialState: ConnectionState = {
  connectionList: [],
  connectedIds: [],
};

export const connectionSlice = createSlice({
  name: 'connection',
  initialState,
  reducers: {
    setTest: (state) => {
      state.connectionList = [{ id: 1 }, { id: 2 }, { id: 3 }];
    },
  },
});

export const connectionActions = connectionSlice.actions;
export const connectionReducer = connectionSlice.reducer;
