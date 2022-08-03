# syntax=docker/dockerfile:1
# Source from the official Dockerfile repository
FROM node:16-slim AS builder
# Install git
RUN apt-get update && apt-get install -y git
# Set the working directory
WORKDIR /app
# Copy the app into the container
COPY ./ /app/
# Install turborepo
RUN npm install --location=global turbo
# Install dependencies
RUN npm install
# Build the app
RUN npm run build

# Source from the official Dockerfile repository
FROM node:16-slim
# Install git
RUN apt-get update && apt-get install -y git
# Set the working directory
WORKDIR /app
# Copy the built app from the builder stage into this container
COPY --from=builder /app ./
# Install turborepo
RUN npm install --location=global turbo
# Install dependencies
RUN npm install --omit=dev
# Run the app
CMD ["npm", "run", "start"]
