async function  actuallyLoadConfig() {
  if (process.env.CONSUMER_KEY) {
    return {consumerKey: process.env.CONSUMER_KEY } ;
  }

  const configUrl = new URL('/api/config', process.env.API_BASE_URI);
  const response = await fetch(configUrl.href);
  
  return response.json();
}

let configPromise = null;

export function getConfig() {
  if (!configPromise) {
    configPromise = actuallyLoadConfig();
  }

  return configPromise;
}