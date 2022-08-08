# TODO

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
