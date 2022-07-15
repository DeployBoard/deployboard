const validateBody = (req, res, next) => {
  // if no body is provided, return a 400
  if (!req.body) {
    return res.status(400).json({
      error: "Bad Request",
      description: "No body provided",
    });
  }

  // if the body does not have the required fields, return a 400
  const requiredFields = ["service", "environment", "version", "status"];
  requiredFields.forEach((field) => {
    if (!req.body[field]) {
      return res.status(400).json({
        error: "Bad Request",
        description: `Missing required field: ${field}`,
      });
    }
  });

  // if the validation passes, continue to the next middleware
  next();
};

export default validateBody;
