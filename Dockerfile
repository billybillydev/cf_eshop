# syntax=docker/dockerfile:1

# Base Stage
FROM node:20-slim as base

RUN npm install -g bun

WORKDIR /app

COPY bun.lockb package.json tsconfig.base.json ./
COPY packages ./packages

# Install and build shared packages
RUN bun install
RUN bun build:packages

# Dependencies Stage
FROM base as deps

# Copy again packages to include dist and source
COPY packages ./packages

# Copy all apps (to allow bun install to work)
COPY apps ./apps

# Install all monorepo dependencies
RUN bun install

# API App Stage
FROM deps as api

WORKDIR /app/apps/api

CMD bun dev

# React App Stage
FROM deps as react

WORKDIR /app/apps/react

ENV PORT=3001
EXPOSE $PORT

CMD ["bun", "dev"]
