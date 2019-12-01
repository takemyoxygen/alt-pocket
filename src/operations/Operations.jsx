import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { MdUnarchive, MdArchive, MdStarBorder, MdStar, MdDelete, MdOpenInNew } from 'react-icons/md';
import { AiFillTag } from 'react-icons/ai';
import TagInputModal from './../Tags/TagInputModal';
import './Operations.css';

export const OpenInNewTab = ({ url }) => (
  <a
    href={url}
    target="_blank"
    className="operation operation__open"
    rel="noopener noreferrer"
    title="Open in a new tab"
  >
    <MdOpenInNew />
  </a>
);

OpenInNewTab.propTypes = {
  url: PropTypes.string.isRequired
}

const clickProps = {
  onClick: PropTypes.func.isRequired
};

export const Unarchive = ({ onClick }) =>
  <MdUnarchive ctitle="Unarchive" onClick={onClick} />;

Unarchive.propTypes = clickProps;

export const Archive = ({ onClick }) =>
  <MdArchive className="operation" title="Archive" onClick={onClick} />;
Archive.propTypes = clickProps;

export const Favorite = ({ onClick }) =>
  <MdStarBorder className="operation" title="Favorite" onClick={onClick} />;

Favorite.propTypes = clickProps;

export const Unfavorite = ({ onClick }) =>
  <MdStar className="operation" title="Unfavorite" onClick={onClick} />;

Unfavorite.propTypes = clickProps;

function confirmDelete(performDelete) {
  return () => {
    if (window.confirm("Deletion is permanent. Are you sure?")) {
      performDelete();
    }
  }
}

export const Delete = ({ onClick }) =>
  <MdDelete className="operation" title="Delete" onClick={confirmDelete(onClick)} />;

Delete.propTypes = clickProps;

const TagInput = ({ tags, onSave }) => {
  const [isOpen, setIsOpen] = useState(false);

  const onSaveFromModal = useCallback(tags => {
    setIsOpen(false);
    onSave(tags);
  }, [onSave]);

  return (
    <>
      <TagInputModal
        onSave={onSaveFromModal}
        tags={tags}
        isOpen={isOpen}
        onDismiss={() => setIsOpen(false)}
      />

      <AiFillTag className="operation" title="Add tag" onClick={() => setIsOpen(!isOpen)} />
    </>
  )
}

TagInput.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string),
  onSave: PropTypes.func.isRequired
};

export const EditTags = ({ tags, onSave }) => <TagInput tags={tags} onSave={onSave} />;
EditTags.propTypes = TagInput.propTypes;