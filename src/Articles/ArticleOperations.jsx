import {MdArchive, MdDelete, MdOpenInNew, MdStar, MdStarBorder, MdUnarchive} from 'react-icons/md';
import {AiFillTag} from 'react-icons/ai';
import React, {useState, useCallback, useEffect} from 'react';
import PropTypes from 'prop-types';
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

const TagInput = ({onTagsEntered}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tagValue, setTagValue] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setTagValue('');
    }
  }, [isOpen]);

  const onKeyDown = useCallback((evt) => {
    if (evt.keyCode === 27) {
      setIsOpen(false);
      return false;
    } else if (evt.keyCode === 13 && tagValue) {
      const tags = tagValue.split(',').map(t => t.trim()).filter(t => !!t);

      onTagsEntered(tags);
      setIsOpen(false);

      return false;
    }
  }, [tagValue, onTagsEntered]);

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
          <input
            type="text"
            autoFocus={true}
            value={tagValue}
            onChange={evt => setTagValue(evt.target.value)}
            placeholder={`New tags split by ","`}
            onKeyDown={onKeyDown}
          />
        </div>
      )}>
      <AiFillTag title="Add tag" onClick={() => setIsOpen(!isOpen)} />
    </Popover>
  );
}

TagInput.propTypes = {
  onTagsEntered: PropTypes.func.isRequired
};

const ArticleOperations = ({article, favorite, unfavorite, archive, readd, remove, addTags}) => (
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

    <TagInput onTagsEntered={tags => addTags([article], tags)}/>

    <MdDelete title="Delete" onClick={confirmDelete(() => remove([article]))}/>
  </div>
)

export default connect(null,
  {
    archive: actions.archive,
    readd: actions.readd,
    favorite: actions.favorite,
    unfavorite: actions.unfavorite,
    remove: actions.remove,
    addTags: actions.addTags
  })(ArticleOperations);
