import React, {useState, useMemo, useEffect} from 'react';
import {throttle, compact} from 'lodash';
import PropTypes from 'prop-types';
import {unread, archived, favorite, textFilter} from '../projections';
import './ArticlesProjections.css';

const quickProjections = [unread, archived, favorite];

const ArticleProjections = ({defaultProjection, onProjectionsChanged}) => {
  const [selectedQuickProjections, setSelectedQuickProjections] = useState([defaultProjection]);
  const [textFilterProjection, setTextFilterProjection] = useState(null);
  const [filterText, setFilterText] = useState('');

  useEffect(() => {
    onProjectionsChanged(compact([...selectedQuickProjections, textFilterProjection]));
  }, [onProjectionsChanged, selectedQuickProjections, textFilterProjection]);

  function toggleQuickProjection(projection, currentlySelected) {
    let newSelectedProjections = currentlySelected
      ? selectedQuickProjections.filter(pr => pr !== projection)
      : [...selectedQuickProjections, projection]
        .filter(pr => !projection.incompatibleWith || projection.incompatibleWith.indexOf(pr) === -1);

    if (newSelectedProjections.length === 0) {
      newSelectedProjections = [defaultProjection];
    }

    setSelectedQuickProjections(newSelectedProjections);
  }

  const updateTextFilterProjection = useMemo(() => throttle(text => {
    setTextFilterProjection(text ? textFilter(text) : null);
  }, 300), [])

  function onFilterTextChange(evt) {
    setFilterText(evt.target.value);
    console.log('text change');
    updateTextFilterProjection(evt.target.value);
  }

  return (
    <div className="articles-projections">
      <div className="quick-projections">
        {quickProjections.map(pr => {
          const selected = selectedQuickProjections.indexOf(pr) >= 0;
          return (
            <div
              key={pr.title}
              onClick={() => toggleQuickProjection(pr, selected)}
              className={`articles-projections__projection ${selected ? 'articles-projections__projection--selected' : ''}`}
            >
              {pr.title}
            </div>
          )
        })}
      </div>

      <div className="text-filter-projection">
        <input
          type="text"
          className="text-filter-projection__input"
          placeholder="Filter by name"
          value={filterText}
          onChange={onFilterTextChange}
        />
      </div>

    </div>
  )
}

ArticleProjections.propTypes = {
  onProjectionsChanged: PropTypes.func.isRequired,
  defaultProjection: PropTypes.object.isRequired
}

export default ArticleProjections;
