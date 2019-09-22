import {CONSUMER_KEY, requireAccessToken} from './auth';
import {corsProxy} from './ajax';
import {sortBy, values, compose, map} from 'lodash/fp';
import {uniqueId} from 'lodash';

async function fetchArticlesData(since = undefined) {
  const body = {
    access_token: requireAccessToken(),
    consumer_key: CONSUMER_KEY,
    detailType: 'complete',
    sort: 'newest',
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

const mapArticles = map(article => {
  const url = article.resolved_url || article.given_url;
  const title = article.resolved_title || article.given_title || url;
  const cite = new URL(url).host;
  const status = parseInt(article.status);

  return {
    title,
    url,
    cite,
    unread: status === 0,
    archived: status === 1,
    id: article.item_id
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

export async function archive(articleId, dataStore) {
  await sendCommands([{
    action: 'archive',
    item_id: articleId
  }]);

  dataStore.update(data => {
    const archived = data[articleId];

    if (archived) {
      archived.status = 1; // :(
    }

    return data;
  });
}

export class DataStore {
  constructor(initialData) {
    this.cachedRawData = initialData.list;
    this.cachedConvertedData = convertData(initialData.list);
    this.since = initialData.since;
    this.subscriptions = {};
  }

  subscribe(filter, callback) {
    const key = uniqueId('data-subscription');
    const subscription = {filter, callback};
    this.subscriptions[key] = subscription;

    setTimeout(() => this._notify(subscription), 0);

    return () => {
      delete this.subscriptions[key];
    };
  }

  _notify({filter, callback}) {
    callback(this.cachedConvertedData.filter(filter));
  }

  _notifyAll() {
    values(this.subscriptions)
      .forEach(subscription => this._notify(subscription));
  }

  update(f) {
    this.cachedRawData = f(this.cachedRawData);
    this.cachedConvertedData = convertData(this.cachedRawData);

    setTimeout(() => this._notifyAll(), 0);
    // todo re-fetch all data from the service;
  }

  static async create() {
    const storedArticles = localStorage.getItem('articles-data');
    if (storedArticles) {
      return new DataStore(JSON.parse(storedArticles));
    }

    const loadedArticles = await fetchArticlesData();
    localStorage.setItem('articles-data', JSON.stringify(loadedArticles));

    return new DataStore(loadedArticles);
  }
}
