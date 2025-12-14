.PHONY: help dev build up down logs seed clean test

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

dev: ## Run API locally (requires Go and local Postgres)
	cd api && go run cmd/server/main.go

build: ## Build all Docker images
	docker-compose build

up: ## Start all services with Docker Compose
	docker-compose up -d

down: ## Stop all services
	docker-compose down

logs: ## View logs from all services
	docker-compose logs -f

logs-api: ## View API logs only
	docker-compose logs -f api

logs-ui: ## View UI logs only
	docker-compose logs -f ui

logs-db: ## View Postgres logs only
	docker-compose logs -f postgres

seed: ## Run seed script on database (when running with docker-compose)
	docker-compose exec postgres psql -U deployboard -d deployboard -f /docker-entrypoint-initdb.d/seed.sql

clean: ## Remove all containers, volumes, and images
	docker-compose down -v --rmi all

restart: ## Restart all services
	docker-compose restart

restart-api: ## Restart API service only
	docker-compose restart api

test: ## Run tests (placeholder for future)
	@echo "Tests not implemented yet"

status: ## Show status of all services
	docker-compose ps

db-shell: ## Open psql shell in database container
	docker-compose exec postgres psql -U deployboard -d deployboard
