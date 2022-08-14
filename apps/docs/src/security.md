# Security

Protecting user data is the number one priority for us.

We take a number of measures to ensure data can not be accessed by anyone outside your organization.

## Auth

The authentication workflow looks like this:

1. Post to the login route on the auth server.
2. Auth server uses `express-mongo-sanitize` package to protect against [query selector injection attacks](https://blog.websecurify.com/2014/08/hacking-nodejs-and-mongodb.html).
   a. `express-mongo-sanitize` is used all over the api.
3. Auth server verifies a valid email address first.
4. If we found a valid email address, we hit a fork scenario:
5. If the account uses SAML, we delegate to the SAML provider.
6. If we are using local auth, we perform the following steps:
   a. Check to see if the user is enabled.
   b. Check to see if it is locked, or had too many attempts within the allowed time limit as defined in our mongoose user model.
   c. Then we check to verify the password provided matches the hashed password in the databse.
7. After the user is verified by local auth or by SAML, we generate a JWT and return back to user.

## API

When making a request to an api endpoint, you must pass your JWT in the `authorization` header.

The api server will:

1. Verify the token is valid.
2. Decode the token.
   a. Get the account name from the token.
   b. Get the user's role from the token.
3. If the user explicitly passed "account" in the query we will deny this request. The express api middleware gets the account from the user in the DB, and we inject that into the query, so there is no need for the frontend to excplicitly pass the account. If you do this, we assume you are attempting to do something malicious.
4. Verify the user's role is able to perform this action.
5. The API endpoints use `express-mongo-sanitize` on all input fields to protect against [query selector injection attacks](https://blog.websecurify.com/2014/08/hacking-nodejs-and-mongodb.html).
   a. We also rely on mongoose types and inbuilt validators to ensure you can not pass unexpected data.
6. Query is made to the database.
7. The response is put through another middleware that loops over every item returned from the query to verify all of the data returned contains only the requested user's account.

## Rate Limit

The API has some rate limiting built-in to protect against abuse.

## Concerns / Suggestions

If you have any security concerns or suggestions on how we can improve our security posture, please email us at [support@deployboard.io](mailto:support@deployboard.io) and we will address them as quickly as possible.
