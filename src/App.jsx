import React from 'react';
import './App.css';
import ArticlesList from './ArticlesList/ArticlesList';
import {authorized} from './auth';


function App() {
  return (
    <div className="app">
      {authorized() ? <ArticlesList/> : null}
    </div>
  );
}

export default App;
