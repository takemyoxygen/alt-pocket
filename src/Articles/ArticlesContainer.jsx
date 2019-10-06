import React, {useEffect, useState, useRef, useMemo, useCallback} from 'react';
import PropTypes from 'prop-types';
import ArticleProjections from './ArticlesProjections';
import ArticlesList from './ArticlesList';
import {DataStore, createOperations} from '../data';
import {unread} from '../projections';

const defaultProjection = unread;

function useDataStoreProjectionSubscription(dataStore, initialProjection) {
  const [articles, setArticles] = useState([]);
  const subscriptionRef = useRef(null);

  useEffect(() => {
    subscriptionRef.current = dataStore.subscribe(initialProjection, setArticles);
    return () => subscriptionRef.current && subscriptionRef.current.unsubscribe();
  }, [dataStore, subscriptionRef, initialProjection]);

  const onProjectionChanged = useCallback(projection => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }

      subscriptionRef.current = dataStore.subscribe(projection, setArticles);
    }, [subscriptionRef, dataStore]);

  return [articles, onProjectionChanged];
}

function ArticlesContainer({dataStore}) {
  const [articles, onProjectionChanged] = useDataStoreProjectionSubscription(dataStore, defaultProjection);
  const operations = useMemo(() => createOperations(dataStore), [dataStore]);

  return (
    <div>
      <ArticleProjections onProjectionChanged={onProjectionChanged} defaultProjection={unread}/>
      <ArticlesList articles={articles} operations={operations}/>
    </div>
  )
}

ArticlesContainer.propTypes = {
  dataStore: PropTypes.instanceOf(DataStore).isRequired
}

export default ArticlesContainer;
