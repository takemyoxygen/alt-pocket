import React from 'react';
import PropTypes from 'prop-types';
import Tags from '../Tags/Tags';
import ArticleOperations from './ArticleOperations';

const Article = ({article, onTagClick, onTagRemove}) =>
  <article className="articles-list__article">
    <a
      className="articles-list__article__title-link"
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
    >
      {article.title}
    </a>

    {article.tags ?
      <Tags
        onClick={onTagClick}
        onRemove={tag => onTagRemove(tag)}
        names={article.tags}
      />
      : null}

    <ArticleOperations article={article}/>

  </article>;

Article.propTypes = {
  article: PropTypes.object.isRequired,
  onTagClick: PropTypes.func.isRequired,
  onTagRemove: PropTypes.func.isRequired
}

export default Article;
