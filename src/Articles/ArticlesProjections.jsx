import React, {useState, useMemo} from 'react';
import {throttle, } from 'lodash';
import PropTypes from 'prop-types';
import {quickProjections, textFilter} from '../projections';
import './ArticlesProjections.css';
import {connect} from 'react-redux';
import actions from './../actions';

const ArticleProjections = ({projections, onProjectionToggled}) => {
  const [filterText, setFilterText] = useState('');

  function toggleQuickProjection(projection, activated) {
    onProjectionToggled(projection, !activated);
  }

  const updateTextFilterProjection = useMemo(() => throttle(text => {
    onProjectionToggled(text ? textFilter(text) : null, !!text);
  }, 300), [onProjectionToggled])

  function onFilterTextChange(evt) {
    setFilterText(evt.target.value);

    updateTextFilterProjection(evt.target.value);
  }

  return (
    <div className="articles-projections">
      <div className="quick-projections">
        {quickProjections.map(pr => {
          const selected = projections.indexOf(pr) >= 0;
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
  onProjectionToggled: PropTypes.func.isRequired,
  projections: PropTypes.array.isRequired
}

export default connect(
    state => ({projections: state.projections}),
    dispatch => ({onProjectionToggled: (projection, enabled) => dispatch(actions.toggleProjection(projection, enabled))}))(
      ArticleProjections
  );
