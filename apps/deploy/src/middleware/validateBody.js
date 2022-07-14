const validateBody = (req, res, next) => {
  // if no body is provided, return a 400
  console.log(req.body);
  if (!req.body) {
    return res.status(400).json({
      error: "Bad Request",
      description: "No body provided",
    });
  }
  // if the body does not have the required fields, return a 400
  if (!req.body.service) {
    return res.status(400).json({
      error: "Bad Request",
      description: "No service provided",
    });
  }
  if (!req.body.environment) {
    return res.status(400).json({
      error: "Bad Request",
      description: "No environment provided",
    });
  }
  if (!req.body.version) {
    return res.status(400).json({
      error: "Bad Request",
      description: "No version provided",
    });
  }
  if (!req.body.status) {
    return res.status(400).json({
      error: "Bad Request",
      description: "No status provided",
    });
  }

  // if the validation passes, continue to the next middleware
  next();
};

export default validateBody;
