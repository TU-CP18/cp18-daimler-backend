# Log Collector

Low overhead nodejs microservice to collect driver and vehicle logs, shipped to logstash via socket.

## Starting the process

`npm run-script dev` or `yarn dev` kicks off the process and exposes `POST /api/log`. For production, use `docker build` with the provided `Dockerfile`.

## Environment variables

Env is configured with `dotenv` package and it expects a `.env` file to be created on the package root, an example has been provided in the file `env-example` 

The production default env values are specified in `Dockerfile` and can be overriden during `docker run`.

## Tests

Jest is used for running test suites. `yarn test` will run the tests, placed in `__tests__` directory.
