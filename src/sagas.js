import {partition, values, without} from 'lodash';
import {compose} from 'lodash/fp';
import {call, put, select, takeEvery, takeLatest} from 'redux-saga/effects';
import * as apiClient from './data/apiClient';
import {mapArticle} from './data/converter';
import {actionTypes} from './actions';

function* syncArticles() {
  const since = yield select(state => state.since);
  const articlesData = yield call(apiClient.fetchArticlesData, since);
  const [deleted, updated] = partition(values(articlesData.list), a => a.status.toString() === '2');

  if (deleted.length > 0) {
    yield put({type: actionTypes.DELETE_ARTICLES, articleIds: deleted.map(a => a.item_id)});
  }

  if (updated.length > 0) {
    yield put({type: actionTypes.UPDATE_ARTICLES, articles: updated.map(mapArticle), since: articlesData.since});
  }
}

function* onInit() {
  yield put({type: actionTypes.SYNC});
}

function* onDelete({articles}) {
  const articleIds = pickIds(articles);
  yield put({type: actionTypes.DELETE_ARTICLES, articleIds});

  try {
    yield call(apiClient.remove, articleIds);
    yield put({type: actionTypes.SYNC});
  } catch (e) {
    yield put({type: actionTypes.UPDATE_ARTICLES, articles});
  }
}

function createArticlesUpdateSaga(updateLocal, updateRemote) {

  return function* (action) {

    const updatedArticles = action.articles.map(article => updateLocal(article, action));
    yield put({type: actionTypes.UPDATE_ARTICLES, articles: updatedArticles});

    try {
      yield call(updateRemote, updatedArticles, action);
      yield put({type: actionTypes.SYNC});
    } catch (e) {
      // rollback to previous articles state
      yield put({type: actionTypes.UPDATE_ARTICLES, articles: action.articles});

      throw e;
    }
  }
}

const pickIds = xs => xs.map(x => x.id);

export function* rootSaga() {
  yield takeEvery(actionTypes.INIT, onInit);
  yield takeLatest(actionTypes.SYNC, syncArticles);

  yield takeEvery(actionTypes.ARCHIVE_ARTICLES, createArticlesUpdateSaga(
    a => ({...a, archived: true, unread: false, archivedAt: new Date()}),
    compose(apiClient.archive, pickIds)
  ));

  yield takeEvery(actionTypes.FAVORITE_ARTICLES, createArticlesUpdateSaga(
    a => ({...a, favorite: true, favoritedAt: new Date()}),
    compose(apiClient.favorite, pickIds)
  ));

  yield takeEvery(actionTypes.READD_ARTICLES, createArticlesUpdateSaga(
    a => ({...a, archived: false, unread: true, addedAt: new Date()}),
    compose(apiClient.readd, pickIds),
  ));

  yield takeEvery(actionTypes.UNFAVORITE_ARTICLES, createArticlesUpdateSaga(
    a => ({...a, favorite: false, favoritedAt: null}),
    compose(apiClient.unfavorite, pickIds),
  ));

  yield takeEvery(actionTypes.REMOVE_TAG, createArticlesUpdateSaga(
    (a, {tag}) => ({...a, tags: without(a.tags, tag)}),
    (articles, {tag}) => apiClient.removeTag(pickIds(articles), tag),
  ));

  yield takeEvery(actionTypes.SAVE_TAGS, createArticlesUpdateSaga(
    (a, {tags}) => ({...a, tags}),
    (articles, {tags}) => apiClient.replaceTags(pickIds(articles), tags),
  ));

  yield takeEvery(actionTypes.ADD_TAGS, createArticlesUpdateSaga(
    (a, {tags}) => ({...a, tags: [...a.tags, ...tags]}),
    (articles, {tags}) => apiClient.addTags(pickIds(articles), tags),
  ));

  yield takeEvery(actionTypes.REQUEST_DELETE_ARTICLES, onDelete);
}