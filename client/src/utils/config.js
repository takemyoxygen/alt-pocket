async function  actuallyLoadConfig() {
  if (process.env.CONSUMER_KEY) {
    return {consumerKey: process.env.CONSUMER_KEY } ;
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