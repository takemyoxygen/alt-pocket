import React from 'react';
import PropTypes from 'prop-types';
import Tag from './Tag';
import './Tags.scss';

const Tags = ({names, onClick, onRemove, showDelete}) => (
  <div className="tags-container">
    {names.map(name => <Tag showDelete={showDelete} name={name} key={name} onClick={onClick} onRemove={onRemove}/>)}
  </div>
);

Tags.propTypes = {
  names: PropTypes.arrayOf(PropTypes.string).isRequired,
  onClick: PropTypes.func,
  onRemove: PropTypes.func.isRequired,
  showDelete: PropTypes.bool.isRequired
};

export default Tags;
