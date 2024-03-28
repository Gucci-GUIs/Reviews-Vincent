const NodeCache = require('node-cache');

const cache = new NodeCache();

function cacheMiddleware(req, res, next) {
  const key = req.originalUrl;
  const cachedData = cache.get(key);

  if (cachedData) {
    // console.log('Data found in cache');
    return res.json(cachedData);
  }

  next();
}

module.exports = { cache, cacheMiddleware };
