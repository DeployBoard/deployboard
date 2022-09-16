# Security

Protecting user data is the number one priority for us.

We take a number of measures to ensure data can not be accessed by anyone outside your organization.

## Auth

The authentication workflow looks like this:

### Local Auth

1. Post the email and password to the login route on the auth server.
2. Auth server uses `express-mongo-sanitize` package to protect against [query selector injection attacks](https://blog.websecurify.com/2014/08/hacking-nodejs-and-mongodb.html).
   > `express-mongo-sanitize` is used all over the api.
3. Auth server verifies a valid email address in the database.
4. Check to see if the user is enabled.
5. Check to see if it is locked, or had too many attempts within the allowed time limit as defined in our mongoose user model.
6. Then we check to verify the password provided matches the hashed password in the database.
7. Generate a JWT and return back to user.

### SSO Auth

1. Post the email to the login/sso route on the auth server.
2. Auth server uses `express-mongo-sanitize` package to protect against [query selector injection attacks](https://blog.websecurify.com/2014/08/hacking-nodejs-and-mongodb.html).
   > `express-mongo-sanitize` is used all over the api.
3. Auth server plucks out the domain from the email address provided.
4. Query the database for the account that matches that email domain.
5. Get the SSO type from the account config.
6. Get the SSO config
7. Generate a proper request to the target provider and send the request to the provider.
8. The SSO provider will validate the user, and respond to the auth server callback url.
9. The callback url will:  
   a. Decode and validate the response.  
   b. Get the group membership of the user (if provided).  
   c. Associate the user to a Role within DeployBoard based on their group membership.
10. Generate a JWT and return back to the user.

## API

When making a request to an api endpoint, you must pass your JWT in the `Authorization` header in the format of `Bearer <token>`

The api server will:

1. Verify the token is valid and generated from DeployBoard.
2. Decode the token.  
   a. Get the user's role from the token.  
   b. Get the account name from the token.
   > We never use the "account" field from a user controlled input of any type.
3. Verify the user's role is able to perform this action.
4. The API endpoints use `express-mongo-sanitize` on all input fields to protect against [query selector injection attacks](https://blog.websecurify.com/2014/08/hacking-nodejs-and-mongodb.html).  
   a. We also rely on mongoose types and inbuilt validators to ensure you can not pass unexpected data.
5. Query is made to the database.
6. The response is put through another middleware that loops over every item returned from the query to verify all of the data returned contains only the requested user's account.

## Rate Limit

The API has some rate limiting built-in to protect against abuse.

## UI Roles

We use the Role in the user's token to verify they are able to access certain parts of the UI.

Even if a user was able to fake their role in some way, the call to the backend would fail because their token does not contain the required role.

The web/ui server will:

1. Decode the token returned from the auth server to get the user's role.
2. Various parts of the web frontend will only be available if you have a specific role. For example:  
   a. Users and Editors will not see the Account Admin pages in the UI.  
   b. Users will not see any Add/Remove/Edit buttons in the UI.

## Concerns / Suggestions

If you have any security concerns or suggestions on how we can improve our security posture, please email us at [support@deployboard.io](mailto:support@deployboard.io) and we will address them as quickly as possible.
