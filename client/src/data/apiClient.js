import {corsProxy} from '../ajax';
import { getConfig } from '../utils/config';

export async function fetchArticlesData(accessToken, since = undefined) {
  const {consumerKey} = await getConfig();

  const body = {
    access_token: accessToken,
    detailType: 'complete',
    state: 'all',
    since
  }

  const response = await fetch('http://localhost:5000/api/v3/get', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  return response.json();
}

async function sendCommands(accessToken, commands) {
  const {consumerKey} = await getConfig();

  const body = {
    consumer_key: consumerKey,
    access_token: accessToken,
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