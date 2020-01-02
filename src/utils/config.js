async function  actuallyLoadConfig() {
  if (process.env.REACT_APP_API_CONSUMER_KEY) {
    return {consumerKey: process.env.REACT_APP_API_CONSUMER_KEY } ;
  }

  const response = await fetch('/config');
  return response.json();
}

let configPromise = null;

export function getConfig() {
  if (!configPromise) {
    configPromise = actuallyLoadConfig();
  }

  return configPromise;
}