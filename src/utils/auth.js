import {corsProxy} from '../ajax';
import {getConfig} from './config'

const home = window.location.href;
const ACCESS_TOKEN_KEY = 'access-token';

const redirectUrl = reqToken => `${home}?request-token=${reqToken}`;

async function getRequestToken() {

  const {consumerKey} = await getConfig();

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

function storeAccessToken(accessToken) {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
}

function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

async function obtainAccessToken(requestToken) {

  const {consumerKey} = await getConfig();

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

export function requireAccessToken() {
  const accessToken = getAccessToken();
  if (!accessToken) {
    throw new Error('No access token found');
  }

  return accessToken;
}

export const authorized = () => !!getAccessToken();

export async function authorize() {
  const accessToken = localStorage.getItem('access-token');
  if (accessToken) {
    return;
  }

  const url = new URL(window.location);
  const requestToken = url.searchParams.get('request-token');

  if (requestToken) {
    const accessToken = await obtainAccessToken(requestToken);
    storeAccessToken(accessToken);
    url.searchParams.delete('request-token');
    window.location = url.href;
  } else {
    getRequestToken().then(redirectToAuthPage);
  }
}
