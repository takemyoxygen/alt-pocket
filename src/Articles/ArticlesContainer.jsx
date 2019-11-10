import React from 'react';
import ArticleProjections from './ArticlesProjections';
import ArticlesList from './ArticlesList';

function ArticlesContainer() {
  const operations = {};

  return (
    <div>
      <ArticleProjections />
      <ArticlesList operations={operations} onTagClick={() => {}}/>
    </div>
  )
}

export default ArticlesContainer;
