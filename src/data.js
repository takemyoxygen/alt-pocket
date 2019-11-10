import {compose, filter, map, sortBy, values} from 'lodash/fp';
import {forEach, uniqueId, without, mapValues} from 'lodash';
import {fetchArticlesData, sendCommand} from './apiClient';

function convertDate(apiDate) {
  const apiDateAsNumber = parseInt(apiDate);
  return apiDateAsNumber ? new Date(apiDateAsNumber * 1000) : null;
}

export function mapArticle(article) {
  const url = article.resolved_url || article.given_url;
  const title = article.resolved_title || article.given_title || url;
  const cite = new URL(url).host;
  const status = parseInt(article.status);
  const favorite = parseInt(article.favorite);
  const tags = compose(map(tagInfo => tagInfo.tag), values)(article.tags);

  return {
    title,
    url,
    cite,
    tags,
    unread: status === 0,
    archived: status === 1,
    favorite: favorite !== 0,
    id: article.item_id,
    addedAt: convertDate(article.time_added),
    archivedAt: convertDate(article.time_read),
    favoritedAt: convertDate(article.time_favorited),
  };
}

const convertData = compose(map(mapArticle), sortBy(x => x.sort_id), values);

function updateArticle(articleId, update) {
  return data => {
    const article = data[articleId];

    if (!article) {
      return data
    }

    return {
      ...data,
      [articleId]: update(article)
    };
  }
}

function updateStatus(articleId, status) {
  return updateArticle(articleId, article => ({
    ...article,
    status
  }));
}

export function createOperations(dataStore) {
  return {
    archive({id}) {
      return dataStore.update(
        updateStatus(id, '1'),
        () => sendCommand('archive', id)
      )
    },

    readd({id}) {
      return dataStore.update(
        updateStatus(id, "0"),
        () => sendCommand('readd', id)
      );
    },

    delete({id}) {
      return dataStore.update(
        data => {
          const copy = {...data};
          delete copy[id];
          return copy;
        },
        () => sendCommand('delete', id));
    },

    favorite({id}) {
      return dataStore.update(
        updateArticle(id, article => ({
          ...article,
          favorite: "1"
        })),
        () => sendCommand('favorite', id)
      );
    },

    unfavorite({id}) {
      return dataStore.update(
        updateArticle(id, article => ({
          ...article,
          favorite: "0"
        })),
        () => sendCommand('unfavorite', id)
      );
    },

    removeTag({id}, tag) {
      return dataStore.update(
        updateArticle(id, article => ({
          ...article,
          tags: without(article.tags, tag)
        })),
        () => sendCommand('tags_remove', id, {tags: tag})
      )
    }
  }
}

const storageFor = key => ({
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

export const localDataStorage = storageFor('articles-data')

const inner = storageFor('articles-state');

export const stateStorage = {
  get() {
    const data = inner.get();
    return data.articles
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


export class DataStore {
  constructor(storage, fetchData) {
    this._storage = storage;

    const stored = storage.get();
    this._cachedRawData = stored || {list: {}};
    this._cachedConvertedData = convertData(this._cachedRawData.list);
    this._subscriptions = {};
    this._fetchData = fetchData;

    this._sync();
  }

  subscribe(projection, callback) {
    const key = uniqueId('data-subscription');
    const subscription = {projection, callback};
    this._subscriptions[key] = subscription;

    setTimeout(() => this._notify(subscription), 0);

    return {
      unsubscribe:() => {
        delete this._subscriptions[key]
      }
    };
  }

  _notify({projection, callback}) {
    compose(
      callback,
      sortBy(projection.ordering),
      filter(projection.filter))(this._cachedConvertedData);
  }

  _notifyAll() {
    values(this._subscriptions)
      .forEach(subscription => this._notify(subscription));
  }

  async update(optimistic, remote) {
    this._cachedRawData.list = optimistic(this._cachedRawData.list);
    this._cachedConvertedData = convertData(this._cachedRawData.list);

    setTimeout(() => this._notifyAll(), 0);

    await remote();

    this._sync();
  }

  async _sync() {
    const updates = await this._fetchData(this._cachedRawData.since);

    const newData = {
      ...updates,
      list: {...this._cachedRawData.list}
    };

    forEach(updates.list, (val, key) => {
      if (val.status.toString() === "2") {
        delete newData.list[key];
      } else {
        newData.list[key] = val;
      }
    })

    this._cachedRawData = newData;
    this._cachedConvertedData = convertData(newData.list);

    this._storage.set(newData);

    setTimeout(() => this._notifyAll(), 0);
  }

  static async create() {
    return new DataStore(localDataStorage, fetchArticlesData);
  }
}
