import {
  combineReducers,
  Dispatch as BaseDispatch,
  Reducer,
  Observable,
  UnknownAction,
} from 'redux';

import { counterReducer, CounterAction } from './counter';

export const reducer = combineReducers({ counter: counterReducer });

type ActionOrAnyAction = UnknownAction | CounterAction;

export type Action = Exclude<ActionOrAnyAction, { type: '' }>;

export type State = { counter: number };
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

export type Middleware<A extends UnknownAction = Action> = (
  store: MiddlewareStore,
) => (next: Dispatch) => (action: A) => Promise<Action>;
