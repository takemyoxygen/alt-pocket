import React from 'react';
import PropTypes from 'prop-types';
import './ArticlesList.css';
import Article from './Article';

function ArticlesList({articles, operations, onTagClick}) {
  return (
    <div className="articles-list">
      {articles.map(article => (
        <Article key={article.id} article={article} operations={operations} onTagClick={onTagClick}/>
      ))}
    </div>
  );
}

ArticlesList.propTypes = {
  articles: PropTypes.array.isRequired,
  operations: PropTypes.object.isRequired,
  onTagClick: PropTypes.func.isRequired
}

export default ArticlesList;
