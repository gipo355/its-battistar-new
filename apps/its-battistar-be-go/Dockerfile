# Build the docker image with `npx nx docker-build its-battistar-express`.
# Tip: Modify "docker-build" options in project.json to change docker build args.
#
# Run the container with `docker run -p 3000:3000 -t its-battistar-express`.
FROM docker.io/golang:alpine as builder

LABEL org.opencontainers.image.source=https://github.com/gipo355/its-battistar-be-go

# TODO: ENV vars for production usage if not using infisical

ENV HOST=0.0.0.0
ENV PORT=3000

ENV REDIS_HOST=default
ENV REDIS_PORT=6379
ENV REDIS_PASSWORD=default
ENV REDIS_USERNAME=default

ENV MONGO_STRING=default

ENV CSRF_SECRET=default
ENV SESSION_SECRET=default
ENV JWT_SECRET=default
ENV COOKIE_SECRET=default

ENV UV_THREADPOOL_SIZE=4
ENV SENTRY_DSN=''
ENV ENABLE_LOKI='false'
ENV ENABLE_RATE_LIMITER='true'
ENV RATE_LIMITER_POINTS=100
ENV RATE_LIMITER_DURATION=3600
ENV EXPRESS_TRUST_NUMBER_OF_PROXIES = 0

WORKDIR /app

RUN addgroup --system its-battistar-be-go && \
  adduser --system -G its-battistar-be-go its-battistar-be-go

COPY dist/apps/its-battistar-be-go its-battistar-be-go
RUN chown -R its-battistar-be-go:its-battistar-be-go .

# install infisical cli
# can inject secrets into env
# RUN apk add --no-cache bash curl
# RUN curl -1sLf \
#   'https://dl.cloudsmith.io/public/infisical/infisical-cli/setup.alpine.sh' \
#   | bash
# RUN apk update && apk add infisical

EXPOSE ${PORT}

# CMD [ "infisical run -- ", "./its-battistar-be-go/server" ]
CMD [ "./its-battistar-be-go/server" ]
