import {compose, map, values} from 'lodash/fp';

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
  const origin = url ? new URL(url).origin : undefined;

  return {
    title,
    url,
    cite,
    tags,
    origin,
    unread: status === 0,
    archived: status === 1,
    favorite: favorite !== 0,
    id: article.item_id,
    addedAt: convertDate(article.time_added),
    archivedAt: convertDate(article.time_read),
    favoritedAt: convertDate(article.time_favorited)
  };
}

