import React from 'react';
import ArticleProjections from './ArticlesProjections';
import ArticlesList from './ArticlesList';
import GlobalActions from './GlobalActions';

function ArticlesContainer() {
  return (
    <div className="articles-container">
      <GlobalActions />
      <ArticleProjections />
      <ArticlesList />
    </div>
  )
}

export default ArticlesContainer;
