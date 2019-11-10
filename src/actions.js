import {mapArticle} from './data';
import {partition, values} from 'lodash';
import {compose} from 'lodash/fp';
import * as apiClient from './apiClient'

export const actionTypes = {
  INIT: 'init',
  ARCHIVE: 'archive',
  UPDATE_ARTICLES: 'articles:update',
  DELETE_ARTICLES: 'articles:delete',
  TOGGLE_PROJECTION: 'projection:toggle'
}

const pickIds = xs => xs.map(x => x.id);

async function syncArticles(since, dispatch) {
  const articlesData = await apiClient.fetchArticlesData(since);
  const [deleted, updated] = partition(values(articlesData.list), a => a.status.toString() === '2');
  if (deleted.length > 0) {
    dispatch({type: actionTypes.DELETE_ARTICLES, articleIds: deleted.map(a => a.item_id)});
  }

  if (updated.length > 0) {
    dispatch({type: actionTypes.UPDATE_ARTICLES, articles: updated.map(mapArticle), since: articlesData.since});
  }
}

async function removeArticles(dispatch, articles, removeRemote, since) {
  dispatch({type: actionTypes.DELETE_ARTICLES, articleIds: pickIds(articles)});

  try {
    await removeRemote(articles);
    await syncArticles(since, dispatch);
  } catch (e) {
    // return articles back if deletion from the API fails
    dispatch({type: actionTypes.UPDATE_ARTICLES, articles});

    throw e;
  }
}

async function updateArticles(dispatch, articles, updateLocal, updateRemote, since) {
  const updatedArticles = articles.map(updateLocal);
  dispatch({type: actionTypes.UPDATE_ARTICLES, articles: updatedArticles});

  try {
    await updateRemote(updatedArticles);
    await syncArticles(since, dispatch);
  } catch (e) {
    // rollback to previous articles state
    dispatch({type: actionTypes.UPDATE_ARTICLES, articles});

    throw e;
  }
}

export default {
  initialize: (initState) => async (dispatch, getState) => {
    dispatch({type: actionTypes.INIT, state: initState});
    await syncArticles(getState().since, dispatch);
  },

  toggleProjection(projection, enabled) {
    return {type: actionTypes.TOGGLE_PROJECTION, projection, enabled};
  },

  archive: articles => (dispatch, getState) => updateArticles(
    dispatch,
    articles,
    a => ({...a, archived: true, unread: false, archivedAt: new Date()}),
    compose(apiClient.archive, pickIds),
    getState().since
  ),

  readd: articles => (dispatch, getState) => updateArticles(
    dispatch,
    articles,
    a => ({...a, archive: false, unread: true, addedAt: new Date()}),
    compose(apiClient.readd, pickIds),
    getState().since
  ),

  favorite: articles => (dispatch, getState) => updateArticles(
    dispatch,
    articles,
    a => ({...a, favorite: true, favoritedAt: new Date()}),
    compose(apiClient.favorite, pickIds),
    getState().since
  ),

  unfavorite: articles => (dispatch, getState) => updateArticles(
    dispatch,
    articles,
    a => ({...a, favorite: false, favoritedAt: null}),
    compose(apiClient.unfavorite, pickIds),
    getState().since
  ),

  remove: articles => (dispatch, getState) => removeArticles(
    dispatch,
    articles,
    compose(apiClient.remove, pickIds),
    getState().since
  )
}
