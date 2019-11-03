import React from 'react';
import PropTypes from 'prop-types';
import Tag from './Tag';
import './Tags.css';

const Tags = ({names, onClick, onRemove}) => (
  <div className="tags-container">
    {names.map(name => <Tag name={name} key={name} onClick={onClick} onRemove={onRemove}/>)}
  </div>
);

Tags.propTypes = {
  names: PropTypes.arrayOf(PropTypes.string).isRequired,
  onClick: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired
};

export default Tags;
