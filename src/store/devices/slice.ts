import { createSlice } from 'utils/@reduxjs/toolkit';
import { PayloadAction } from '@reduxjs/toolkit';

import { DeviceState } from './types';

export const initialState: DeviceState = {
  devices: [],
};

export const deviceSlice = createSlice({
  name: 'device',
  initialState,
  reducers: {
    createDevice: (state, action) => {
      const id = Date.now()
      const device = action.payload
      device.id = id
      state.devices.push(device)
    },
    updateDevice: (state, action) => {
      const id = action.payload.id
      const foundIndex = state.devices.findIndex(item => item.id === id)
      state.devices[foundIndex] = action.payload
    },
    deleteDevice: (state, action) => {
      const id = action.payload
      const foundIndex = state.devices.findIndex(item => item.id === id)
      state.devices.splice(foundIndex, 1)
    },
  },
});

export const deviceActions = deviceSlice.actions;
export const deviceReducer = deviceSlice.reducer;
