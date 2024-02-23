import { configureStore, Middleware, StoreEnhancer } from '@reduxjs/toolkit';
import { createInjectorsEnhancer } from 'redux-injectors';
import createSagaMiddleware from 'redux-saga';
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';

import { rootSaga } from './sagas';
import { createReducer } from './reducers';

export function configureAppStore() {
  const sagaMonitorOptions = {};
  const sagaMiddleware = createSagaMiddleware(sagaMonitorOptions);

  // Create the store with saga middleware
  const middlewares = [sagaMiddleware] as Middleware[];

  const enhancers = [
    createInjectorsEnhancer({
      createReducer,
      runSaga: sagaMiddleware.run,
    }),
  ] as StoreEnhancer[];

  const store = configureStore({
    reducer: createReducer(),
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(middlewares),
    devTools: process.env.NODE_ENV !== 'production',
    enhancers: (getDefaultEnhancers) => getDefaultEnhancers().concat(enhancers),
  });

  sagaMiddleware.run(rootSaga);

  return store;
}
