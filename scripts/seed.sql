-- Create api_keys table
CREATE TABLE IF NOT EXISTS api_keys (
    id SERIAL PRIMARY KEY,
    key VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create index on key for faster lookups
CREATE INDEX idx_api_keys_key ON api_keys(key);

-- Create deployments table
CREATE TABLE IF NOT EXISTS deployments (
    id SERIAL PRIMARY KEY,
    application VARCHAR(255) NOT NULL,
    version VARCHAR(255) NOT NULL,
    environment VARCHAR(255) NOT NULL,
    meta JSONB,
    timestamp TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX idx_deployments_application ON deployments(application);
CREATE INDEX idx_deployments_environment ON deployments(environment);
CREATE INDEX idx_deployments_timestamp ON deployments(timestamp DESC);
CREATE INDEX idx_deployments_app_env ON deployments(application, environment);

-- Create deployment_logs table for historical tracking
CREATE TABLE IF NOT EXISTS deployment_logs (
    id SERIAL PRIMARY KEY,
    application VARCHAR(255) NOT NULL,
    version VARCHAR(255) NOT NULL,
    environment VARCHAR(255) NOT NULL,
    meta JSONB,
    timestamp TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create indexes for logs table
CREATE INDEX idx_deployment_logs_application ON deployment_logs(application);
CREATE INDEX idx_deployment_logs_environment ON deployment_logs(environment);
CREATE INDEX idx_deployment_logs_timestamp ON deployment_logs(timestamp DESC);
CREATE INDEX idx_deployment_logs_app_env ON deployment_logs(application, environment);

-- Insert sample API keys
INSERT INTO api_keys (key, name) VALUES
    ('dev-key-12345', 'Development Key'),
    ('prod-key-67890', 'Production Key'),
    ('test-key-abcde', 'Test Key');

-- Insert sample deployments
INSERT INTO deployments (application, version, environment, meta, timestamp) VALUES
    ('web-app', '1.0.0', 'development', '{"commit": "abc123", "branch": "main", "committer": "john@example.com"}', NOW() - INTERVAL '5 days'),
    ('web-app', '1.0.1', 'staging', '{"commit": "def456", "branch": "main", "committer": "jane@example.com"}', NOW() - INTERVAL '3 days'),
    ('web-app', '1.0.1', 'production', '{"commit": "def456", "branch": "main", "committer": "jane@example.com", "deployment_duration": "2m30s"}', NOW() - INTERVAL '2 days'),
    ('api-service', '2.3.0', 'development', '{"commit": "xyz789", "branch": "feature/new-endpoint", "committer": "bob@example.com"}', NOW() - INTERVAL '4 days'),
    ('api-service', '2.2.5', 'staging', '{"commit": "ghi789", "branch": "main", "committer": "alice@example.com"}', NOW() - INTERVAL '6 days'),
    ('api-service', '2.2.5', 'production', '{"commit": "ghi789", "branch": "main", "committer": "alice@example.com", "deployment_duration": "5m15s"}', NOW() - INTERVAL '7 days'),
    ('worker-service', '0.5.0', 'development', '{"commit": "aaa111", "branch": "develop", "committer": "charlie@example.com"}', NOW() - INTERVAL '1 day'),
    ('worker-service', '0.4.8', 'staging', '{"commit": "bbb222", "branch": "main", "committer": "diana@example.com"}', NOW() - INTERVAL '8 days'),
    ('worker-service', '0.4.8', 'production', '{"commit": "bbb222", "branch": "main", "committer": "diana@example.com", "deployment_duration": "3m45s"}', NOW() - INTERVAL '10 days'),
    ('mobile-api', '3.1.0', 'development', '{"commit": "ccc333", "branch": "hotfix/crash-fix", "committer": "eve@example.com"}', NOW() - INTERVAL '12 hours'),
    ('mobile-api', '3.0.9', 'staging', '{"commit": "ddd444", "branch": "main", "committer": "frank@example.com"}', NOW() - INTERVAL '5 days'),
    ('mobile-api', '3.0.9', 'production', '{"commit": "ddd444", "branch": "main", "committer": "frank@example.com", "deployment_duration": "4m20s"}', NOW() - INTERVAL '9 days');

-- Insert sample data into deployment_logs (copy all deployments to logs for historical tracking)
INSERT INTO deployment_logs (application, version, environment, meta, timestamp)
SELECT application, version, environment, meta, timestamp FROM deployments;
