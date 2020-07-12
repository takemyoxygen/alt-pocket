import React, { useState, useMemo, useRef, useEffect } from 'react';
import { throttle, find, pick, isPlainObject } from 'lodash';
import PropTypes from 'prop-types';
import { quickProjections, textFilter } from '../projections';
import './ArticlesProjections.scss';
import { connect } from 'react-redux';
import actions from './../actions';
import Tags from './../tags/Tags';
import BulkOperations from '../operations/BulkOperations';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';

const ArticleProjections = ({
  projections,
  onProjectionToggled,
  bulkEditEnabled,
  onBulkToggled,
  selectedArticles,
  reloadAll,
  sync
}) => {
  const [filterText, setFilterText] = useState('');
  const textProjectionRef = useRef();
  const tagProjections = projections.filter(p => p.type === 'tag');

  const selectedQuickProjections = useMemo(
    () => quickProjections
      .filter(pr => projections.indexOf(pr) >= 0)
      .map(pr => quickProjections.indexOf(pr)),
    [projections]
  );

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
      <div className="articles-projections__primary">
        <InputGroup>
          <InputGroup.Prepend>
            <ToggleButtonGroup type="checkbox" value={selectedQuickProjections}>
              {quickProjections.map((pr, index) => {
                const selected = selectedQuickProjections.indexOf(index) >= 0;
                return (
                  <ToggleButton
                    className="articles-projections__quick"
                    variant="secondary"
                    value={index}
                    onChange={() => toggleQuickProjection(pr, selected)}
                    key={pr.title}
                  >
                    {pr.title}
                  </ToggleButton>
                )
              })}
            </ToggleButtonGroup>
          </InputGroup.Prepend>

          <FormControl
            placeholder="Filter by name"
            value={filterText}
            onChange={onFilterTextChange}
          />
        </InputGroup>
      </div>


      {tagProjections.length > 0 ? (
        <div className="tags-filter-projection">
          <Tags
            names={tagProjections.map(p => p.tag)}
            onRemove={tag => { onProjectionToggled(tagProjections.find(p => p.tag === tag), false) }} />
        </div>
      ) : null}

      <div className="text-filter-and-operations">

      </div>

      {bulkEditEnabled ? (
        <div className="article-list-bulk-operations">
          <BulkOperations articles={selectedArticles} disabled={selectedArticles.length === 0} />
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
    onBulkToggled: actions.toggleBulkEdit,
    reloadAll: actions.reloadAll,
    sync: actions.sync
  })(ArticleProjections);
