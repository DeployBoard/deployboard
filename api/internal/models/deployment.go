package models

import (
	"database/sql/driver"
	"encoding/json"
	"time"
)

// JSONB is a custom type for handling PostgreSQL JSONB columns
type JSONB map[string]interface{}

// Value implements the driver.Valuer interface
func (j JSONB) Value() (driver.Value, error) {
	if j == nil {
		return nil, nil
	}
	return json.Marshal(j)
}

// Scan implements the sql.Scanner interface
func (j *JSONB) Scan(value interface{}) error {
	if value == nil {
		*j = nil
		return nil
	}
	
	bytes, ok := value.([]byte)
	if !ok {
		return nil
	}
	
	return json.Unmarshal(bytes, j)
}

// Deployment represents a deployment record
type Deployment struct {
	ID          int64     `json:"id"`
	Application string    `json:"application"`
	Version     string    `json:"version"`
	Environment string    `json:"environment"`
	Meta        JSONB     `json:"meta,omitempty"`
	Timestamp   time.Time `json:"timestamp"`
}

// CreateDeploymentRequest represents the payload for creating a deployment
type CreateDeploymentRequest struct {
	Application string `json:"application" binding:"required"`
	Version     string `json:"version" binding:"required"`
	Environment string `json:"environment" binding:"required"`
	Meta        JSONB  `json:"meta,omitempty"`
}
