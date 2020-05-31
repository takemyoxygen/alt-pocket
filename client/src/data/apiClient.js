import {corsProxy} from '../ajax';
import config from '../utils/config';

function makeRequest(relativeUrl, options) {
  const apiFullUrl = new URL(relativeUrl, config.apiBaseUrl);

  const requestUrl = config.useCorsProxy ? corsProxy(apiFullUrl.href) : apiFullUrl.href;

  if (options.body && config.consumerKey) {
    options.body.consumer_key = config.consumerKey;
  }

  const requestOptions = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    body: JSON.stringify(options.body)
  }

  return fetch(requestUrl, requestOptions);
}

export async function fetchArticlesData(accessToken, since = undefined) {

  const body = {
    access_token: accessToken,
    detailType: 'complete',
    state: 'all',
    since
  }

  const response = await makeRequest('v3/get', {
    method: 'POST',
    body
  });

  return response.json();
}

async function sendCommands(accessToken, commands) {
  const body = {
    access_token: accessToken,
    actions: commands
  }

  const response = await makeRequest('v3/send', {
    method: 'POST',
    body
  });

  if (!response.ok) {
    throw new Error(`Failed to execute commands. ${response.status} - ${response.statusText}`);
  }

  return response.json();
}

export async function sendCommand(accessToken, command, ids, payload = {}) {
  return sendCommands(accessToken, ids.map(id => ({
    action: command,
    item_id: id,
    ...payload
  })));
}

export function archive(ids, accessToken) {
  return sendCommand(accessToken, 'archive', ids);
}

export function readd(ids, accessToken) {
  return sendCommand(accessToken, 'readd', ids);
}

export function remove(ids, accessToken) {
  return sendCommand(accessToken, 'delete', ids);
}

export function favorite(ids, accessToken) {
  return sendCommand(accessToken, 'favorite', ids);
}

export function unfavorite(ids, accessToken) {
  return sendCommand(accessToken, 'unfavorite', ids);
}

export function removeTag(ids, tag, accessToken) {
  return sendCommand(accessToken, 'tags_remove', ids, {tags: tag});
}

export function replaceTags(ids, tags, accessToken) {
  return sendCommand(accessToken, 'tags_replace', ids, {tags: tags.join(',')});
}

export function addTags(ids, tags, accessToken) {
  return sendCommand(accessToken, 'tags_add', ids, {tags: tags.join(',')});
}