[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
![Tests](https://github.com/gipo355/its-battistar/actions/workflows/test-main.yml/badge.svg?branch=main)
![Tests](https://github.com/gipo355/its-battistar/actions/workflows/test-dev.yml/badge.svg?branch=dev)
![Docker](https://github.com/gipo355/its-battistar/actions/workflows/ghcr.yml/badge.svg?branch=main)
![Pages](https://github.com/gipo355/its-battistar/actions/workflows/pages.yml/badge.svg?branch=main)
![Release](https://github.com/gipo355/its-battistar/actions/workflows/release.yml/badge.svg?branch=main)
![Semgrep](https://github.com/gipo355/its-battistar/actions/workflows/semgrep.yml/badge.svg?branch=dev)
[![CodeQL](https://github.com/gipo355/its-battistar/actions/workflows/github-code-scanning/codeql/badge.svg)](https://github.com/gipo355/its-battistar/actions/workflows/github-code-scanning/codeql)

## Requirements

- [Node.js](https://nodejs.org/en/download/) >= 20.5
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Nx CLI](https://nx.dev/latest/angular/getting-started/nx-setup) >= 18
- [Pnpm](https://pnpm.io/installation) >= 8.5.0
- node-gyp global installation for `argon2`: `npm install -g node-gyp`

## Installation

```bash
$ git clone https://github.com/gipo355/its-battistar && cd its-battistar
$ pnpm install
$ cp apps/its-battistar-express/.env.example apps/its-battistar-express/.env
# edit the .env with your own values for production
$ pnpm run serve-all # serve express + angular

# or
$ pnpm run serve-angular # serve angular only
$ pnpm run serve-express # serve express only
```

## config files

config files are located at:

express:

- `apps/its-battistar-express/.env`
- `apps/its-battistar-express/src/app.config.ts`

angular:

- `apps/its-battistar-angular/src/environments/environment.ts` for angular

## used tools

- [git-cz](https://cz-git.qbb.sh/guide/)
- [semver](https://github.com/jscutlery/semver#jscutlerysemver)
- [nx](https://nx.dev/latest/angular/getting-started/nx-setup)
- [detect-secrets](https://github.com/Yelp/detect-secrets)

# NOTES

## bugfixes

- solved a docker bug from [here][https://github.com/nrwl/nx/issues/2625]

## links

- ghcr
  - [https://dev.to/ken_mwaura1/automate-docker-image-builds-and-push-to-github-registry-using-github-actions-4h20]
  - [https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry#labelling-container-images]
  - [https://docs.github.com/en/packages/managing-github-packages-using-github-actions-workflows/publishing-and-installing-a-package-with-github-actions]
  - permission errors [https://github.com/docker/build-push-action/issues/687]
  - [https://docs.docker.com/build/ci/github-actions/manage-tags-labels/]
