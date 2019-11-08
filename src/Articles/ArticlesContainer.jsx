import React from 'react';
import ArticleProjections from './ArticlesProjections';
import ArticlesList from './ArticlesList';
import {unread} from '../projections';

function ArticlesContainer() {
  const operations = {};

  return (
    <div>
      <ArticleProjections onProjectionsChanged={() => {}} defaultProjection={unread}/>
      <ArticlesList operations={operations} onTagClick={() => {}}/>
    </div>
  )
}

export default ArticlesContainer;
