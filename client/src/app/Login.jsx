import React from 'react';
import './App.scss';
import {connect} from 'react-redux';
import actions from '../actions';

function Login({onLogin}) {
  return (
    <div className="login-container">
      <button className="login-button" type="button" onClick={onLogin}>Login with Pocket</button>
    </div>
  );
}

export default connect(null, {
  onLogin: actions.login
})(Login)