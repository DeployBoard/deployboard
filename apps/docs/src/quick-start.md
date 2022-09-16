# Quick Start

## Usage

Getting started is as simple as sending a `POST` request using an API Key to the deploy endpoint.

A sample curl request would look like this

!!! Note

    You can get your API Key from the [API Keys](https://app.deployboard.io/account/apikeys) section of the UI.

```
curl --request POST \
  --url https://deploy.deployboard.io/deploy \
  --header 'Content-Type: application/json' \
  --header 'x-api-key: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' \
  --data '{
  "service": "Payment",
	"environment": "Development",
	"status": "Deployed",
	"version": "v0.0.0"
}'
```

In real usage, you would parameterize these variables, so your script is reusable.

```
DEPLOYBOARD_API_KEY="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
SERVICE="Payment"
ENVIRONMENT="Development"
VERSION="v0.0.0"
STATUS="Deploying"

DATA="{\"service\":\"${SERVICE}\",\"environment\":\"${ENVIRONMENT}\",\"version\":\"${VERSION}\",\"status\":\"${STATUS}\"}"

curl --request POST \
  --url https://deploy.deployboard.io/deploy \
  --header "Content-Type: application/json" \
  --header "x-api-key: ${DEPLOYBOARD_API_KEY}" \
  --data "${DATA}"
```
