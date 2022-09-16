# Configuration

You can customize the configuration using environment variables, this way you don't have to manage a configuration file, and you are not committing any potential secrets into source code.

Some configuration such as the SAML config for SSO is stored in the database, so you will first need to set up DeployBoard, log in, then configure SSO in the admin section.

!!! Note

    In development, DeployBoard uses [dotenv](https://www.npmjs.com/package/dotenv) to load configuration from a `.env` file. You can create a .env file at the root of each app in the `/apps` directory, but it is recommended to just use the environment variables.

## Core

| Key                  | Description                                                           | Default                         | Type   | Required |
| -------------------- | --------------------------------------------------------------------- | ------------------------------- | ------ | -------- |
| ACCESS_TOKEN_SECRET  | Used when signing the access token.                                   | None                            | string | No       |
| REFRESH_TOKEN_SECRET | Used when signing the refresh token.                                  | None                            | string | No       |
| REACT_APP_API_URI    | URI of the api, specifically used for the react frontend.             | http://localhost:3001           | string | No       |
| REACT_APP_AUTH_URI   | URI of the auth server, specifically used for the react frontend app. | http://localhost:3002           | string | No       |
| WEB_URI              | URI of the www marketing site.                                        | None                            | string | No       |
| APP_URI              | URI of the react web app.                                             | http://localhost:3000           | string | No       |
| API_URI              | URI of the api server.                                                | http://localhost:3001           | string | No       |
| AUTH_URI             | URI of the auth server.                                               | http://localhost:3002           | string | No       |
| DEPLOY_URI           | URI of the deploy server.                                             | http://localhost:3003           | string | No       |
| SMTP_HOST            | Host address of your SMTP server.                                     | None                            | string | No       |
| SMTP_PORT            | Port of your SMTP server.                                             | None                            | string | No       |
| SMTP_USER            | SMTP server username.                                                 | None                            | string | No       |
| SMTP_PASS            | Password for your SMTP user.                                          | None                            | string | No       |
| LOG_LEVEL            | Log level.                                                            | debug                           | string | No       |
| MONGO_URI            | The full path to the mongo db.                                        | mongodb://localhost/deployboard | string | No       |
