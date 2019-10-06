import React from 'react';
import './ArticlesList.css';
import Article from './Article';

function ArticlesList({articles, archive}) {
  return (
    <div className="articles-list">
      {articles.map(article => (
        <Article key={article.id} article={article} archive={archive}/>
      ))}
    </div>
  );
}

export default ArticlesList;
