import React, {useState, useEffect} from 'react';
import './App.css';
import ArticlesList from './ArticlesList/ArticlesList';
import {authorized} from './auth';
import {DataStore} from './data';

function App() {
  const [dataStore, setDataStore] = useState(null);

  const isAuthorized = authorized();

  useEffect(() => {
    if (isAuthorized) {
      DataStore.create().then(setDataStore);
    } else {
      setDataStore(null);
    }
  }, [isAuthorized]);

  return (
    <div className="app-container">
      <div className="app">
        {dataStore ? <ArticlesList dataStore={dataStore}/> : null}
      </div>
    </div>
  );
}

export default App;
