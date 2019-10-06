import {compact} from 'lodash';

export const unread = {
  title: 'Unread',
  filter: article => article.unread,
  ordering: article => -article.addedAt
};

export const archived = {
  title: 'Archived',
  filter: article => article.archived,
  ordering: article => -article.archivedAt
};

export const favorite = {
  title: 'Favorite',
  filter: article => article.favorite,
  ordering: article => -article.favoritedAt,
}

unread.incompatibleWith = [archived];
archived.incompatibleWith = [unread];

export function textFilter(text) {
  return {
    title: 'Filter by text',
    filter: article => !text || article.title.toLowerCase().indexOf(text.toLowerCase()) >= 0
  }
}

export function combine(projections) {
  return {
    title: projections.map(p => p.title).join(', '),
    filter: article => projections.every(pr => pr.filter(article)),
    ordering: compact(projections.map(p => p.ordering))
  }
}
