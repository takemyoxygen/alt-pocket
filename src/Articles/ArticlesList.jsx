import React from 'react';
import PropTypes from 'prop-types';
import './ArticlesList.css';
import Article from './Article';
import {connect} from 'react-redux';
import {combine} from '../projections';
import {values, filter, sortBy, compose} from 'lodash/fp';

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

export default connect(({articles, projections}) => {
  const combinedProjection = combine(projections);
  const projectedArticles = compose(
    sortBy(combinedProjection.ordering),
    filter(combinedProjection.filter),
    values)(articles);
  return {articles: projectedArticles};
})(ArticlesList);
