let apiBaseUrl = process.env.API_BASE_URI || `${window.location.origin}/api`;

if (!apiBaseUrl.endsWith('/')) {
  apiBaseUrl += '/';
}

const config = {
  consumerKey: process.env.CONSUMER_KEY,
  apiBaseUrl,
  useCorsProxy: !!process.env.USE_CORS_PROXY || false
};

if (process.env.NODE_ENV === 'development') {
  console.log('Config:', config);
}

export default config;