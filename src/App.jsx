import React, {useState, useEffect} from 'react';
import './App.css';
import {authorized} from './auth';
import {DataStore, stateStorage} from './data';
import ArticlesContainer from './Articles/ArticlesContainer';
import {applyMiddleware, createStore} from 'redux';
import reducer, {initialState} from './reducer';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import {logger} from 'redux-logger';
import actions from './actions';
import {throttle} from 'lodash';

const store = createStore(reducer, initialState, applyMiddleware(thunk, logger));

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
