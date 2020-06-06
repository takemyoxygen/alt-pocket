import { makeRequest } from '../data/apiClient';

const home = window.location.href;

const redirectUrl = reqToken => `${home}?request-token=${reqToken}`;

async function getRequestToken() {

  const body = {
    redirect_uri: home
  };

  const response = await makeRequest('v3/oauth/request', {
    method: 'POST',
    headers: {
      'X-Accept': 'application/json'
    },
    body
  });

  const jsonResponse = await response.json();

  return jsonResponse.code;
}

function redirectToAuthPage(requestToken) {
  window.location =
    `https://getpocket.com/auth/authorize?request_token=${requestToken}&redirect_uri=${encodeURIComponent(redirectUrl(requestToken))}`;
}

async function obtainAccessToken(requestToken) {
  const body = {
    code: requestToken
  };

  const response = await makeRequest('v3/oauth/authorize', {
    method:'POST',
    headers: {
      'X-Accept': 'application/json'
    },
    body
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