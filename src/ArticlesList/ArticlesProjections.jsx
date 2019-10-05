import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {unread, archived, combine} from '../projections';
import './ArticlesProjections.css';

const projections = [unread, archived];

const ArticleProjections = ({defaultProjection, onProjectionChanged}) => {
  const [selectedProjections, setSelectedProjections] = useState([defaultProjection]);

  function toggleProjection(projection, currentlySelected) {
    let newSelectedProjections = currentlySelected
      ? selectedProjections.filter(pr => pr !== projection)
      : [...selectedProjections, projection]
        .filter(pr => !projection.incompatibleWith || projection.incompatibleWith.indexOf(pr) === -1);

    if (newSelectedProjections.length === 0) {
      newSelectedProjections = [defaultProjection];
    }

    setSelectedProjections(newSelectedProjections);
    onProjectionChanged(combine(newSelectedProjections));
  }

  return (
    <div className="articles-projections">
      {projections.map(pr => {
        const selected = selectedProjections.indexOf(pr) >= 0;
        return (
          <div
            key={pr.title}
            onClick={() => toggleProjection(pr, selected)}
            className={`articles-projections__projection ${selected ? 'articles-projections__projection--selected' : ''}`}
          >
            {pr.title}
          </div>
        )
      })}
    </div>
  )
}

ArticleProjections.propTypes = {
  onProjectionChanged: PropTypes.func.isRequired,
  defaultProjection: PropTypes.object.isRequired
}

export default ArticleProjections;
