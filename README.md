## Installation

1. Update the environment properties in both the project-level (`./.env`) file, and the environment-level (`.config/.env*`) files to match your requirements.
2. Copy `.config/.env.example` into  `.config/.env.local`  (the `.env.local` is git-ignored, so this is required even if step-1 was previously done)
3. Navigate into the app directory and run `npm install`.  This only needs to be done when you are first initializing the project due to a 'chicken-egg-problem` with the docker-volumes.

```bash
$ vi .env # <-- edit as required
$ vi .config/.env.example # <-- edit as required
$ cp .config/.env.example .config/.env.local
$ cd app && npm install
```

## Running with docker

All `make` commands are run from the project-root.

```bash
# development
$ make local-development

# production
$ make local-production

# shell into application container
$ make development-workspace

# shell into database container
$ make development-database

# close the local-development containers
$ make close-local-development
```

## Running with local machine

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Testing

```bash
# all tests
$ npm run test

# unit tests
$ npm run test:unit

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Swagger

This API self-documents and exposes a swagger-utility page at `http://localhost:4000/api` when built locally.  This is disabled for production builds to not expose the internal functionality publicly

## Docs

[NestJS](https://docs.nestjs.com).
