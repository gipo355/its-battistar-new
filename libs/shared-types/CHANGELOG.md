# Changelog

This file was generated using
[@jscutlery/semver](https://github.com/jscutlery/semver).

## 1.0.0 (2024-05-02)

### ⚠ BREAKING CHANGES

- **its-battistar-angular:** created new lib
- **global:** Old eslint doesn't work anymore, changed all linter configs

### Features

- **global:** :sparkles: move to eslint flat config
  ([24bb155](https://github.com/gipo355/its-battistar/commit/24bb155ff0abb41ef87006f6f58b317a2a92e305))
- **its-battistar-be:** :sparkles: create auth routes, create auth base
  middleware
  ([782e5bc](https://github.com/gipo355/its-battistar/commit/782e5bc2bc7ad335620c0b4247511630ac9f3d04))
- **its-battistar-express:** :sparkles: add github oauth
  ([81c5a5b](https://github.com/gipo355/its-battistar/commit/81c5a5b8508693004a3274b3b48beaa46258fbcb)),
  closes [#59](https://github.com/gipo355/its-battistar/issues/59)
  [#61](https://github.com/gipo355/its-battistar/issues/61)
  [#62](https://github.com/gipo355/its-battistar/issues/62)
  [#63](https://github.com/gipo355/its-battistar/issues/63)
- **its-battistar-express:** :sparkles: init github oauth2
  ([337f2ce](https://github.com/gipo355/its-battistar/commit/337f2ce8efc37e55ad868b3c12156096a815228b))
- **its-battistar-express:** :sparkles: local strategy basis implemented
  ([7752f3a](https://github.com/gipo355/its-battistar/commit/7752f3a01ee04e917bfe2fc9a6afdda8b3a64cd0))
- **its-battistar-express:** :sparkles: prepare models for auth, users and
  accounts
  ([2402639](https://github.com/gipo355/its-battistar/commit/2402639ddf62ae7c75999a4a005a56f518373381))
- **its-battistar-express:** :sparkles: tentative init of local strat auth with
  refactor
  ([4e768d0](https://github.com/gipo355/its-battistar/commit/4e768d048e679d66a855d733c77fa23098b4c34f))
- **its-battistar:** :sparkles: add infos on todo-item closes
  [#39](https://github.com/gipo355/its-battistar/issues/39)
  ([1c90d24](https://github.com/gipo355/its-battistar/commit/1c90d24f8bc1cfb7ff59e5cf18c7b7e93c330bc2))
- **its-battistar:** :sparkles: show completed feature done
  ([6e2a285](https://github.com/gipo355/its-battistar/commit/6e2a28540b84c83d3f0a14151ff902cfc47e6633))
- **its-battistar:** :sparkles: style the header with user info, init creating
  stores, fix user type
  ([d4ee850](https://github.com/gipo355/its-battistar/commit/d4ee850f5f93b0218234a97a4d0434a66a122215))
- **its-battistar:** :sparkles: todo item colors render dynamically with signals
  ([0ded84b](https://github.com/gipo355/its-battistar/commit/0ded84b3e6b9679db6ca18930f1cd7848a054c29))
- **its-battistar:** :sparkles: todo item filter, sortby works, prerefactor
  filter state
  ([d205d45](https://github.com/gipo355/its-battistar/commit/d205d454a1f1b7e5edf8bd0b2967630f1a991e0d))
- **shared-types:** :sparkles: add description to todo entity
  ([f84bb03](https://github.com/gipo355/its-battistar/commit/f84bb03aae64a3542f76cc14edede0e22fa9bdae))

### Bug Fixes

- **its-battistar-angular:** :bug: fast-json-stringify was importing node only
  lib
  ([7214a00](https://github.com/gipo355/its-battistar/commit/7214a00e32730cdfca404b9e442919ce5111cf17)),
  closes [#69](https://github.com/gipo355/its-battistar/issues/69)
- **its-battistar:** :bug: fixes
  [#42](https://github.com/gipo355/its-battistar/issues/42)
  ([d034901](https://github.com/gipo355/its-battistar/commit/d03490158825d1427ce10e01ac4f4b8441103ed8))
- **shared-types:** :bug: fix lint staged config file name typo
  ([39a48ae](https://github.com/gipo355/its-battistar/commit/39a48aec4ff1c09f5081320b9f12398a2c934ae3))

## 1.0.0 (2024-04-28)

### ⚠ BREAKING CHANGES

- **global:** Old eslint doesn't work anymore, changed all linter configs

### Features

- **global:** :sparkles: move to eslint flat config
  ([24bb155](https://github.com/gipo355/its-battistar/commit/24bb155ff0abb41ef87006f6f58b317a2a92e305))
- **its-battistar-be:** :sparkles: create auth routes, create auth base
  middleware
  ([782e5bc](https://github.com/gipo355/its-battistar/commit/782e5bc2bc7ad335620c0b4247511630ac9f3d04))
- **its-battistar:** :sparkles: add infos on todo-item closes
  [#39](https://github.com/gipo355/its-battistar/issues/39)
  ([1c90d24](https://github.com/gipo355/its-battistar/commit/1c90d24f8bc1cfb7ff59e5cf18c7b7e93c330bc2))
- **its-battistar:** :sparkles: show completed feature done
  ([6e2a285](https://github.com/gipo355/its-battistar/commit/6e2a28540b84c83d3f0a14151ff902cfc47e6633))
- **its-battistar:** :sparkles: style the header with user info, init creating
  stores, fix user type
  ([d4ee850](https://github.com/gipo355/its-battistar/commit/d4ee850f5f93b0218234a97a4d0434a66a122215))
- **its-battistar:** :sparkles: todo item colors render dynamically with signals
  ([0ded84b](https://github.com/gipo355/its-battistar/commit/0ded84b3e6b9679db6ca18930f1cd7848a054c29))
- **its-battistar:** :sparkles: todo item filter, sortby works, prerefactor
  filter state
  ([d205d45](https://github.com/gipo355/its-battistar/commit/d205d454a1f1b7e5edf8bd0b2967630f1a991e0d))
- **shared-types:** :sparkles: add description to todo entity
  ([f84bb03](https://github.com/gipo355/its-battistar/commit/f84bb03aae64a3542f76cc14edede0e22fa9bdae))

### Bug Fixes

- **its-battistar:** :bug: fixes
  [#42](https://github.com/gipo355/its-battistar/issues/42)
  ([d034901](https://github.com/gipo355/its-battistar/commit/d03490158825d1427ce10e01ac4f4b8441103ed8))
- **shared-types:** :bug: fix lint staged config file name typo
  ([39a48ae](https://github.com/gipo355/its-battistar/commit/39a48aec4ff1c09f5081320b9f12398a2c934ae3))

## 1.0.0 (2024-04-28)

### ⚠ BREAKING CHANGES

- **global:** Old eslint doesn't work anymore, changed all linter configs

### Features

- **global:** :sparkles: move to eslint flat config
  ([24bb155](https://github.com/gipo355/its-battistar/commit/24bb155ff0abb41ef87006f6f58b317a2a92e305))
- **its-battistar-be:** :sparkles: create auth routes, create auth base
  middleware
  ([782e5bc](https://github.com/gipo355/its-battistar/commit/782e5bc2bc7ad335620c0b4247511630ac9f3d04))
- **its-battistar:** :sparkles: add infos on todo-item closes
  [#39](https://github.com/gipo355/its-battistar/issues/39)
  ([1c90d24](https://github.com/gipo355/its-battistar/commit/1c90d24f8bc1cfb7ff59e5cf18c7b7e93c330bc2))
- **its-battistar:** :sparkles: show completed feature done
  ([6e2a285](https://github.com/gipo355/its-battistar/commit/6e2a28540b84c83d3f0a14151ff902cfc47e6633))
- **its-battistar:** :sparkles: style the header with user info, init creating
  stores, fix user type
  ([d4ee850](https://github.com/gipo355/its-battistar/commit/d4ee850f5f93b0218234a97a4d0434a66a122215))
- **its-battistar:** :sparkles: todo item colors render dynamically with signals
  ([0ded84b](https://github.com/gipo355/its-battistar/commit/0ded84b3e6b9679db6ca18930f1cd7848a054c29))
- **its-battistar:** :sparkles: todo item filter, sortby works, prerefactor
  filter state
  ([d205d45](https://github.com/gipo355/its-battistar/commit/d205d454a1f1b7e5edf8bd0b2967630f1a991e0d))
- **shared-types:** :sparkles: add description to todo entity
  ([f84bb03](https://github.com/gipo355/its-battistar/commit/f84bb03aae64a3542f76cc14edede0e22fa9bdae))

### Bug Fixes

- **its-battistar:** :bug: fixes
  [#42](https://github.com/gipo355/its-battistar/issues/42)
  ([d034901](https://github.com/gipo355/its-battistar/commit/d03490158825d1427ce10e01ac4f4b8441103ed8))
- **shared-types:** :bug: fix lint staged config file name typo
  ([39a48ae](https://github.com/gipo355/its-battistar/commit/39a48aec4ff1c09f5081320b9f12398a2c934ae3))

## 1.0.0 (2024-4-23)

### ⚠ BREAKING CHANGES

- **global:** Old eslint doesn't work anymore, changed all linter configs

### Features

- **global:** :sparkles: move to eslint flat config
  ([24bb155](https://github.com/gipo355/its-battistar/commit/24bb155ff0abb41ef87006f6f58b317a2a92e305))
- **its-battistar-be:** :sparkles: create auth routes, create auth base
  middleware
  ([782e5bc](https://github.com/gipo355/its-battistar/commit/782e5bc2bc7ad335620c0b4247511630ac9f3d04))
