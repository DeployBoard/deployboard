# DeployBoard

A lightweight deployment tracking tool that records and displays software deployments across environments.

## Overview

DeployBoard is a self-hosted application that tracks deployments by accepting deployment payloads via a REST API and storing them in PostgreSQL. It provides visibility into what version of each application is deployed to each environment.

## Features

- 📝 Track deployments with application name, version, and environment
- 🔐 API key authentication for secure access
- 📊 Query deployments by application and environment
- 🏷️ Support for custom metadata (commit hash, branch, committer, etc.)
- 🐳 Docker Compose support for easy local development
- ☸️ Kubernetes-ready architecture

## Quick Start

### Prerequisites

- Docker and Docker Compose
- (Optional) Go 1.21+ for local development

### Running with Docker Compose

1. Clone the repository
2. Start the services:

```bash
make up
```

This will:
- Start PostgreSQL with the database schema
- Seed sample data (deployments and API keys)
- Start the API server
- Start the UI on http://localhost:8080

3. Open your browser to http://localhost:8080 to view the deployment dashboard

4. Test the API directly:

```bash
# Health check
curl http://localhost:8080/api/health

# List deployments (requires API key)
curl -H "X-API-Key: dev-key-12345" http://localhost:8080/api/deployments

# Create a deployment (will appear in the UI immediately)
curl -X POST http://localhost:8080/api/deployments \
  -H "X-API-Key: dev-key-12345" \
  -H "Content-Type: application/json" \
  -d '{
    "application": "my-app",
    "version": "1.2.3",
    "environment": "production",
    "meta": {
      "commit": "abc123",
      "branch": "main",
      "committer": "developer@example.com"
    }
  }'
```

## API Endpoints

### Deployments

- `POST /api/deployments` - Create a new deployment record
- `GET /api/deployments` - List current deployments (supports filtering)
- `GET /api/deployments/:id` - Get a specific deployment

### Deployment Logs

- `GET /api/logs` - List all deployment history (supports filtering)
- `GET /api/logs/:id` - Get a specific log entry

### Query Parameters

- `application` - Filter by application name
- `environment` - Filter by environment
- `limit` - Limit results (default: 25)

### Authentication

All deployment endpoints require an API key passed via the `X-API-Key` header.

Sample API keys (from seed data):
- `dev-key-12345` - Development Key
- `prod-key-67890` - Production Key
- `test-key-abcde` - Test Key

## Request Schema

```json
{
  "application": "string (required)",
  "version": "string (required)",
  "environment": "string (required)",
  "meta": {
    "key": "value (optional)"
  }
}
```

The `meta` field accepts any JSON object for custom metadata like commit hashes, branches, tags, committers, deployment duration, etc.

## Development

### Available Make Commands

```bash
make help          # Show all available commands
make up            # Start all services
make down          # Stop all services
make logs          # View all logs
make logs-api      # View API logs only
make restart-api   # Restart API service
make db-shell      # Open PostgreSQL shell
make clean         # Remove all containers and volumes
```

### Project Structure

```
/api                  - Go backend
  /cmd/server         - Main application entry point
  /internal
    /db               - Database connection
    /handlers         - API route handlers
    /middleware       - Authentication middleware
    /models           - Data models
  /Dockerfile         - API container image
/ui                   - Svelte frontend
  /src
    /lib              - Svelte components and utilities
    App.svelte        - Main UI component
  /Dockerfile         - UI container image
  nginx.conf          - Nginx configuration
/scripts              - Database seed scripts
/docker-compose.yml   - Local development orchestration
/Makefile             - Common development tasks
```

## Environment Variables

The API supports the following environment variables:

- `DB_HOST` - Database host (default: localhost)
- `DB_PORT` - Database port (default: 5432)
- `DB_USER` - Database user (default: deployboard)
- `DB_PASSWORD` - Database password (default: deployboard)
- `DB_NAME` - Database name (default: deployboard)
- `DB_SSLMODE` - SSL mode (default: disable)
- `PORT` - API server port (default: 8080)

## Deployment

### Kubernetes

The application is designed to be Kubernetes-ready. Each service has its own Dockerfile for building container images. You'll need to:

1. Build and push images to your container registry
2. Create Kubernetes manifests for deployments, services, and secrets
3. Deploy PostgreSQL (or use a managed database)
4. Deploy the API with appropriate environment variables

### Other Container Runtimes

The application can be deployed to any container runtime (ECS, Cloud Run, etc.) by:

1. Building the API Docker image
2. Providing a PostgreSQL database
3. Setting appropriate environment variables
4. Exposing port 8080

## UI Features

The web interface provides:
- **Environment Matrix View**: See all applications and their versions across environments at a glance
- **Recent Deployment Info**: Each cell shows version, deployment time, and commit hash
- **Color-Coded Environments**: Development (blue), Staging (orange), Production (red)
- **Responsive Design**: Clean, modern interface that works on all screen sizes

## Roadmap

- [ ] Admin API endpoints for managing API keys
- [ ] Real-time updates (WebSocket/SSE)
- [ ] Advanced filtering and search in UI
- [ ] Deployment history and timeline view
- [ ] Webhooks for deployment notifications
- [ ] Retention policies for old deployments
- [ ] Deployment comparison and diff view

## License

MIT
