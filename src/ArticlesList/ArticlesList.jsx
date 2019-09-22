import React, {useEffect, useState} from 'react';
import {archive, DataStore} from '../data';
import './ArticlesList.css';
import Article from './Article';
import PropTypes from 'prop-types';

function ArticlesList({dataStore}) {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    return dataStore.subscribe(a => a.unread, setArticles);
  }, [dataStore]);

  function onArchive(articleId) {
    archive(articleId, dataStore);
  }

  return (
    <div className="articles-list">
      {articles.map(article => (
        <Article key={article.id} article={article} archive={onArchive}/>
      ))}
    </div>
  );
}

ArticlesList.propTypes = {
  dataStore: PropTypes.instanceOf(DataStore).isRequired
}

export default ArticlesList;
