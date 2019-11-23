import React from 'react';
import PropTypes from 'prop-types';
import './ArticlesList.css';
import Article from './Article';
import {connect} from 'react-redux';
import {combine, tagFilter} from '../projections';
import actions from './../actions';
import {values, filter, sortBy, compose} from 'lodash/fp';

function ArticlesList({articles, onTagClick, onTagRemove}) {
  return (
    <div className="articles-list">
      {articles.map(article => (
        <Article
          key={article.id}
          article={article}
          onTagClick={onTagClick}
          onTagRemove={tag => onTagRemove(article, tag)}
        />
      ))}
    </div>
  );
}

ArticlesList.propTypes = {
  articles: PropTypes.array.isRequired,
  onTagClick: PropTypes.func.isRequired,
  onTagRemove: PropTypes.func.isRequired
}

export default connect(({articles, projections}) => {
  const combinedProjection = combine(projections);
  const projectedArticles = compose(
    sortBy(combinedProjection.ordering),
    filter(combinedProjection.filter),
    values)(articles);
  return {articles: projectedArticles};
}, {
  onTagClick: tag => actions.toggleProjection(tagFilter(tag), true),
  onTagRemove: actions.removeTag
})(ArticlesList);
