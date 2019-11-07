import {actionTypes} from './actions';
import {mapValues, keyBy} from 'lodash'
import {unread} from './projections';

export const initialState = {
  articles: {},
  since: null,
  projections: [unread]
}

export default function (state, action) {
  switch (action.type) {
    case actionTypes.INIT: {
      return {
        ...state,
        articles: action.articles,
        since: action.since
      }
    }
    case actionTypes.UPDATE_ARTICLES: {
      return {
        ...state,
        articles: {
          ...state.articles,
          ...keyBy(action.articles, a => a.id)
        }
      }
    }
    case actionTypes.ARCHIVE: {
      return {
        ...state,
        articles: mapValues(
          state.articles,
          article => action.articleIds.indexOf(article.id) === -1
            ? article
            : {...article, archived: true, unread: false})
      }
    }
    default:
      return state
  }
}
