import {CONSUMER_KEY, requireAccessToken} from './auth';
import {corsProxy} from './ajax';
import {sortBy, values, compose, map, filter} from 'lodash/fp';
import {uniqueId, forEach} from 'lodash';

async function fetchArticlesData(since = undefined) {
  const body = {
    access_token: requireAccessToken(),
    consumer_key: CONSUMER_KEY,
    detailType: 'complete',
    state: 'all',
    since
  }

  const response = await fetch(corsProxy('https://getpocket.com/v3/get'),{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  return response.json();
}

function convertDate(apiDate) {
  const apiDateAsNumber = parseInt(apiDate);
  return apiDateAsNumber ? new Date(apiDateAsNumber * 1000) : null;
}

const mapArticles = map(article => {
  const url = article.resolved_url || article.given_url;
  const title = article.resolved_title || article.given_title || url;
  const cite = new URL(url).host;
  const status = parseInt(article.status);
  const favorite = parseInt(article.favorite);

  return {
    title,
    url,
    cite,
    unread: status === 0,
    archived: status === 1,
    favorite: favorite !== 0,
    id: article.item_id,
    addedAt: convertDate(article.time_added),
    archivedAt: convertDate(article.time_read),
    favoritedAt: convertDate(article.time_favorited)
  };
})

export async function getArticles() {
  let data = localStorage.getItem('articles-data');

  if (data) {
    data = JSON.parse(data);
  } else {
    data = await fetchArticlesData();
    localStorage.setItem('articles-data', JSON.stringify(data));
  }

  return compose(mapArticles, sortBy(x => x.sort_id), values)(data.list);
}

const convertData = compose(mapArticles, sortBy(x => x.sort_id), values);

async function sendCommands(commands) {
  const body = {
    consumer_key: CONSUMER_KEY,
    access_token: requireAccessToken(),
    actions: commands
  }

  const response = await fetch(corsProxy('https://getpocket.com/v3/send'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    throw new Error(`Failed to execute commands. ${response.status} - ${response.statusText}`);
  }

  return response.json();
}

function updateStatus(articleId, status) {
  return data => {
    const archived = data[articleId];

    if (archived) {
      archived.status = status; // :(
    }

    return data;
  }
}

export function createOperations(dataStore) {
  return {
    async archive({id}) {
      await sendCommands([{
        action: 'archive',
        item_id: id
      }]);

      dataStore.update(updateStatus(id, "1"));
    },

    async readd({id}) {
      await sendCommands([{
        action: 'readd',
        item_id: id
      }]);

      dataStore.update(updateStatus(id, "0"))
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
})

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

  update(f) {
    this._cachedRawData.list = f(this._cachedRawData.list);
    this._cachedConvertedData = convertData(this._cachedRawData.list);

    setTimeout(() => this._notifyAll(), 0);

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
    const storage = storageFor('articles-data');

    return new DataStore(storage, fetchArticlesData);
  }
}
