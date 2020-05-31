let apiBaseUrl = process.env.API_BASE_URI || `${window.location.origin}/api`;

if (!apiBaseUrl.endsWith('/')) {
  apiBaseUrl += '/';
}

export default {
  consumerKey: process.env.CONSUMER_KEY,
  apiBaseUrl,
  useCorsProxy: !!process.env.USE_CORS_PROXY || false
};