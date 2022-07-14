import NodeCache from "node-cache";

const ttl = 1; // TTL in minutes (How long requests live in the cache)
const limit = 100; // Requests per TTL

const apiKeyRateCache = new NodeCache({
  stdTTL: 900, // The TTL of the Key in seconds, we clean the cach on every call, so this is is kinda redundant
  deleteOnExpire: true,
  checkperiod: 900,
});

const rateLimitApiKey = (req, res, next) => {
  // Get the key from the header
  const apiKey = req.headers["X-API-Key"] || req.headers["x-api-key"];
  // If no key is provided, return a 401
  if (!apiKey) {
    return res.status(401).json({
      error: "Unauthorized",
    });
  }

  // Get our array of requests from the cache
  let apiKeyArray = apiKeyRateCache.get(apiKey) || [];

  // Loop through the array and remove any requests that are older than the TTL
  const dateNow = new Date();
  apiKeyArray.map((request) => {
    if (request < dateNow - ttl * 60 * 1000) {
      apiKeyArray.splice(apiKeyArray.indexOf(request), 1);
    }
  });

  // Check if the length of our array is greater than the limit
  if (apiKeyArray.length > limit) {
    // If it is, return a 429 status code
    return res.status(429).json({
      error: "Too many requests",
    });
  }
  // Push the current request to the array
  apiKeyArray.push(new Date());
  // Set the new array of requests to the cache
  apiKeyRateCache.set(apiKey, apiKeyArray);

  // Continue to the next middleware
  next();
};

export default rateLimitApiKey;
