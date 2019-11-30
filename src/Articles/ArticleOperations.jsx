import {MdArchive, MdDelete, MdOpenInNew, MdStar, MdStarBorder, MdUnarchive} from 'react-icons/md';
import {AiFillTag} from 'react-icons/ai';
import React, {useState, useCallback} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import actions from '../actions';
import TagInputModal from '../Tags/TagInputModal';

function confirmDelete(performDelete) {
  return () => {
    if (window.confirm("This item will be permanently deleted. Are you sure?")) {
      performDelete();
    }
  }
}

const TagInput = ({article, onSave}) => {
  const [isOpen, setIsOpen] = useState(false);

  const onSaveFromModal = useCallback(tags => {
    setIsOpen(false);
    onSave(tags);
  }, [onSave]);

  return (
    <>
      <TagInputModal
        onSave={onSaveFromModal}
        tags={article.tags}
        isOpen={isOpen}
        onDismiss={() => setIsOpen(false)}
      />

      <AiFillTag title="Add tag" onClick={() => setIsOpen(!isOpen)} />
    </>
  )
}

TagInput.propTypes = {
  article: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired
};

const ArticleOperations = ({article, favorite, unfavorite, archive, readd, remove, saveTags}) => (
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

    <TagInput article={article} onSave={tags => saveTags([article], tags)}/>

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
    saveTags: actions.saveTags
  })(ArticleOperations);
