import {
  Dispatch as BaseDispatch,
  Reducer,
  Observable,
  UnknownAction,
} from '@reduxjs/toolkit';
import { Action as ActionType } from 'redux-actions';
import { rootReducer } from './reducers';

type ActionOrAnyAction = ActionType<any> | UnknownAction | ;

export type Action = Exclude<ActionOrAnyAction, { type: '' }>;

export type State = ReturnType<typeof rootReducer>;
export type Dispatch = BaseDispatch<Action>;
export type Subscribe = (listener: () => void) => () => void;

export type Store = {
  getState: () => State;
  dispatch: Dispatch;
  subscribe: Subscribe;
  replaceReducer: (nextReducer: Reducer<State, Action>) => void;
  [Symbol.observable](): Observable<State>;
};

type MiddlewareStore = Pick<Store, 'getState' | 'dispatch'>;

export type Middleware<A extends Action = Action> = (
  store: MiddlewareStore,
) => (next: Dispatch) => (action: A) => Promise<Action>;
