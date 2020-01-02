import React, { useState, useMemo, useRef, useEffect } from 'react';
import { throttle, find, pick } from 'lodash';
import PropTypes from 'prop-types';
import { quickProjections, textFilter } from '../projections';
import './ArticlesProjections.css';
import { connect } from 'react-redux';
import actions from './../actions';
import Tags from './../tags/Tags';
import { GoPencil, MdRefresh } from 'react-icons/all';
import BulkOperations from '../operations/BulkOperations';

const ArticleProjections = ({
  projections,
  onProjectionToggled,
  bulkEditEnabled,
  onBulkToggled,
  selectedArticles
}) => {
  const [filterText, setFilterText] = useState('');
  const textProjectionRef = useRef();
  const tagProjections = projections.filter(p => p.type === 'tag');

  useEffect(() => {
    textProjectionRef.current = find(projections, p => p.type === 'text');
  }, [projections, textProjectionRef]);

  function toggleQuickProjection(projection, activated) {
    onProjectionToggled(projection, !activated);
  }

  const updateTextFilterProjection = useMemo(() => throttle(text => {
    if (text) {
      onProjectionToggled(textFilter(text), true);
    } else if (textProjectionRef.current) {
      onProjectionToggled(textProjectionRef.current, false);
    }
  }, 300), [onProjectionToggled, textProjectionRef])

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

      {tagProjections.length > 0 ? (
        <div className="tags-filter-projection">
          <Tags
            names={tagProjections.map(p => p.tag)}
            onRemove={tag => { onProjectionToggled(tagProjections.find(p => p.tag === tag), false) }} />
        </div>
      ) : null}

      <div className="text-filter-and-operations">
        <div className="text-filter">
          <input
            type="text"
            className="text-filter__input"
            placeholder="Filter by name"
            value={filterText}
            onChange={onFilterTextChange}
          />
        </div>

        <div className="article-list-operations">
          <GoPencil
            title="Bulk edit"
            className={bulkEditEnabled ? 'bulk-edit-icon--enabled' : ''}
            onClick={onBulkToggled}
          />
          <MdRefresh title="Refresh" />
        </div>
      </div>

      {bulkEditEnabled && selectedArticles.length > 0 ? (
        <div className="article-list-bulk-operations">
          <BulkOperations articles={selectedArticles} />
        </div>
      ) : null}

    </div>
  )
}

ArticleProjections.propTypes = {
  onProjectionToggled: PropTypes.func.isRequired,
  projections: PropTypes.array.isRequired
}

export default connect(
  state => ({
    projections: state.projections,
    bulkEditEnabled: state.bulkEdit.enabled,
    selectedArticles: Object.values(pick(state.articles, Object.keys(state.bulkEdit.selectedArticles)))
  }),
  {
    onProjectionToggled: actions.toggleProjection,
    onBulkToggled: actions.toggleBulkEdit
  })(ArticleProjections);
