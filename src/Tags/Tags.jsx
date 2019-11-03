import React from 'react';
import PropTypes from 'prop-types';
import Tag from './Tag';
import './Tags.css';

const Tags = ({names}) => (
  <div className="tags-container">
    {names.map(name => <Tag name={name} key={name}/>)}
  </div>
);

Tags.propTypes = {
  names: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default Tags;
