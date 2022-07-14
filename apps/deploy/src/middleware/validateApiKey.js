import { ApiKey } from "models";

const validateApiKey = (req, res, next) => {
  // Get the key from the header
  const apiKey = req.headers["X-API-Key"] || req.headers["x-api-key"];
  // If no key is provided, return a 401
  if (!apiKey) {
    return res.status(401).json({
      error: "Unauthorized",
    });
  }
  // Find the key in the db
  ApiKey.findOne({ key: apiKey })
    .then((apiKeyObject) => {
      // if the key is not found, return a 401
      if (!apiKeyObject) {
        return res.status(401).json({
          error: "Unauthorized",
        });
      }
      // if the key does not have the correct role, return a 401
      if (
        !apiKeyObject.role.includes("Editor") &&
        !apiKeyObject.role.includes("Admin")
      ) {
        return res.status(401).json({
          error: "Unauthorized",
        });
      }
      // if the key is not enabled, return a 401
      if (!apiKeyObject.enabled) {
        return res.status(401).json({
          error: "Unauthorized",
        });
      }
      // If the key is found, add it to the request object
      req.apiKeyObject = apiKeyObject;
      // Continue to the next middleware
      next();
    })
    .catch((e) => {
      // Log error.
      console.log("ApiKey.findOne error:", e);
      // If the key is not found, return a 401
      return res.status(500).json({
        error: "Internal Server Error",
      });
    });
};

export default validateApiKey;
