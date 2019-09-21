import {corsProxy} from './ajax';

export const CONSUMER_KEY = process.env.REACT_APP_API_CONSUMER_KEY;

const HOME = 'http://localhost:3000';
const ACCESS_TOKEN_KEY = 'access-token';

const redirectUrl = code => code ? `${HOME}/auth?code=${code}` : `${HOME}/auth`;

async function getRequestToken() {
  const requestBody = {
    consumer_key: CONSUMER_KEY,
    redirect_uri: redirectUrl()
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
  const requestBody = {
    consumer_key: CONSUMER_KEY,
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

  if (window.location.href.startsWith(redirectUrl())) {
    const url = new URL(window.location);
    const requestToken = url.searchParams.get('code');
    const accessToken = await obtainAccessToken(requestToken);
    storeAccessToken(accessToken);
    window.location = HOME;
  } else {
    getRequestToken().then(redirectToAuthPage);
  }
}
