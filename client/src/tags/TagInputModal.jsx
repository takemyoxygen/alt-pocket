import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import ReactTags from 'react-tag-autocomplete'
import './Tags.scss';
import Tag from './Tag';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

const KeyCodes = {
  comma: 188,
  enter: 13,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];

const TagComponent = ({ tag, onDelete }) => <Tag name={tag.name} onRemove={() => onDelete()} />;

const TagInputModal = ({ tags, onSave, onDismiss, isOpen, title }) => {

  const [currentTags, setCurrentTags] = useState(tags.map(t => ({ id: t, name: t })));

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
    setCurrentTags(tags.map(t => ({ id: t, name: t })));
    onDismiss();
  }, [tags, onDismiss]);

  return (
    <Modal
      centered={true}
      show={isOpen}
      onHide={handleDismiss}
    >
      <Modal.Header>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ReactTags
          tags={currentTags}
          handleAddition={onAdd}
          delimiters={delimiters}
          allowNew={true}
          tagComponent={TagComponent}
          handleDelete={onDelete}
          autoresize={false}
          inputAttributes={{ className: 'form-control' }}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleSave}>Save</Button>
        <Button variant="secondary" onClick={handleDismiss}>Cancel</Button>
      </Modal.Footer>
    </Modal>
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