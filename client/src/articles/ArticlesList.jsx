import React from 'react';
import PropTypes from 'prop-types';
import './ArticlesList.scss';
import Article from './Article';
import {connect} from 'react-redux';
import {combine, tagFilter} from '../projections';
import actions from './../actions';
import {values, filter, sortBy, compose} from 'lodash/fp';
import VirtualizedList from '../virtualizedList/VirtualizedList';
import ListGroup from 'react-bootstrap/ListGroup'

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
      itemHeight={50}
      renderContainer={ListGroup}
      renderItem={props => (
        <ListGroup.Item {...props} className={`${props.className} articles-list__article-container`}>
          <Article
            bulkEditEnabled={bulkEditEnabled}
            article={props.item}
            onTagClick={onTagClick}
            onTagRemove={tag => onTagRemove(props.item, tag)}
            toggleArticleSelected={() => toggleArticleSelected(props.item)}
            selected={!!selectedArticles[props.item.id]}
        />
        </ListGroup.Item>
      )}/>
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
