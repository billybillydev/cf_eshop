# syntax=docker/dockerfile:1

FROM node:24-slim as base

RUN npm install -g bun

WORKDIR /app

# Install node modules.
COPY bun.lockb package.json tsconfig.base.json turbo.json ./

# Copy everything in packages to prepare build:packages script.
COPY packages/ ./packages/

# Install turbo in order to run build:packages which use it. Be careful that this turbo version is same as the one in package.json to avoid unexpected behavior.
RUN bun add turbo@^2.0.9

# Build packages used as dependencies in apps.
RUN bun build:packages

# Copy again packages which contains dist from build:packages.
COPY packages/ ./packages/

# Copy jahhb app entirely.
COPY apps/react/ ./apps/react/

# Install all dependencies from all package.json files.
RUN bun install

ENV PORT 3000
EXPOSE $PORT

# Running react app exclusively
CMD ["bun", "run", "start:dev:react"]