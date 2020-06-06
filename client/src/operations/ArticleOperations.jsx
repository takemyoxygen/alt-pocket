import React from 'react';
import { connect } from 'react-redux';
import actions from '../actions';
import { OpenInNewTab, Archive, Unarchive, Unfavorite, Favorite, EditTags, Delete } from './Operations';

const ArticleOperations = ({ article, favorite, unfavorite, archive, readd, remove, saveTags }) => (
  <div className="operations-container">
    <OpenInNewTab url={article.url} />

    {article.archived
      ? <Unarchive onClick={() => readd([article])} />
      : <Archive onClick={() => archive([article])} />}

    {article.favorite
      ? <Unfavorite onClick={() => unfavorite([article])} />
      : <Favorite onClick={() => favorite([article])} />}

    <EditTags tags={article.tags} onSave={tags => saveTags([article], tags)} title="Edit article tags"/>

    <Delete onClick={() => remove([article])} />
  </div>
)

export default connect(null,
  {
    archive: actions.archive,
    readd: actions.readd,
    favorite: actions.favorite,
    unfavorite: actions.unfavorite,
    remove: actions.remove,
    saveTags: actions.saveTags
  })(ArticleOperations);
