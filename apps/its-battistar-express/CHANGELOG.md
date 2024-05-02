# Changelog

This file was generated using
[@jscutlery/semver](https://github.com/jscutlery/semver).

## [1.0.0](https://github.com/gipo355/its-battistar/compare/its-battistar-express-0.1.0...its-battistar-express-1.0.0) (2024-05-02)

### ⚠ BREAKING CHANGES

- **its-battistar-angular:** created new lib

### Features

- **its-battistar-express:** :sparkles: add github oauth
  ([81c5a5b](https://github.com/gipo355/its-battistar/commit/81c5a5b8508693004a3274b3b48beaa46258fbcb)),
  closes [#59](https://github.com/gipo355/its-battistar/issues/59)
  [#61](https://github.com/gipo355/its-battistar/issues/61)
  [#62](https://github.com/gipo355/its-battistar/issues/62)
  [#63](https://github.com/gipo355/its-battistar/issues/63)
- **its-battistar-express:** :sparkles: implement hashing functions with argon
  ([d0af1c7](https://github.com/gipo355/its-battistar/commit/d0af1c7c51bcf05ef574418fcf592d8ede1b76a8))
- **its-battistar-express:** :sparkles: implement local strat signup and login
  ([00c1b97](https://github.com/gipo355/its-battistar/commit/00c1b97fcbb7552ce047dfd520734a9c2b76886c))
- **its-battistar-express:** :sparkles: improving local strat with redis
  ([3208d95](https://github.com/gipo355/its-battistar/commit/3208d95d2d042f12c2f0877f7502c7b79ad75c89))
- **its-battistar-express:** :sparkles: init github oauth2
  ([337f2ce](https://github.com/gipo355/its-battistar/commit/337f2ce8efc37e55ad868b3c12156096a815228b))
- **its-battistar-express:** :sparkles: local strat auth
  ([fdfcd92](https://github.com/gipo355/its-battistar/commit/fdfcd92b8cf2d12890e68cb866123a77f8a2f948))
- **its-battistar-express:** :sparkles: local strategy basis implemented
  ([7752f3a](https://github.com/gipo355/its-battistar/commit/7752f3a01ee04e917bfe2fc9a6afdda8b3a64cd0))
- **its-battistar-express:** :sparkles: prepare models for auth, users and
  accounts
  ([2402639](https://github.com/gipo355/its-battistar/commit/2402639ddf62ae7c75999a4a005a56f518373381))
- **its-battistar-express:** :sparkles: protect route middleware
  ([fe359c2](https://github.com/gipo355/its-battistar/commit/fe359c28889cecc89439a683b29b42fb277818a9))
- **its-battistar-express:** :sparkles: tentative init of local strat auth with
  refactor
  ([4e768d0](https://github.com/gipo355/its-battistar/commit/4e768d048e679d66a855d733c77fa23098b4c34f))

### Bug Fixes

- **its-battistar-angular:** :bug: fast-json-stringify was importing node only
  lib
  ([7214a00](https://github.com/gipo355/its-battistar/commit/7214a00e32730cdfca404b9e442919ce5111cf17)),
  closes [#69](https://github.com/gipo355/its-battistar/issues/69)
- **its-battistar-express:** :bug: fix verify argon fn
  ([daa5051](https://github.com/gipo355/its-battistar/commit/daa50515651e522957da7b29a1a03c19e185c9f0))

## 0.1.0 (2024-4-28)

### Features

- **its-battistar-angular:** :sparkles: add create
  ([7ddacef](https://github.com/gipo355/its-battistar/commit/7ddacef34f04c1988f5c5749fb3bd693c19df361))
- **its-battistar-angular:** :sparkles: make the first http call, add CORS to
  express
  ([ec804b1](https://github.com/gipo355/its-battistar/commit/ec804b169529a6510145a61f20e3a73fd50e20a7))
- **its-battistar-angular:** :sparkles: toggle completion with backend works
  ([919f96e](https://github.com/gipo355/its-battistar/commit/919f96e3e1ff317b263e77311e4d97d662643f86))
- **its-battistar-angular:** :sparkles: update and load from be works
  ([e5d4a06](https://github.com/gipo355/its-battistar/commit/e5d4a0629ee5e73fc2cbb85c149e8ac61c73b8f8))

## 0.0.1 (2024-04-28)

## 0.0.1 (2024-04-28)

## [2.0.0](https://github.com/gipo355/its-battistar/compare/its-battistar-be-1.1.0...its-battistar-be-2.0.0) (2024-4-24)

### ⚠ BREAKING CHANGES

- **global:** Old eslint doesn't work anymore, changed all linter configs
- **its-battistar-be:** remove /check endpoint

### Features

- **global:** :sparkles: move to eslint flat config
  ([24bb155](https://github.com/gipo355/its-battistar/commit/24bb155ff0abb41ef87006f6f58b317a2a92e305))
- **its-battistar-be:** :sparkles: add auth routes
  ([382de64](https://github.com/gipo355/its-battistar/commit/382de64875573f80f35d650fea10bdfefd190678))
- **its-battistar-be:** :sparkles: add http files for testing
  ([4798542](https://github.com/gipo355/its-battistar/commit/4798542872e4dd118b3f3ad0a93a93d2d4750cd4))
- **its-battistar-be:** :sparkles: add update todo, remove check
  ([4becd61](https://github.com/gipo355/its-battistar/commit/4becd616817b5049c2495c09af516c0244a00491))
- **its-battistar-be:** :sparkles: add users routes
  ([e587a3a](https://github.com/gipo355/its-battistar/commit/e587a3a6456bb71722e7e096ef58f930b499bec4))
- **its-battistar-be:** :sparkles: create auth routes, create auth base
  middleware
  ([782e5bc](https://github.com/gipo355/its-battistar/commit/782e5bc2bc7ad335620c0b4247511630ac9f3d04))
- **its-battistar-be:** :sparkles: create docs for auth routes OPENAI
  ([3defc54](https://github.com/gipo355/its-battistar/commit/3defc540a12f5a96e16c045ee55638e17a2746fd))
- **its-battistar-be:** :sparkles: prepare google callback handler for notes
  ([293f545](https://github.com/gipo355/its-battistar/commit/293f5458520413b76d0e0103fe0e636fce1e4e1c))

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
