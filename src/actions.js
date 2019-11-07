import {authorized} from './auth';
import {localDataStorage, mapArticle} from './data';
import {mapValues, partition, values} from 'lodash';
import {compose} from 'lodash/fp';
import * as apiClient from './apiClient'

export const actionTypes = {
  INIT: 'init',
  ARCHIVE: 'archive',
  UPDATE_ARTICLES: 'articles:update',
  DELETE_ARTICLES: 'articles:delete'
}

async function syncArticles(since, dispatch) {
  const articlesData = apiClient.fetchArticlesData(since);
  const [deleted, updated] = partition(values(articlesData.list), a => a.status.toString() === '2');
  if (deleted.length > 0) {
    console.log('Dispatching delete');
    dispatch({type: actionTypes.DELETE_ARTICLES, articleIds: deleted.map(a => a.item_id)});
  }

  if (updated.length > 0) {
    console.log('Dispatching update');
    dispatch({type: actionTypes.UPDATE_ARTICLES, articles: updated.map(mapArticle), since: articlesData.since});
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

const pickIds = xs => xs.map(x => x.id);

export default {
  initialize: () => async (dispatch, getState) => {
    if (authorized()) {
      const localData = localDataStorage.get();
      if (localData) {
        const articles = mapValues(localData.list, mapArticle)
        dispatch({type: actionTypes.INIT, articles, since: localData.since});
      }
      await syncArticles(getState().since, dispatch);
    }
  },

  archive: articles => (dispatch, getState) => updateArticles(
    dispatch,
    articles,
    a => ({...a, archived: true, unread: false}),
    compose(apiClient.archive, pickIds),
    getState().since
  )
}
