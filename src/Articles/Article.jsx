import React from 'react';
import PropTypes from 'prop-types';
import Tags from '../Tags/Tags';
import ArticleOperations from './ArticleOperations';
import {MdCheckBoxOutlineBlank, MdCheckBox} from 'react-icons/md';

const Article = ({article, onTagClick, onTagRemove, bulkEditEnabled, toggleArticleSelected, selected}) =>
  <article className="articles-list__article">
    {bulkEditEnabled ? (
      <div className="article-list__article__checked-icon" onClick={toggleArticleSelected}>
        {selected ? <MdCheckBox /> : <MdCheckBoxOutlineBlank />}
      </div>
    ) : null}

    <div className="articles-list__article__title-link-container">
      <a
        className="articles-list__article__title-link"
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
      >
        {article.title}
      </a>
    </div>

    {article.tags ?
      <Tags
        onClick={onTagClick}
        onRemove={onTagRemove}
        names={article.tags}
      />
      : null}

    <ArticleOperations article={article}/>

  </article>;

Article.propTypes = {
  article: PropTypes.object.isRequired,
  onTagClick: PropTypes.func.isRequired,
  onTagRemove: PropTypes.func.isRequired,
  bulkEditEnabled: PropTypes.bool.isRequired,
  toggleArticleSelected: PropTypes.func.isRequired,
  selected: PropTypes.bool.isRequired
}

export default Article;
