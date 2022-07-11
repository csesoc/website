import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './reducers';

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
  ])
}

/**
 * global store
 */
export default configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => [...getDefaultMiddleware(), sagaMiddleware],
})

// run saga middleware with all combined root sagas
sagaMiddleware.run(getSagas)

