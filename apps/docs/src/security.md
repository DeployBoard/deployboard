# Security

Protecting user data is the number one priority for us.

We take a number of measures to ensure data can not be accessed by anyone outside your organization.

The authentication/authorization workflow looks like this

1. Post to the login route on the auth server.
2. Auth server verifies email/password or delegates auth to SAML.
3. After verified, generate a JWT and return back to user.

When making a request to the /graphql endpoint, you must pass your JWT in the `authorization` header.

The graphql server will

1. Verify the token is valid.
2. Decode the token
   a. Get the account name from the token.
   b. Get the user's role from the token.
3. If the user explicitly passed "account" in the query we will deny this request. The GraphQL backend server middleware gets the account from the user in the DB, and we inject that into the query, so there is no need for the frontend to excplicitly pass the account. If you do this, we assume you are attempting to do something malicious.
4. Verify the user's role is able to perform this action.
5. Middleware will inject our user's account into the mongodb query, so it is impossible to query or modify another account's data.
6. Make the query
7. Verify all of the data returned contains only the requested user's account data.
