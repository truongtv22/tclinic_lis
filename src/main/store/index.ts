import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { Store, Action, State, Middleware } from 'shared/store/types';
import { rootSaga } from './sagas';
import { rootReducer } from 'shared/store/reducers';

// Create the saga middleware
const sagaMiddleware = createSagaMiddleware();
const middlewares = [sagaMiddleware] as Middleware[];

export const store: Store = configureStore<State, Action>({
  reducer: rootReducer,
  // @ts-expect-error
  middleware: (gDM) => gDM().concat(middlewares),
});

sagaMiddleware.run(rootSaga);
