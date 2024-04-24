import { configureStore, Middleware, StoreEnhancer } from '@reduxjs/toolkit';
import { createInjectorsEnhancer } from 'redux-injectors';
import createSagaMiddleware from 'redux-saga';
import { syncRenderer } from '@goosewobbler/electron-redux/renderer';
// import { composeWithStateSync, stateSyncEnhancer } from '@wnayes/electron-redux/renderer';
import {
  persistStore,
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
  // Create the store with saga middleware
  const sagaMiddleware = createSagaMiddleware();
  const middlewares = [sagaMiddleware] as Middleware[];

  const enhancers = [
    createInjectorsEnhancer({
      createReducer,
      runSaga: sagaMiddleware.run,
    }),
    syncRenderer,
    // stateSyncEnhancer(),
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
  const persistor = persistStore(store);

  sagaMiddleware.run(rootSaga);

  return { store, persistor };
}
