# Source from the official Dockerfile repository
# AS builder
FROM node:24-slim
# Run as node user
USER root
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
# Build the app (web now builds to dist/ instead of build/)
RUN npm run build

# Source from the official Dockerfile repository
# FROM node:24-slim
# Install git
# RUN apt-get update && apt-get install -y git
# Set the working directory
# WORKDIR /app
# Copy the app into the container
# COPY ./ /app/
# Copy the built dist directories from the builder stage into this container
# COPY --from=builder /app/apps/api/dist ./app/apps/api/
# COPY --from=builder /app/apps/auth/dist ./app/apps/auth/
# COPY --from=builder /app/apps/deploy/dist ./app/apps/deploy/
# COPY --from=builder /app/apps/web/dist ./app/apps/web/
# Install turborepo
# RUN npm install --location=global turbo
# Install dependencies
# RUN npm install --omit=dev
# Run the app
ENTRYPOINT ["turbo", "run", "start"]
