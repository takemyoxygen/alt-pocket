import React, {useEffect, useState, useRef} from 'react';
import PropTypes from 'prop-types';
import ArticleProjections from './ArticlesProjections';
import ArticlesList from './ArticlesList';
import {archive, DataStore} from '../data';
import {unread} from '../projections';

const defaultProjection = unread;

function useDataStoreProjectionSubscription(dataStore, initialProjection) {
  const [articles, setArticles] = useState([]);
  const subscriptionRef = useRef(null);

  useEffect(() => {
    subscriptionRef.current = dataStore.subscribe(initialProjection, setArticles);
    return () => subscriptionRef.current && subscriptionRef.current.unsubscribe();
  }, [dataStore, subscriptionRef, initialProjection]);

  function onProjectionChanged(projection) {
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
    }

    subscriptionRef.current = dataStore.subscribe(projection, setArticles);
  }

  return [articles, onProjectionChanged];
}

function ArticlesContainer({dataStore}) {
  const [articles, onProjectionChanged] = useDataStoreProjectionSubscription(dataStore, defaultProjection);

  function onArchive(article) {
    archive(article.id, dataStore);
  }

  return (
    <div>
      <ArticleProjections onProjectionChanged={onProjectionChanged} defaultProjection={unread}/>
      <ArticlesList articles={articles} archive={onArchive}/>
    </div>
  )
}

ArticlesContainer.propTypes = {
  dataStore: PropTypes.instanceOf(DataStore).isRequired
}

export default ArticlesContainer;
