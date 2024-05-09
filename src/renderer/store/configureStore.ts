import { configureStore, Middleware, StoreEnhancer } from '@reduxjs/toolkit';
import { createInjectorsEnhancer } from 'redux-injectors';
import createSagaMiddleware from 'redux-saga';
import {
  routinePromiseWatcherSaga,
  ROUTINE_PROMISE_ACTION,
} from 'redux-saga-routines';
import {
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import {
  createStateSyncMiddleware,
  // initMessageListener,
  initStateWithPrevTab,
} from 'redux-state-sync';

import { rootSaga } from './sagas';
import { createReducer } from './reducers';

export function configureAppStore() {
  // Create the store with saga middleware
  const sagaMiddleware = createSagaMiddleware();
  const syncMiddleware = createStateSyncMiddleware({
    blacklist: [PERSIST, PURGE, ROUTINE_PROMISE_ACTION],
  });
  const middlewares = [sagaMiddleware, syncMiddleware] as Middleware[];
  // const middlewares = [sagaMiddleware] as Middleware[];

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
          ignoredActions: [
            FLUSH,
            REHYDRATE,
            PAUSE,
            PERSIST,
            PURGE,
            REGISTER,
            ROUTINE_PROMISE_ACTION,
          ],
        },
      }).concat(middlewares),
    devTools: process.env.NODE_ENV !== 'production',
    enhancers: (getDefaultEnhancers) => getDefaultEnhancers().concat(enhancers),
  });
  initStateWithPrevTab(store);
  // initMessageListener(store);
  const persistor = persistStore(store);

  sagaMiddleware.run(rootSaga);
  sagaMiddleware.run(routinePromiseWatcherSaga);

  return { store, persistor };
}
