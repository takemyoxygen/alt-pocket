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

unread.incompatibleWith = [archived]
archived.incompatibleWith = [unread]

export function combine(projections) {
  return {
    title: projections.map(p => p.title).join(', '),
    filter: article => projections.every(pr => pr.filter(article)),
    ordering: projections.map(p => p.ordering)
  }
}
