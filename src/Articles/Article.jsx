import React from 'react';
import PropTypes from 'prop-types';
import {MdOpenInNew, MdArchive} from 'react-icons/md';

const Article = ({article, archive}) =>
  <article className="articles-list__article">
    <a
      className="articles-list__article__title-link"
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
    >
      {article.title}
    </a>

    <div className="articles-list__article__icons">
      <a
        href={article.url}
        target="_blank"
        className="articles-list__article__open-icon-link"
        rel="noopener noreferrer"
        title="Open in a new tab"
      >
        <MdOpenInNew/>
      </a>

      <MdArchive title="Archive" onClick={() => archive(article)}/>
    </div>

  </article>;

Article.propTypes = {
  article: PropTypes.object.isRequired,
  archive: PropTypes.func.isRequired
}

export default Article;
