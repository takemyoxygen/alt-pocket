import React from 'react';
import { Unarchive, Archive, Favorite, Unfavorite, EditTags, Delete } from './Operations';
import { connect } from 'react-redux';
import actions from './../actions';

const BulkOperations = ({ articles, readd, archive, unfavorite, favorite, addTags, remove, disabled }) => (
  <div className="operations-container">

    {articles.every(a => a.archived)
      ? <Unarchive onClick={() => readd(articles)} disabled={disabled} />
      : null}

    {articles.every(a => !a.archived)
      ? <Archive onClick={() => archive(articles)} disabled={disabled} />
      : null}

    {articles.every(a => a.favorite)
      ? <Unfavorite onClick={() => unfavorite(articles)} disabled={disabled} />
      : null}

    {articles.every(a => !a.favorite)
      ? <Favorite onClick={() => favorite(articles)} disabled={disabled} />
      : null}

    <EditTags
      tags={[]}
      onSave={tags => addTags(articles, tags)}
      title="Add tags to selected articles"
      disabled={disabled}
    />

    <Delete onClick={() => remove(articles)} disabled={disabled} />
  </div>
);

function toggleBulkAnd(inner) {
  return (...args) => dispatch => {
    dispatch(actions.toggleBulkEdit());
    dispatch(inner(...args));
  }
}

export default connect(null,
  {
    archive: toggleBulkAnd(actions.archive),
    readd: toggleBulkAnd(actions.readd),
    favorite: toggleBulkAnd(actions.favorite),
    unfavorite: toggleBulkAnd(actions.unfavorite),
    remove: toggleBulkAnd(actions.remove),
    addTags: toggleBulkAnd(actions.addTags)
  })(BulkOperations);