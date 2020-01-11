import React, {useEffect} from 'react';
import './App.css';
import {authorized} from './utils/auth';
import {stateStorage} from './data/storage';
import ArticlesContainer from './articles/ArticlesContainer';
import {applyMiddleware, createStore} from 'redux';
import reducer, {initialState} from './reducer';
import {Provider} from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import {logger} from 'redux-logger';
import actions from './actions';
import {throttle} from 'lodash';
import { rootSaga } from './sagas';

const middlewares = [];
const sagaMiddleware = createSagaMiddleware();
middlewares.push(sagaMiddleware);

if (process.env.NODE_ENV === 'development') {
  middlewares.push(logger);
}

const store = createStore(reducer, initialState, applyMiddleware(...middlewares));
sagaMiddleware.run(rootSaga);

const pickPersistableState = ({articles, since}) => ({articles, since});

function App() {
  const isAuthorized = authorized();

  useEffect(() => {
    if (isAuthorized) {
      const persistedState = stateStorage.get() || {articles: []};
      store.dispatch(actions.initialize(persistedState));

      store.subscribe(throttle(() => {
        const state = store.getState();
        stateStorage.set(pickPersistableState(state));
      }, 1000));
    }
  }, [isAuthorized]);

  return (
    <Provider store={store}>
      <div className="app-container">
        <div className="app">
          <ArticlesContainer />
        </div>
      </div>
    </Provider>
  );
}

export default App;
