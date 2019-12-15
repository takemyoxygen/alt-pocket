import React from 'react';
import PropTypes from 'prop-types';
import './ArticlesList.css';
import Article from './Article';
import {connect} from 'react-redux';
import {combine, tagFilter} from '../projections';
import actions from './../actions';
import {values, filter, sortBy, compose} from 'lodash/fp';
import VirtualizedList from '../virtualizedList/VirtualizedList';

function ArticlesList({
  articles,
  onTagClick,
  onTagRemove,
  bulkEditEnabled,
  toggleArticleSelected,
  selectedArticles}) {
  return (
    <VirtualizedList
      className="articles-list"
      items={articles}
      itemHeight={40}
      renderItem={article =>
        <Article
          bulkEditEnabled={bulkEditEnabled}
          key={article.id}
          article={article}
          onTagClick={onTagClick}
          onTagRemove={tag => onTagRemove(article, tag)}
          toggleArticleSelected={() => toggleArticleSelected(article)}
          selected={!!selectedArticles[article.id]}
        />}/>
  );
}

ArticlesList.propTypes = {
  articles: PropTypes.array.isRequired,
  onTagClick: PropTypes.func.isRequired,
  onTagRemove: PropTypes.func.isRequired,
  bulkEditEnabled: PropTypes.bool.isRequired,
  toggleArticleSelected: PropTypes.func.isRequired,
  selectedArticles: PropTypes.object.isRequired
}

export default connect(({articles, projections, bulkEdit}) => {
  const combinedProjection = combine(projections);
  const projectedArticles = compose(
    sortBy(combinedProjection.ordering),
    filter(combinedProjection.filter),
    values)(articles);
  return {articles: projectedArticles, bulkEditEnabled: bulkEdit.enabled, selectedArticles: bulkEdit.selectedArticles};
}, {
  onTagClick: tag => actions.toggleProjection(tagFilter(tag), true),
  onTagRemove: actions.removeTag,
  toggleArticleSelected: actions.toggleArticleSelected
})(ArticlesList);
