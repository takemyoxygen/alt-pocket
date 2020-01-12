import React, {useEffect, useState} from 'react';
import './App.scss';
import {authorized} from '../utils/auth';
import {stateStorage} from '../data/storage';
import ArticlesContainer from '../articles/ArticlesContainer';
import {applyMiddleware, createStore} from 'redux';
import reducer, {initialState} from '../reducer';
import {Provider} from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import {logger} from 'redux-logger';
import actions from '../actions';
import {throttle} from 'lodash';
import { rootSaga } from '../sagas';
import Login from './Login';

function createAppStore() {
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

const store = createAppStore();

const pickPersistableState = ({articles, since}) => ({articles, since});

function useAuthorization() {
  const [authInProgress, setAuthInProgress] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useState(() => {
    authorized().then(result => {
      setAuthInProgress(false);
      setIsAuthorized(result);
    });
  });

  return [authInProgress, isAuthorized];
}

function App() {
  const [authInProgress, isAuthorized] = useAuthorization();

  useEffect(() => {
    if (isAuthorized) {
      const persistedState = stateStorage.get() || {articles: []};
      store.dispatch(actions.initialize(persistedState));

      return store.subscribe(throttle(() => {
        const state = store.getState();
        stateStorage.set(pickPersistableState(state));
      }, 1000));
    }

    return undefined;
  }, [isAuthorized]);

  return (
    <Provider store={store}>
      <div className="app-container">
        <div className="app">
          {authInProgress ? null : (isAuthorized ? <ArticlesContainer /> : <Login />)}
        </div>
      </div>
    </Provider>
  );
}

export default App;
