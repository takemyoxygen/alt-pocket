import React, {useEffect} from 'react';
import {throttle} from 'lodash';
import {Provider} from 'react-redux';
import createAppStore from '../store';
import App from './App';
import actions from '../actions';
import {stateStorage} from '../data/storage';

const store = createAppStore();

const pickPersistableState = ({articles, since, accessToken}) => ({articles, since, accessToken});

const Host = () => {
  useEffect(() => {
    const persistedState = stateStorage.get() || {articles: []};
    store.dispatch(actions.initialize(persistedState));

    return store.subscribe(throttle(() => {
      const state = store.getState();
      stateStorage.set(pickPersistableState(state));
    }, 1000));
  }, []);

  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};

export default Host;