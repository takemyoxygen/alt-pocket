import createSagaMiddleware from 'redux-saga';
import {logger} from 'redux-logger';
import {applyMiddleware, createStore} from 'redux';
import reducer, {initialState} from './reducer';
import { rootSaga } from './sagas';

export default function createAppStore() {
  const middlewares = [];
  const sagaMiddleware = createSagaMiddleware();
  middlewares.push(sagaMiddleware);

  if (process.env.NODE_ENV === 'development') {
    middlewares.push(logger);
  }

  const store = createStore(reducer, initialState, applyMiddleware(...middlewares));
  sagaMiddleware.run(rootSaga);

  return store;
}