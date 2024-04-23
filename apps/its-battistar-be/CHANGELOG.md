# Changelog

This file was generated using
[@jscutlery/semver](https://github.com/jscutlery/semver).

## 1.0.0 (2024-4-23)

### ⚠ BREAKING CHANGES

- **global:** Old eslint doesn't work anymore, changed all linter configs
- **its-battistar-be:** remove /check endpoint
- **its-battistar-be:** UPDATE DOCKER COMPOSE

### Features

- **global:** :sparkles: move to eslint flat config
  ([24bb155](https://github.com/gipo355/its-battistar/commit/24bb155ff0abb41ef87006f6f58b317a2a92e305))
- **its-battistar-be:** :sparkles: add auth routes
  ([382de64](https://github.com/gipo355/its-battistar/commit/382de64875573f80f35d650fea10bdfefd190678))
- **its-battistar-be:** :sparkles: add catchAsync
  ([0d657cc](https://github.com/gipo355/its-battistar/commit/0d657cc0d1aeb476a7b9583f3e621e47e0ea8f46))
- **its-battistar-be:** :sparkles: add cookie parser
  ([78b004f](https://github.com/gipo355/its-battistar/commit/78b004fc49943e7ff85ed237d9e284885bd02b89))
- **its-battistar-be:** :sparkles: add first todos structure
  ([e018a29](https://github.com/gipo355/its-battistar/commit/e018a2919fb6e89161b9b0c60debd118886f758c))
- **its-battistar-be:** :sparkles: add grafana loki logger to pino multistream
  ([c66bee6](https://github.com/gipo355/its-battistar/commit/c66bee61a53bcbad9a44a10259555c20f411deaa))
- **its-battistar-be:** :sparkles: add grafana-loki log to docker-compose
  ([f5c7e50](https://github.com/gipo355/its-battistar/commit/f5c7e507aba508661284afdf7bd4fa542ed8a8b1))
- **its-battistar-be:** :sparkles: add http files for testing
  ([4798542](https://github.com/gipo355/its-battistar/commit/4798542872e4dd118b3f3ad0a93a93d2d4750cd4))
- **its-battistar-be:** :sparkles: add swagger docs in dev
  ([4561344](https://github.com/gipo355/its-battistar/commit/45613443b24b67c1a646418dcdf6dccac75e5db5))
- **its-battistar-be:** :sparkles: add update todo, remove check
  ([4becd61](https://github.com/gipo355/its-battistar/commit/4becd616817b5049c2495c09af516c0244a00491))
- **its-battistar-be:** :sparkles: add users routes
  ([e587a3a](https://github.com/gipo355/its-battistar/commit/e587a3a6456bb71722e7e096ef58f930b499bec4))
- **its-battistar-be:** :sparkles: create auth routes, create auth base
  middleware
  ([782e5bc](https://github.com/gipo355/its-battistar/commit/782e5bc2bc7ad335620c0b4247511630ac9f3d04))
- **its-battistar-be:** :sparkles: create docs for auth routes OPENAI
  ([3defc54](https://github.com/gipo355/its-battistar/commit/3defc540a12f5a96e16c045ee55638e17a2746fd))
- **its-battistar-be:** :sparkles: get todos work
  ([00ab669](https://github.com/gipo355/its-battistar/commit/00ab669f58fc1ff2b42eeb2f4d0385d5aaa487e8))
- **its-battistar-be:** :sparkles: prepare check endpoints
  ([0eb90bc](https://github.com/gipo355/its-battistar/commit/0eb90bc2ee8773a8de239b365e87a036c15f475a))
- **its-battistar-be:** :sparkles: prepare global environment and secrets setup
  ([329f778](https://github.com/gipo355/its-battistar/commit/329f77801a20472416fa0ec3704d30a9211b2377))
- **its-battistar-be:** :sparkles: prepare google callback handler for notes
  ([293f545](https://github.com/gipo355/its-battistar/commit/293f5458520413b76d0e0103fe0e636fce1e4e1c))
- **its-battistar-be:** :sparkles: redis and mongo state health
  ([9fabeef](https://github.com/gipo355/its-battistar/commit/9fabeefa479339a88714f7d1520cbccb47a8c9c2))

### Bug Fixes

- **its-battistar-be:** :bug: fIX errors catching bypass, wrong error handler
  position
  ([4c46d7f](https://github.com/gipo355/its-battistar/commit/4c46d7fc0866a9d751612b3a83457909f5fc87d6))
- **its-battistar-be:** :bug: pino pretty http logger, rate limiter log moved
  ([f586b67](https://github.com/gipo355/its-battistar/commit/f586b67ea571aa8c3aa8255d8fffa23c9b360b2f))

## [1.1.0](https://github.com/gipo355/its-battistar/compare/its-battistar-be-1.0.1...its-battistar-be-1.1.0) (2024-4-21)

### Features

- **its-battistar-be:** :sparkles: add first todos structure
  ([e018a29](https://github.com/gipo355/its-battistar/commit/e018a2919fb6e89161b9b0c60debd118886f758c))
- **its-battistar-be:** :sparkles: get todos work
  ([00ab669](https://github.com/gipo355/its-battistar/commit/00ab669f58fc1ff2b42eeb2f4d0385d5aaa487e8))
- **its-battistar-be:** :sparkles: prepare check endpoints
  ([0eb90bc](https://github.com/gipo355/its-battistar/commit/0eb90bc2ee8773a8de239b365e87a036c15f475a))
- **its-battistar-be:** :sparkles: redis and mongo state health
  ([9fabeef](https://github.com/gipo355/its-battistar/commit/9fabeefa479339a88714f7d1520cbccb47a8c9c2))

### Bug Fixes

- **its-battistar-be:** :bug: fIX errors catching bypass, wrong error handler
  position
  ([4c46d7f](https://github.com/gipo355/its-battistar/commit/4c46d7fc0866a9d751612b3a83457909f5fc87d6))

## [1.0.1](https://github.com/gipo355/its-battistar/compare/its-battistar-be-1.0.0...its-battistar-be-1.0.1) (2024-4-20)

### Bug Fixes

- **its-battistar-be:** :bug: pino pretty http logger, rate limiter log moved
  ([f586b67](https://github.com/gipo355/its-battistar/commit/f586b67ea571aa8c3aa8255d8fffa23c9b360b2f))

## [1.0.1](https://github.com/gipo355/its-battistar/compare/its-battistar-be-1.0.0...its-battistar-be-1.0.1) (2024-4-20)

### Bug Fixes

- **its-battistar-be:** :bug: pino pretty http logger, rate limiter log moved
  ([f586b67](https://github.com/gipo355/its-battistar/commit/f586b67ea571aa8c3aa8255d8fffa23c9b360b2f))

## [1.0.0](https://github.com/gipo355/its-battistar/compare/its-battistar-be-0.0.1...its-battistar-be-1.0.0) (2024-4-20)

### ⚠ BREAKING CHANGES

- **its-battistar-be:** UPDATE DOCKER COMPOSE

### Features

- **its-battistar-be:** :sparkles: add catchAsync
  ([0d657cc](https://github.com/gipo355/its-battistar/commit/0d657cc0d1aeb476a7b9583f3e621e47e0ea8f46))
- **its-battistar-be:** :sparkles: add cookie parser
  ([78b004f](https://github.com/gipo355/its-battistar/commit/78b004fc49943e7ff85ed237d9e284885bd02b89))
- **its-battistar-be:** :sparkles: add grafana loki logger to pino multistream
  ([c66bee6](https://github.com/gipo355/its-battistar/commit/c66bee61a53bcbad9a44a10259555c20f411deaa))
- **its-battistar-be:** :sparkles: add grafana-loki log to docker-compose
  ([f5c7e50](https://github.com/gipo355/its-battistar/commit/f5c7e507aba508661284afdf7bd4fa542ed8a8b1))
- **its-battistar-be:** :sparkles: add swagger docs in dev
  ([4561344](https://github.com/gipo355/its-battistar/commit/45613443b24b67c1a646418dcdf6dccac75e5db5))
- **its-battistar-be:** :sparkles: prepare global environment and secrets setup
  ([329f778](https://github.com/gipo355/its-battistar/commit/329f77801a20472416fa0ec3704d30a9211b2377))

## 0.0.1 (2024-4-9)
