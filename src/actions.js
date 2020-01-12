export const actionTypes = {
  INIT: 'init',
  SYNC: 'sync',
  ARCHIVE_ARTICLES: 'articles:archive',
  READD_ARTICLES: 'articles:readd',
  FAVORITE_ARTICLES: 'articles:favorite',
  UNFAVORITE_ARTICLES: 'articles:unfavorite',
  UPDATE_ARTICLES: 'articles:update',
  REQUEST_DELETE_ARTICLES: 'articles:request-delete',
  DELETE_ARTICLES: 'articles:delete',
  REMOVE_TAG: 'articles:remove-tag',
  SAVE_TAGS: 'articles:save-tags',
  ADD_TAGS: 'articles:add-tags',
  TOGGLE_PROJECTION: 'projection:toggle',
  TOGGLE_BULK_EDIT: 'bulk-edit:toggle',
  TOGGLE_ARTICLE_SELECTED: 'bulk-edit:toggle-article',
  RELOAD_ALL_ARTICLES: 'reload',
  CLEAR_ALL_ARTICLES: 'clear',
  LOGIN: 'login'
}

export default {
  initialize(initState) {
    return {type: actionTypes.INIT, state: initState};
  },

  toggleProjection(projection, enabled) {
    return {type: actionTypes.TOGGLE_PROJECTION, projection, enabled};
  },

  archive(articles) {
    return {type: actionTypes.ARCHIVE_ARTICLES, articles};
  },

  readd(articles) {
    return {type: actionTypes.READD_ARTICLES, articles};
  },

  favorite(articles) {
    return {type: actionTypes.FAVORITE_ARTICLES, articles};
  },

  unfavorite(articles) {
    return {type: actionTypes.UNFAVORITE_ARTICLES, articles};
  },

  remove(articles) {
    return {type: actionTypes.REQUEST_DELETE_ARTICLES, articles};
  },

  removeTag(article, tag) {
    return {type: actionTypes.REMOVE_TAG, articles: [article], tag};
  },

  saveTags(articles, tags) {
    return {type: actionTypes.SAVE_TAGS, articles, tags};
  },

  addTags(articles, tags) {
    return {type: actionTypes.ADD_TAGS, articles, tags};
  },

  toggleBulkEdit() {
    return {type: actionTypes.TOGGLE_BULK_EDIT};
  },

  toggleArticleSelected(article) {
    return {type: actionTypes.TOGGLE_ARTICLE_SELECTED, articleId: article.id};
  },

  reloadAll() {
    return {type: actionTypes.RELOAD_ALL_ARTICLES};
  },

  sync() {
    return {type: actionTypes.SYNC };
  },

  login() {
    return {type: actionTypes.LOGIN};
  }
}
