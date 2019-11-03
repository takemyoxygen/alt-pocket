import React from 'react';
import PropTypes from 'prop-types';
import './Tags.css';
import {GoX} from 'react-icons/go';

const Tag = ({name, onRemove, onClick}) => (
  <div className="tag">
    <div onClick={() => onClick(name)}>{name}</div>
    <div className="tag__icon" onClick={() => onRemove(name)}><GoX/></div>
  </div>
);

Tag.propTypes = {
  name: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired
};

export default Tag;
