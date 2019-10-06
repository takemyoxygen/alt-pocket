import React, {useState, useEffect} from 'react';
import './App.css';
import {authorized} from './auth';
import {DataStore} from './data';
import ArticlesContainer from './Articles/ArticlesContainer';

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
        {dataStore ? <ArticlesContainer dataStore={dataStore}/> : null}
      </div>
    </div>
  );
}

export default App;
