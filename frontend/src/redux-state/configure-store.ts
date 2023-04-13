import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './reducers';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import createSagaMiddleware from '@redux-saga/core';
import { all, call } from 'redux-saga/effects';

// import sagas
import { rootFoldersSaga } from 'src/packages/dashboard/state/folders/sagas';

/**
 * saga
 */
const sagaMiddleware = createSagaMiddleware();

/**
 * combines all rootSaga watchers into 1
 */
function* getSagas() {
  yield all([
    call(rootFoldersSaga),
    // add more rootSagas here
  ]);
}

// Define the persistConfig object
const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['register'],
};

// Wrap the rootReducer with the persistReducer function
const persistedReducer = persistReducer(persistConfig, rootReducer);

/**
 * global store
 */
export const GlobalStore = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
    sagaMiddleware,
  ],
});

// run saga middleware with all combined root sagas
sagaMiddleware.run(getSagas);

// Create the persisted version of the store
export const persistor = persistStore(GlobalStore);
