# base node image
FROM node:18.13.0-bullseye-slim as base

# set for base and all layer that inherit from it
ENV NODE_ENV production

# DISABLED: Here's where we'd install dependencies
# RUN apt-get update && apt-get install -y openssl sqlite3

# Install all node_modules, including dev dependencies
FROM base as deps

WORKDIR /myapp

ADD package.json package-lock.json .npmrc ./
RUN npm install --production=false

# Setup production node_modules
FROM base as production-deps

WORKDIR /myapp

COPY --from=deps /myapp/node_modules /myapp/node_modules
ADD package.json package-lock.json .npmrc ./
RUN npm prune --production

# Build the app
FROM base as build

WORKDIR /myapp

COPY --from=deps /myapp/node_modules /myapp/node_modules

ADD . .

# Build with sourcemaps in staging only
ARG DEPLOYMENT_ENV
ENV SENTRY_AUTH_TOKEN ${SENTRY_AUTH_TOKEN}
RUN echo "🍺 DEPLOYMENT_ENV = $DEPLOYMENT_ENV"
RUN if [ "$DEPLOYMENT_ENV" = "staging" ] ; then npm run build-with-sourcemaps ; else npm run build ; fi

# Finally, build the production image with minimal footprint
FROM base

ENV PORT="8080"
ENV NODE_ENV="production"

WORKDIR /myapp

COPY --from=production-deps /myapp/node_modules /myapp/node_modules

COPY --from=build /myapp/build /myapp/build
COPY --from=build /myapp/public /myapp/public
COPY --from=build /myapp/package.json /myapp/package.json
COPY --from=build /myapp/start.sh /myapp/start.sh

ENTRYPOINT [ "./start.sh" ]
