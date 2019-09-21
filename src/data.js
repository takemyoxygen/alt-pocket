import {CONSUMER_KEY, requireAccessToken} from './auth';
import {corsProxy} from './ajax';
import {sortBy, values, compose, map} from 'lodash/fp'

async function fetchArticlesData() {
  const body = {
    access_token: requireAccessToken(),
    consumer_key: CONSUMER_KEY,
    detailType: 'complete',
    sort: 'newest'
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

const convertData = map(article => {
  const url = article.resolved_url || article.given_url;
  const title = article.resolved_title || article.given_title || url;
  const cite = new URL(url).host;

  return {
    title,
    url,
    cite,
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

  return compose(convertData, sortBy(x => x.sort_id), values)(data.list);
}
