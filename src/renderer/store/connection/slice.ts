import reduce from 'lodash/reduce';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import {
  getConnections,
  getStatusConnections,
  createConnection,
  updateConnection,
  deleteConnection,
} from './actions';
import { ConnectionState } from './types';

export const initialState: ConnectionState = {
  connectionList: [],
  connectionStatus: {},
};

export const connectionSlice = createSlice({
  name: 'connection',
  initialState,
  reducers: {
    updateStatus(state, action: PayloadAction<[number, boolean]>) {
      const [id, status] = action.payload;
      state.connectionStatus[id] = status;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        getConnections.SUCCESS,
        (state, action: PayloadAction<any[]>) => {
          state.connectionList = action.payload;
          state.connectionStatus = reduce(
            action.payload,
            (result: any, item) => {
              result[item.id] = false;
              return result;
            },
            {},
          );
        },
      )
      .addCase(
        getStatusConnections.SUCCESS,
        (state, action: PayloadAction<{ [key: number]: boolean }>) => {
          Object.assign(state.connectionStatus, action.payload);
        },
      )
      .addCase(
        createConnection.SUCCESS,
        (state, action: PayloadAction<any>) => {
          state.connectionList.push(action.payload);
          state.connectionStatus[action.payload.id] = false;
        },
      )
      .addCase(
        updateConnection.SUCCESS,
        (state, action: PayloadAction<any>) => {
          const [id, data] = action.payload;
          const index = state.connectionList.findIndex(
            (item) => item.id === id,
          );
          if (index > -1) {
            state.connectionList[index] = data;
            state.connectionStatus[action.payload.id] = false;
          }
        },
      )
      .addCase(
        deleteConnection.SUCCESS,
        (state, action: PayloadAction<any>) => {
          const [id] = action.payload;
          const index = state.connectionList.findIndex(
            (item) => item.id === id,
          );
          if (index > -1) {
            state.connectionList.splice(index, 1);
            delete state.connectionStatus[id];
          }
        },
      );
  },
  selectors: {
    selectConnections: (state) => state.connectionList,
    selectConnectionStatus: (state) => state.connectionStatus,
    selectConnection: (state, id) =>
      state.connectionList.find((item) => item.id === id),
  },
});

export const connectionActions = connectionSlice.actions;
export const { selectConnections, selectConnectionStatus, selectConnection } =
  connectionSlice.selectors;
