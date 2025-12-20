import log from "loglevel";
import { ApiKey } from "models";

log.setLevel("debug");

const validateApiKey = async (req, res, next) => {
  log.debug("Checking API key");
  // Get the key from the header
  const apiKey = req.headers["X-API-Key"] || req.headers["x-api-key"];
  // If no key is provided, return a 401
  if (!apiKey) {
    log.debug("No API key provided");
    return res.status(401).json({
      error: "Unauthorized",
    });
  }
  
  try {
    // Find the key in the db
    log.debug("Finding API key from DB");
    const apiKeyObject = await ApiKey.findOne({ _id: apiKey });
    
    // if the key is not found, return a 401
    if (!apiKeyObject) {
      log.debug("API key not found");
      return res.status(401).json({
        error: "Unauthorized",
      });
    }
    // if the key does not have the correct role, return a 401
    if (!apiKeyObject.role.includes("Deploy")) {
      log.debug("API key does not have correct role");
      return res.status(401).json({
        error: "Unauthorized",
      });
    }
    // if the key is not enabled, return a 401
    if (!apiKeyObject.enabled) {
      log.debug("API key is not enabled");
      return res.status(401).json({
        error: "Unauthorized",
      });
    }
    // If the key is found, add it to the request object
    req.apiKeyObject = apiKeyObject;
    // Continue to the next middleware
    log.debug("Passed API key check");
    next();
  } catch (e) {
    // Log error.
    console.log("ApiKey.findOne error:", e);
    // If the key is not found, return a 401
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

export default validateApiKey;
