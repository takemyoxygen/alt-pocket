export const unread = {
  filter: article => article.unread,
  ordering: article => -article.addedAt
};

export const archived = {
  filter: article => article.archived,
  ordering: article => -article.archivedAt
};
