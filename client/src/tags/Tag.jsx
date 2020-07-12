import React from 'react';
import PropTypes from 'prop-types';
import './Tags.scss';
import {GoX} from 'react-icons/go';
import Badge from 'react-bootstrap/Badge'

const Tag = ({name, onRemove, onClick, showDelete = true}) => (
  <Badge variant="primary" className="tag">
    <div className="tag__text" onClick={() => onClick(name)}>{name}</div>
    {showDelete
     ? <div title="Delete tag" className="tag__icon" onClick={() => onRemove(name)}><GoX/></div>
      : null
    }
  </Badge>
);

Tag.defaultProps = {
  onClick: () => {}
}

Tag.propTypes = {
  name: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  onRemove: PropTypes.func.isRequired,
  showDelete: PropTypes.bool
};

export default Tag;
