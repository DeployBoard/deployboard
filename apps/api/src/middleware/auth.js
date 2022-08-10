import jwt from "jsonwebtoken";
import log from "loglevel";

// TODO: set the log level from environment variable
// log.setLevel(process.env.LOG_LEVEL);
log.setLevel("trace");

// verify we have a token in the auth header
const verifyToken = (req, res, next) => {
  const authToken = req.headers.authorization;
  // console.log(authToken);
  if (!authToken) {
    return res.status(401).json({
      message: "You are not authorized to access this resource",
    });
  }
  // split the token from the Bearer string
  const token = authToken.split(" ")[1];
  // verify token is valid
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (err) {
    log.info(`${err.name}: ${err.message}`);
    return res.status(401).json({
      message: "Session expired. Please login again.",
    });
  }
  // console.log(decodedToken);
  // if not valid, return 401
  if (!decodedToken) {
    return res.status(401).json({
      message: "You are not authorized to access this resource",
    });
  }
  // verify token is not expired
  const currentTime = Date.now() / 1000;
  if (decodedToken.exp < currentTime) {
    return res.status(401).json({
      message: "You are not authorized to access this resource",
    });
  }
  // extract email, account, and role from the token
  const { email, account, role } = decodedToken;
  // add email, account, and role to the request object
  req.token = token;
  req.email = email;
  req.account = account;
  req.role = role;
  // continue with the request
  next();
};

// verify the role of the user is authorized to access the resource
const verifyRole = (roles, role) => {
  log.debug(`verifyRole: verifying if ${role} is in ${roles}`);
  // if role array does not include req.role, return 401
  if (roles.includes(role)) {
    log.debug(`verifyRole: ${role} is in ${roles}`);
    return true;
  } else {
    log.debug(`verifyRole: ${role} not in ${roles}`);
    return false;
  }
};

export { verifyToken, verifyRole };
