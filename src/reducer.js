import {actionTypes} from './actions';
import {mapValues} from 'lodash'

export const initialState = {

}

export default function (state, action) {
  switch (action.type) {
    case actionTypes.INIT: {
      return {
        ...state,
        articles: action.articles
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
