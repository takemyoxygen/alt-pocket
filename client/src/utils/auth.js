import { corsProxy } from '../ajax';
import { getConfig } from './config'

const home = window.location.href;

const redirectUrl = reqToken => `${home}?request-token=${reqToken}`;

async function getRequestToken() {

  const { consumerKey } = await getConfig();

  const requestBody = {
    consumer_key: consumerKey,
    redirect_uri: home
  };

  const response = await fetch((corsProxy('https://getpocket.com/v3/oauth/request')), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF8',
      'X-Accept': 'application/json'
    },
    body: JSON.stringify(requestBody)
  });

  const jsonResponse = await response.json();

  return jsonResponse.code;
}

function redirectToAuthPage(requestToken) {
  window.location =
    `https://getpocket.com/auth/authorize?request_token=${requestToken}&redirect_uri=${encodeURIComponent(redirectUrl(requestToken))}`;
}

async function obtainAccessToken(requestToken) {

  const { consumerKey } = await getConfig();

  const requestBody = {
    consumer_key: consumerKey,
    code: requestToken
  };

  const response = await fetch((corsProxy('https://getpocket.com/v3/oauth/authorize')), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF8',
      'X-Accept': 'application/json'
    },
    body: JSON.stringify(requestBody)
  });

  const jsonResponse = await response.json();
  return jsonResponse.access_token;
}

export async function tryCompleteAuth() {
  const url = new URL(window.location);
  const requestToken = url.searchParams.get('request-token');

  if (requestToken) {
    const accessToken = await obtainAccessToken(requestToken);
    url.searchParams.delete('request-token');
    window.history.replaceState({}, document.title, url.pathname);
    return accessToken;
  }

  return null;
}

export async function authorize() {
  getRequestToken().then(redirectToAuthPage);
}