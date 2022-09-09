import log from "loglevel";

// TODO: set the log level from environment variable
// log.setLevel(process.env.LOG_LEVEL);
log.setLevel("debug");

// verify the response only contains data from the account in the token
const validateResponse = (req, res) => {
  log.debug(res.locals);

  // add the verified header to the response to prove it has been run through this middleware.
  res.set("X-Verified", true);

  // if there is no request, return an error
  if (!req) {
    log.error("No request found");
    return res.status(400).json({
      error: "Malformed request",
    });
  }
  // if there is no account in the request, return an error
  if (!req.account) {
    log.error("No account found in request");
    return res.status(500).json({
      error: "Internal server error",
    });
  }

  // if there is no response, return an error
  if (!res.locals) {
    log.error("No response found");
    // return 500 unexpected error
    return res.status(500).json({
      error: "Internal server error",
    });
  }
  // if there is no status in the response, return an error
  if (!res.locals.status) {
    log.error("No status found in response");
    return res.status(500).json({
      error: "Internal server error",
    });
  }
  // if there is no data in the response, return an error
  if (!res.locals.body) {
    log.error("No data found in response");
    return res.status(500).json({
      error: "Internal server error",
    });
  }

  // now that we have verified we have a response, we can check the data
  const { status, body } = res.locals;

  // if the data is an object, check the account key is the same as the token account
  if (typeof data === "object") {
    // verify the account key is the same as the token account
    if (body.account !== req.account) {
      log.error(
        `Account key in response: ${body.account} does not match token account: ${req.account}`
      );
      return res.status(500).json({
        error: "Internal server error",
      });
    }
    // verify there is no password key in the data
    if (body.password) {
      log.error("Password key found in response");
      return res.status(500).json({
        error: "Internal server error",
      });
    }
    // verify there is no salt key in the data
    if (body.salt) {
      log.error("Salt key found in response");
      return res.status(500).json({
        error: "Internal server error",
      });
    }
  }
  // if the data is an array, check the account key is the same as the token account
  if (Array.isArray(body)) {
    body.forEach((item) => {
      // verify the account key is the same as the token account
      if (item.account !== req.account) {
        log.error(
          `Account key in response: ${item.account} does not match token account: ${req.account}`
        );
        return res.status(500).json({
          error: "Internal server error",
        });
      }
      // verify there is no password key in the data
      if (item.password) {
        log.error("Password key found in response");
        return res.status(500).json({
          error: "Internal server error",
        });
      }
      // verify there is no salt key in the data
      if (item.salt) {
        log.error("Salt key found in response");
        return res.status(500).json({
          error: "Internal server error",
        });
      }
    });
  }

  return res.status(status).json(body);
};

module.exports = {
  validateResponse,
};
