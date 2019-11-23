import React from 'react';
import ArticleProjections from './ArticlesProjections';
import ArticlesList from './ArticlesList';

function ArticlesContainer() {
  return (
    <div>
      <ArticleProjections />
      <ArticlesList />
    </div>
  )
}

export default ArticlesContainer;
