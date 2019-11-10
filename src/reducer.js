import {actionTypes} from './actions';
import {mapValues, keyBy, without} from 'lodash'
import {unread} from './projections';

const defaultProjection = unread;

export const initialState = {
  articles: {},
  since: null,
  projections: [defaultProjection]
}

export default function (state, action) {
  switch (action.type) {
    case actionTypes.INIT: {
      return {
        ...state,
        ...action.state
      }
    }

    case actionTypes.UPDATE_ARTICLES: {
      return {
        ...state,
        since: action.since,
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

    case actionTypes.TOGGLE_PROJECTION: {
      const newProjections = action.enabled
        ? [
            ...(action.projection.incompatibleWith
                ? state.projections.filter(p => !action.projection.incompatibleWith(p))
                : state.projections),
             action.projection
          ]
        : without(state.projections, action.projection);

      return {
        ...state,
        projections: newProjections.length > 0 ? newProjections : [defaultProjection]
      };
    }

    default:
      return state
  }
}
