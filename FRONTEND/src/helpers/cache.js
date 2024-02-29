const cache = {};

export function saveToCache(key, data) {
  cache[key] = {
    data,
    timestamp: Date.now()
  };
}

export function getFromCache(key, maxAge) {
  const cacheData = cache[key];
  if (cacheData && cacheData.timestamp + maxAge > Date.now()) {
    return cacheData.data;
  }
  return null;
}
