import React from 'react';
import './App.scss';
import ArticlesContainer from '../articles/ArticlesContainer';
import Login from './Login';
import {connect} from 'react-redux'

function App({ isAuthorized, authInProgress, initialized }) {
  return (
    <div className="app-container">
      <div className="app">
        {(authInProgress || !initialized) ? null : (isAuthorized ? <ArticlesContainer /> : <Login />)}
      </div>
    </div>
  );
}

export default connect(
  state => ({
    isAuthorized: !!state.accessToken,
    uthInProgress: state.authInProgress,
    initialized: state.initialized
  })
  )(App);
