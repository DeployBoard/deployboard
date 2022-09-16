# Contributing

## Process

DeployBoard works on a [Fork & Pull](https://reflectoring.io/github-fork-and-pull/){:target="\_blank"} based system.

If you want to implement a new feature, or fix an existing bug, first search our [open issues](https://github.com/DeployBoard/deployboard/issues){:target="\_blank"} to see if an issue already exists.

If you find an existing issue, please first comment on the issue that you are going to work on. This helps reduce duplicated work.

If you do not find an existing issue, please [open a new issue](https://github.com/DeployBoard/deployboard/issues/new/choose){:target="\_blank"} filling out the provided issue templates before starting work.

## Development

Of course, you are free to use whatever editor and environment you like.

DeployBoard uses React for the frontend, NodeJS/Express for the backend api, and MongoDB as the database.

!!! Note

    The following commands are run from the project root.

### Volta

To ensure we all have the same development environment, we use [Volta](https://volta.sh/). We provide a `volta` config in the root `package.json` file that specifies the version of node and npm that we use for the entire project. See [Volta's Installation](https://docs.volta.sh/guide/getting-started) guide to set that up.

!!! Note

    You are free to use any other manager, just ensure the versions match what is in the volta config.

Use Volta to install node and npm

```
# Install the specified versions of node and npm, and also install turbo.
volta install node npm turbo
```

### Turborepo

Notice we install `turbo` in the `volta install` command, this is because DeployBoard is a monorepo that uses [Turborepo](https://turborepo.org/) to manage the apps within the repo.

### NPM Install

From here we can simply run `npm install` to install all of the dependencies for all of the applications.

### Run Dev

If you notice the commands in the `package.json` actually run `turbo` mapped to commands in the `turbo.json` file. You can look in the `turbo.json` file if you are interested in what is happening.

```
npm run dev
```

The application should be running now at `localhost:3000`, but you still need to start and seed the database before you can log in.

### Start the DB

We use Docker to run a local copy of MongoDB, but we provide an npm script via npm to start it.

```
npm run mongo
```

!!! Note

    Since the database is started as a Docker container, if you want to stop Mongo, you will need to run a separate `docker stop mongo` command.

### Seed the DB

We also provide an npm script to seed the database with the seed user and some randomized sample data.

```
npm run seed
```

### Usage

Once you have the database seeded, you will be able to log in.

The usernames created as part of the seed script are:

- admin@seed.seed (role: Admin)
- editor@seed.seed (role: Editor)
- viewer@seed.seed (role: Viewer)

The password provided for all development users is the string `Password123`.

!!! Note

    Disabled users are also created for each role. The disabled users were created for testing access controls.

API Keys are also created, you can find them at `localhost:3000/account/apikeys`.

### Build the app

After testing in the Dev environment, we want to create a production ready build to verify everything still works.

```
# Build the app
npm run build

# Start the app from the built bundle
npm run start
```

Since the built app uses the same database, you don't need to restart the DB or re-run the seed script, the previous credentials should still work.

## Testing

TBD

## Docs

Docs are hosted via Docker, and can be started with an npm script like the Mongo database.

```
npm run docs
```

!!! Note

    Just like the MongoDB container, we will need to stop the Docs container separately with `docker stop docs`

## Committing

TODO: Set up a pre-commit library.
