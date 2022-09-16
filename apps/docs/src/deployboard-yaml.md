# deployboard.yaml

COMING SOON

## File

DeployBoard can manage dependencies and automatically build a service network map all from a yaml file in each git repository.

An example file might look like this.

TODO: What about multiple applications/services in the same repo?

```
name: my-example-service
domain:
  - name: example.com
  - paths:
      - /test
      - /v2/test
  - methods:
      - GET
      - PUT
      - POST
      - OPTIONS
depends:
  - service1
  - service2
  - service4
  - service12
  - api.dropboxapi.com
```

Admin -> Checkout -> Card
-> Thing2
