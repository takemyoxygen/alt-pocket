import React from 'react';
import PropTypes from 'prop-types';
import './ArticlesList.css';
import Article from './Article';

function ArticlesList({articles, operations}) {
  return (
    <div className="articles-list">
      {articles.map(article => (
        <Article key={article.id} article={article} operations={operations}/>
      ))}
    </div>
  );
}

ArticlesList.propTypes = {
  articles: PropTypes.array.isRequired,
  operations: PropTypes.object.isRequired
}

export default ArticlesList;
