import React from 'react';
import PropTypes from 'prop-types';
import Tags from '../tags/Tags';
import ArticleOperations from '../operations/ArticleOperations';
import {MdCheckBoxOutlineBlank, MdCheckBox} from 'react-icons/md';
import Form from 'react-bootstrap/Form'

const Article = ({article, onTagClick, onTagRemove, bulkEditEnabled, toggleArticleSelected, selected}) =>
  <article className="articles-list__article">
    {bulkEditEnabled ? (
      <Form.Check checked={selected} onChange={toggleArticleSelected} />
    ) : null}

    {article.tags && article.tags.length > 0 ?
      <Tags
        onClick={onTagClick}
        onRemove={onTagRemove}
        names={article.tags}
        showDelete={false}
      />
      : null}

    <div className="articles-list__article__title-link-container">
      <a
        className="articles-list__article__title-link"
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        title={article.origin}
      >
        {article.title}
      </a>
    </div>

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
