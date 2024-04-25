import { createRoutine, promisifyRoutine } from 'redux-saga-routines';

export default function createRoutineAsync(typePrefix: string) {
  const routine = createRoutine(typePrefix);
  const actionCreator = (payload) => (dispatch) => {
    return promisifyRoutine(routine)(payload, dispatch);
  };
  Object.keys(routine).forEach((prop) => {
    const descriptor = Object.getOwnPropertyDescriptor(routine, prop);
    Object.defineProperty(actionCreator, prop, descriptor);
  });
  return actionCreator;
}
