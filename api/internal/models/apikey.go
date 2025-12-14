package models

import (
	"time"
)

// APIKey represents an API key record
type APIKey struct {
	ID        int64     `json:"id"`
	Key       string    `json:"key"`
	Name      string    `json:"name"`
	CreatedAt time.Time `json:"created_at"`
}
