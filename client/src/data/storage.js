import {mapValues} from 'lodash';

const localStorageFor = key => ({
    get() {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : null;
    },

    set(val) {
      localStorage.setItem(key, JSON.stringify(val));
    },

    clear() {
      localStorage.removeItem(key);
    }
  });

  const inner = localStorageFor('articles-state');

  export const stateStorage = {
    get() {
      const data = inner.get();
      return data && data.articles
        ? {
          ...data,
          articles: mapValues(data.articles, article => ({
            ...article,
            addedAt: article.addedAt ? new Date(article.addedAt) : null,
            favoritedAt: article.favoritedAt ? new Date(article.favoritedAt) : null,
            archivedAt: article.archivedAt ? new Date(article.archivedAt) : null
          }))
        }
        : data;
    },

    set(data) {
      const converted = data.articles
        ? {
          ...data,
          articles: mapValues(data.articles, article => ({
            ...article,
            addedAt: article.addedAt ? article.addedAt.getTime() : null,
            favoritedAt: article.favoritedAt ? article.favoritedAt.getTime() : null,
            archivedAt: article.archivedAt ? article.archivedAt.getTime() : null
          }))
        }
        : data;

        inner.set(converted);
    },

    clear: () => inner.clear()
  };