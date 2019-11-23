import {MdArchive, MdDelete, MdOpenInNew, MdStar, MdStarBorder, MdUnarchive} from 'react-icons/md';
import {AiFillTag} from 'react-icons/ai';
import React, {useState} from 'react';
import {connect} from 'react-redux';
import actions from '../actions';
import Popover from 'react-popover';
import './ArticleOperations.css';

function confirmDelete(performDelete) {
  return () => {
    if (window.confirm("This item will be permanently deleted. Are you sure?")) {
      performDelete();
    }
  }
}

function TagInput() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover
      className={"tag-input-popover"}
      isOpen={isOpen}
      onOuterAction={() => setIsOpen(false)}
      enterExitTransitionDurationMs={0}
      place="left"
      tipSize={0.01}
      body={(
        <div className="tag-input-container">
          <input type="text" autoFocus={true} />
        </div>
      )}>
      <AiFillTag title="Add tag" onClick={() => setIsOpen(!isOpen)} />
    </Popover>
  );
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
      ? <MdUnarchive title="Unarchive" onClick={() => readd([article])}/>
      : <MdArchive title="Archive" onClick={() => archive([article])}/>}

    {article.favorite
      ? <MdStar title="Unfavorite" onClick={() => unfavorite([article])}/>
      : <MdStarBorder title={"Favorite"} onClick={() => favorite([article])}/>}

    <TagInput />

    <MdDelete title="Delete" onClick={confirmDelete(() => remove([article]))}/>
  </div>
)

export default connect(null,
  {
    archive: actions.archive,
    readd: actions.readd,
    favorite: actions.favorite,
    unfavorite: actions.unfavorite,
    remove: actions.remove
  })(ArticleOperations);
