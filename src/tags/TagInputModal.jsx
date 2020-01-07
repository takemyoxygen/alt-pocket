import React, {useState, useCallback} from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';
import ReactTags from 'react-tag-autocomplete'
import './Tags.scss';
import Tag from './Tag';

const KeyCodes = {
    comma: 188,
    enter: 13,
  };

const delimiters = [KeyCodes.comma, KeyCodes.enter];

const TagComponent = ({tag, onDelete}) => <Tag name={tag.name} onRemove={() => onDelete()} />;

const TagInputModal = ({tags, onSave, onDismiss, isOpen, title}) => {

  const [currentTags, setCurrentTags] = useState(tags.map(t => ({id: t, name: t})));

  const onAdd = useCallback(tag => {
    setCurrentTags([...currentTags, tag]);
  }, [currentTags]);

  const onDelete = useCallback(index => {
      const updated = [...currentTags];
      updated.splice(index, 1);
      setCurrentTags(updated);
  }, [currentTags]);

  const handleSave = useCallback(() => {
      onSave(currentTags.map(t => t.name));
  }, [currentTags, onSave]);

  const handleDismiss = useCallback(() => {
      setCurrentTags(tags.map(t => ({id: t, name: t})));
      onDismiss();
  }, [tags, onDismiss]);

  return (
    <ReactModal
      isOpen={isOpen}
      shouldCloseOnOverlayClick={true}
      onRequestClose={handleDismiss}
      className="tag-input-modal"
      overlayClassName="tag-input-modal__overlay"
      ariaHideApp={false}
    >
        <div className="tag-input-content">
            <h3 className="tag-input-content__header">{title}</h3>
            <ReactTags
              tags={currentTags}
              handleAddition={onAdd}
              delimiters={delimiters}
              allowNew={true}
              tagComponent={TagComponent}
              handleDelete={onDelete}
              autoresize={false}
            />
            <div className="tag-input-content__buttons">
                <button type="button" onClick={handleSave}>Save</button>
                <button type="button" onClick={handleDismiss}>Cancel</button>
            </div>
        </div>
    </ReactModal>
  );
}

TagInputModal.propTypes = {
    tags: PropTypes.arrayOf(PropTypes.string),
    onSave: PropTypes.func.isRequired,
    onDismiss: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired
};

TagInputModal.defaultProps = {
    tags: []
};

export default TagInputModal;