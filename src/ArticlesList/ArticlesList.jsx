import React, {useEffect, useState, useRef} from 'react';
import {archive, DataStore} from '../data';
import './ArticlesList.css';
import Article from './Article';
import PropTypes from 'prop-types';
import {unread} from './../projections';
import ArticleProjections from './ArticlesProjections';

const defaultProjection = unread;

function ArticlesList({dataStore}) {
  const [articles, setArticles] = useState([]);
  const subscriptionRef = useRef();

  useEffect(() => {
    subscriptionRef.current = dataStore.subscribe(defaultProjection, setArticles);
    return () => subscriptionRef.current && subscriptionRef.current.unsubscribe();
  }, [dataStore, subscriptionRef]);

  function onArchive(articleId) {
    archive(articleId, dataStore);
  }

  function onProjectionChanged(projection) {
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
    }

    subscriptionRef.current = dataStore.subscribe(projection, setArticles);
  }

  return (
    <div>
      <ArticleProjections defaultProjection={defaultProjection} onProjectionChanged={onProjectionChanged}/>
      <div className="articles-list">
        {articles.map(article => (
          <Article key={article.id} article={article} archive={onArchive}/>
        ))}
      </div>
    </div>
  );
}

ArticlesList.propTypes = {
  dataStore: PropTypes.instanceOf(DataStore).isRequired
}

export default ArticlesList;
