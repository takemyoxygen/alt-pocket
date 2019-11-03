import React, {useState, useEffect} from 'react';
import './App.css';
import {authorized} from './auth';
import {DataStore} from './data';
import ArticlesContainer from './Articles/ArticlesContainer';
import {applyMiddleware, createStore} from 'redux';
import reducer, {initialState} from './reducer';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import {logger} from 'redux-logger';
import actions from './actions';

const store = createStore(reducer, initialState, applyMiddleware(thunk, logger));

function App() {
  const [dataStore, setDataStore] = useState(null);

  const isAuthorized = authorized();

  useEffect(() => {
    store.dispatch(actions.initialize());
  }, []);

  useEffect(() => {
    if (isAuthorized) {
      DataStore.create().then(setDataStore);
    } else {
      setDataStore(null);
    }
  }, [isAuthorized]);

  return (
    <Provider store={store}>
      <div className="app-container">
        <div className="app">
          {dataStore ? <ArticlesContainer dataStore={dataStore}/> : null}
        </div>
      </div>
    </Provider>
  );
}

export default App;
