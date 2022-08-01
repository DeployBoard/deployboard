import jwt from "jsonwebtoken";
import gql from "graphql-tag";

// verify we have a token in the auth header
const verifyToken = (req, res, next) => {
  // console.log(req);
  // console.log(req.headers);
  // console.log(req.body.query);
  // console.log(req.body.variables);
  // const query = req.body.query;
  // const obj = gql`
  //   ${query}
  // `;
  // console.log(obj);
  // console.log("operation", obj.definitions[0].operation);
  // console.log(
  //   obj.definitions[0].selectionSet.selections[0].arguments[0].name.value
  // );
  // console.log(
  //   obj.definitions[0].selectionSet.selections[0].arguments[0].value.name
  // );
  // console.log(obj.definitions[0].variableDefinitions[0].variable.name.value);
  // console.log("selectionSet", obj.definitions[0].selectionSet);

  const authToken = req.headers.authorization;
  console.log(authToken);
  if (!authToken) {
    return res.status(401).json({
      message: "You are not authorized to access this resource",
    });
  }
  // split the token from the Bearer string
  const token = authToken.split(" ")[1];
  // verify token is valid
  const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  console.log(decodedToken);
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

// look at the request body and verify there is a filter
const verifyFilter = (req, res, next) => {
  const filter = req.body.query.filter;
  if (!filter) {
    return res.status(400).json({
      message: "You must provide a filter",
    });
  }
  next();
};
// verify the account in the filter matches the account in the token
// verify the role in the filter is allowed to make this type of request
// make the query
// verify the query results only contain data from the account in the token
// verify the query results do not contain any sensitive data (like passwords)
// return the result of the query

const isAuth = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token || token === "") {
    req.isAuth = false;
    return next();
  }
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (err) {
    req.isAuth = false;
    return next();
  }
  req.isAuth = true;
  req.appRoles = decodedToken.role;
  req.userId = decodedToken.email;
  next();
};

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log(authHeader);
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    console.log(user);
    next();
  });
};

const authMiddleware = async (resolve, source, args, context, info) => {
  if (somehowCheckAuthInContext(context)) {
    return resolve(source, args, context, info);
  }
  throw new Error("You must be authorized");
};

export { isAuth, authenticateToken, authMiddleware, verifyToken, verifyFilter };
