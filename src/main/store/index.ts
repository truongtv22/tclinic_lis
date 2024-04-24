import { configureStore, Middleware, StoreEnhancer } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { syncMain } from '@goosewobbler/electron-redux';
// import { stateSyncEnhancer } from '@wnayes/electron-redux/main';
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
import { createReducer } from 'shared/store/reducers';

// Create the saga middleware
const sagaMiddleware = createSagaMiddleware();
const middlewares = [sagaMiddleware] as Middleware[];

// const enhancers = [stateSyncEnhancer()] as StoreEnhancer[];
const enhancers = [syncMain] as StoreEnhancer[];

export const store = configureStore({
  reducer: createReducer(),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(middlewares),
  enhancers: (getDefaultEnhancers) => getDefaultEnhancers().concat(enhancers),
});
const persistor = persistStore(store);

sagaMiddleware.run(rootSaga);
