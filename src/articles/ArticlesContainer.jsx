import React from 'react';
import ArticleProjections from './ArticlesProjections';
import ArticlesList from './ArticlesList';

function ArticlesContainer() {
  return (
    <div className="articles-container">
      <ArticleProjections />
      <ArticlesList />
    </div>
  )
}

export default ArticlesContainer;
