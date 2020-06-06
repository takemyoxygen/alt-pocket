import {actionTypes} from './actions';
import {mapValues, keyBy, without, omit} from 'lodash'
import {unread} from './projections';

const defaultProjection = unread;

export const initialState = {
  initialized: false,
  articles: {},
  since: null,
  accessToken: '',
  authInProgress: false,
  projections: [defaultProjection],
  bulkEdit: {
    enabled: false,
    selectedArticles: {}
  }
}

export default function (state, action) {
  switch (action.type) {
    case actionTypes.INIT: {
      return {
        ...state,
        ...action.state,
        initialized: true,
      }
    }

    case actionTypes.UPDATE_ARTICLES: {
      return {
        ...state,
        since: action.since || state.since,
        articles: {
          ...state.articles,
          ...keyBy(action.articles, a => a.id)
        }
      };
    }

    case actionTypes.DELETE_ARTICLES: {
      return {
        ...state,
        articles: omit(state.articles, action.articleIds)
      };
    }

    case actionTypes.ARCHIVE: {
      return {
        ...state,
        articles: mapValues(
          state.articles,
          article => action.articleIds.indexOf(article.id) === -1
            ? article
            : {...article, archived: true, unread: false})
      };
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

      if (!newProjections.some(p => p.type === 'quick')) {
        newProjections.splice(0, 0, defaultProjection);
      }

      return {
        ...state,
        projections: newProjections
      };
    }

    case actionTypes.TOGGLE_BULK_EDIT: {
      return {
        ...state,
        bulkEdit: {
          ...state.bulkEdit,
          enabled: !state.bulkEdit.enabled,
          selectedArticles: {}
        }
      }
    }

    case actionTypes.TOGGLE_ARTICLE_SELECTED: {
      const newSelectedArticles = {...state.bulkEdit.selectedArticles};
      if (newSelectedArticles.hasOwnProperty(action.articleId)) {
        delete newSelectedArticles[action.articleId];
      } else {
        newSelectedArticles[action.articleId] = true;
      }

      return {
        ...state,
        bulkEdit: {
          ...state.bulkEdit,
          selectedArticles: newSelectedArticles
        }
      };
    }

    case actionTypes.CLEAR_ALL_ARTICLES: {
      return {
        ...state,
        articles: {},
        since: null,
        bulkEdit: {
          ...state.bulkEdit,
          enabled: false,
          selectedArticles: {}
        }
      }
    }

    case actionTypes.START_AUTH: {
      return {
        ...state,
        authInProgress: true
      };
    }

    case actionTypes.COMPLETE_AUTH: {
      return {
        ...state,
        authInProgress: false,
        accessToken: action.accessToken
      };
    }

    case actionTypes.LOGOUT: {
      return {
        ...state,
        accessToken: initialState.accessToken,
        articles: initialState.articles,
        since: initialState.since,
        projection: initialState.projection,
        bulkEdit: initialState.bulkEdit
      }
    }

    default:
      return state
  }
}
