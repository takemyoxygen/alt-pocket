import React from 'react';
import PropTypes from 'prop-types';
import './Tags.css';
import {GoX} from 'react-icons/go';

const Tag = ({name, onRemove, onClick}) => (
  <div className="tag">
    <div onClick={() => onClick(name)}>{name}</div>
    <div title="Delete tag" className="tag__icon" onClick={() => onRemove(name)}><GoX/></div>
  </div>
);

Tag.defaultProps = {
  onClick: () => {}
}

Tag.propTypes = {
  name: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  onRemove: PropTypes.func.isRequired
};

export default Tag;
