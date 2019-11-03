import React from 'react';
import PropTypes from 'prop-types';
import Tags from '../Tags/Tags';
import ArticleOperations from './ArticleOperations';

const Article = ({article, operations, onTagClick}) =>
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
        onRemove={tag => operations.removeTag(article, tag)}
        names={article.tags}
      />
      : null}

    <ArticleOperations article={article}/>

  </article>;

Article.propTypes = {
  article: PropTypes.object.isRequired,
  operations: PropTypes.object.isRequired,
  onTagClick: PropTypes.func.isRequired
}

export default Article;
