import React, {useEffect, useState, useRef, useMemo, useCallback} from 'react';
import PropTypes from 'prop-types';
import ArticleProjections from './ArticlesProjections';
import ArticlesList from './ArticlesList';
import {DataStore, createOperations} from '../data';
import {combine, unread} from '../projections';

const defaultProjection = unread;

function useDataStoreProjectionSubscription(dataStore, initialProjection) {
  const [articles, setArticles] = useState([]);
  const subscriptionRef = useRef(null);

  useEffect(() => {
    subscriptionRef.current = dataStore.subscribe(initialProjection, setArticles);
    return () => subscriptionRef.current && subscriptionRef.current.unsubscribe();
  }, [dataStore, subscriptionRef, initialProjection]);

  const onProjectionsChanged = useCallback(projections => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }

      subscriptionRef.current = dataStore.subscribe(combine(projections), setArticles);
    }, [subscriptionRef, dataStore]);

  return [articles, onProjectionsChanged];
}

function ArticlesContainer({dataStore}) {
  const [articles, onProjectionsChanged] = useDataStoreProjectionSubscription(dataStore, defaultProjection);
  const operations = useMemo(() => createOperations(dataStore), [dataStore]);

  return (
    <div>
      <ArticleProjections onProjectionsChanged={onProjectionsChanged} defaultProjection={unread}/>
      <ArticlesList articles={articles} operations={operations} onTagClick={() => {}}/>
    </div>
  )
}

ArticlesContainer.propTypes = {
  dataStore: PropTypes.instanceOf(DataStore).isRequired
}

export default ArticlesContainer;
