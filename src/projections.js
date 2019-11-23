import {compact} from 'lodash';

export const unread = {
  type: 'quick',
  title: 'Unread',
  filter: article => article.unread,
  ordering: article => -article.addedAt,
  incompatibleWith: another => another === archived
};

export const archived = {
  type: 'quick',
  title: 'Archived',
  filter: article => article.archived,
  ordering: article => -article.archivedAt,
  incompatibleWith: another => another === unread
};

export const favorite = {
  type: 'quick',
  title: 'Favorite',
  filter: article => article.favorite,
  ordering: article => -article.favoritedAt,
}

export const quickProjections = [unread, archived, favorite];

export function textFilter(text) {
  return {
    type: 'text',
    title: 'Filter by text',
    filter: article => !text || article.title.toLowerCase().indexOf(text.toLowerCase()) >= 0,
    incompatibleWith: another => another.type === 'text'
  }
}

export function tagFilter(tag) {
  const tagLower = tag.toLowerCase()
  return {
    type: 'tag',
    tag,
    title: 'Filter by tag',
    filter: article => article.tags.some(t => t.toLowerCase() === tagLower)
  }
}

export function combine(projections) {
  return {
    title: projections.map(p => p.title).join(', '),
    filter: article => projections.every(pr => pr.filter(article)),
    ordering: compact(projections.map(p => p.ordering))
  }
}
