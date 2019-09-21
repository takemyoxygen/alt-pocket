import React, {useEffect, useState} from 'react';
import {archive, getArticles} from '../data';
import './ArticlesList.css';
import Article from './Article';

export default () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    getArticles().then(setArticles);
  }, []);

  function onArchive(articleId) {
    archive(articleId).then(setArticles);
  }

  return (
    <div className="articles-list">
      {articles.map(article => (
        <Article key={article.id} article={article} archive={onArchive}/>
      ))}
    </div>
  );
}
