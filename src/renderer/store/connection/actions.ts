import { createRoutine } from 'redux-saga-routines';
import createRoutineAsync from 'renderer/utils/createRoutineAsync';

export const getConnections = createRoutineAsync('getConnections');
export const getStatusConnections = createRoutine('getStatusConnections');
export const createConnection = createRoutineAsync('createConnection');
export const updateConnection = createRoutineAsync('updateConnection');
export const deleteConnection = createRoutineAsync('deleteConnection');
