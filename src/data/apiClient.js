import {CONSUMER_KEY, requireAccessToken} from '../auth';
import {corsProxy} from '../ajax';

export async function fetchArticlesData(since = undefined) {
  const body = {
    access_token: requireAccessToken(),
    consumer_key: CONSUMER_KEY,
    detailType: 'complete',
    state: 'all',
    since
  }

  const response = await fetch(corsProxy('https://getpocket.com/v3/get'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  return response.json();
}

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

export async function sendCommand(command, ids, payload = {}) {
  return sendCommands(ids.map(id => ({
    action: command,
    item_id: id,
    ...payload
  })));
}

export function archive(ids) {
  return sendCommand('archive', ids);
}

export function readd(ids) {
  return sendCommand('readd', ids);
}

export function remove(ids) {
  return sendCommand('delete', ids);
}

export function favorite(ids) {
  return sendCommand('favorite', ids);
}

export function unfavorite(ids) {
  return sendCommand('unfavorite', ids);
}

export function removeTag(ids, tag) {
  return sendCommand('tags_remove', ids, {tags: tag});
}

export function replaceTags(ids, tags) {
  return sendCommand('tags_replace', ids, {tags: tags.join(',')});
}

export function addTags(ids, tags) {
  return sendCommand('tags_add', ids, {tags: tags.join(',')});
}