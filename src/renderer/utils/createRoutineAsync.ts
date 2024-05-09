import { createRoutine, promisifyRoutine } from 'redux-saga-routines';

export default function createRoutineAsync(typePrefix: string) {
  const routine = createRoutine(typePrefix);
  type UnifiedRoutine = typeof routine;

  const actionCreator: any = (payload?: any) => (dispatch: any) => {
    return promisifyRoutine(routine)(payload, dispatch);
  };
  type PromiseCreator = (payload?: any) => PromiseLike<any>;

  Object.keys(routine).forEach((prop) => {
    const descriptor = Object.getOwnPropertyDescriptor(routine, prop);
    Object.defineProperty(actionCreator, prop, descriptor);
  });
  return actionCreator as PromiseCreator & UnifiedRoutine;
}
