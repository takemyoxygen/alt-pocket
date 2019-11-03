import {MdArchive, MdDelete, MdOpenInNew, MdStar, MdStarBorder, MdUnarchive} from 'react-icons/md';
import React from 'react';
import {connect} from 'react-redux';
import actions from '../actions';

function confirmDelete(performDelete) {
  return () => {
    if (window.confirm("This item will be permanently deleted. Are you sure?")) {
      performDelete();
    }
  }
}

const ArticleOperations = ({article, favorite, unfavorite, archive, readd, remove}) => (
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

    {article.archived
      ? <MdUnarchive title="Unarchive" onClick={() => readd(article)}/>
      : <MdArchive title="Archive" onClick={() => archive(article)}/>}

    {article.favorite
      ? <MdStar title="Unfavorite" onClick={() => unfavorite(article)}/>
      : <MdStarBorder title={"Favorite"} onClick={() => favorite(article)}/>}

    <MdDelete title="Delete" onClick={confirmDelete(() => remove(article))}/>
  </div>
)

export default connect(null,
  {
    archive: actions.archive
  })(ArticleOperations);
