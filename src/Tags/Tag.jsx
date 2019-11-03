import React from 'react';
import PropTypes from 'prop-types';
import './Tags.css';

const Tag = ({name}) => (
  <div className="tag">{name}</div>
);

Tag.propTypes = {
  name: PropTypes.string.isRequired
};

export default Tag;
