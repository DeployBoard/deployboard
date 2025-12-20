<p align="center">
  <a href="https://www.deployboard.io"><img src="https://user-images.githubusercontent.com/7454248/108596582-f253f380-7353-11eb-838d-18f44478a67a.png" alt="DeployBoard"></a>
</p>
<p align="center">
  Measure the success of DevOps in your organization.
</p>

---

## Features

- Simple deployment tracking tool.
- Easily plugs in to any deployment tool or pipeline.
- Tracks DORA metrics, compliance, and more.

See the full set of <a href="https://docs.deployboard.io/features/" class="external-link" target="_blank">Features</a>.

## Documentation

Docs are available at <a href="https://docs.deployboard.io/" class="external-link" target="_blank">docs.deployboard.io</a>.

## Contributing

There are many ways to contribute.

Please see the guide to <a href="https://docs.deployboard.io/contributing/" class="external-link" target="_blank">Contributing</a> on our docs.

You can also <a href="https://docs.deployboard.io/help-deployboard/" class="external-link" target="_blank">Help DeployBoard</a> in other ways, without requiring any coding.

---

## Local Development

#### Clone and Run

```
git clone https://github.com/Deployboard/deployboard.git
cd deployboard
```

#### Database

You will need to start a mongo database for the app first.

```
npm run mongo
```

#### Run the app

```
npm install
npm run dev
```

App will be available on `http://localhost:3000`

#### Seed

We provide a seed script that will drop the database and generate new random data to explore and test the app locally.

```
npm run seed
```

After running the seed script you should be able to log in with the default credentails: 

## Build And Deploy

### Build
We build, tag, and push the docker image to docker hub.

```
# Build the dockerfile locally
docker build -f Dockerfile -t deployboard .

# Tag the local docker image with our docker hub image name
docker tag deployboard:latest deployboard/deployboard-api:latest

# Push the local image up to docker hub.
docker push deployboard/deployboard-api:latest
```

The docker image by default will run the full stack, but you can pass in a flag to specify what service you want to run.

### Deploy

We deploy using fly.io. We have preconfigured config files to deploy each service.

```
flyctl deploy --config fly.io/api.toml
flyctl deploy --config fly.io/auth.toml
flyctl deploy --config fly.io/deploy.toml
```
