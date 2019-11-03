import {authorized} from './auth';
import {localDataStorage, mapArticle} from './data';
import {mapValues} from 'lodash';

export const actionTypes = {
  INIT: 'init',
  ARCHIVE: 'archive'

}

export default {
  initialize: () => dispatch => {
    if (authorized()) {
      const localData = localDataStorage.get();
      const articles = mapValues(localData.list, mapArticle)
      dispatch({type: actionTypes.INIT, articles});
    }
  },

  archive: articles => ({
    type: actionTypes.ARCHIVE,
    articleIds: (Array.isArray(articles) ? articles.map(a => a.id) : [articles.id])
  })
}
