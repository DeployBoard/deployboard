package handlers

import (
	"database/sql"
	"net/http"

	"github.com/gin-gonic/gin"
)

type APIKey struct {
	ID        int    `json:"id"`
	Key       string `json:"key"`
	Name      string `json:"name"`
	CreatedAt string `json:"created_at"`
}

type CreateAPIKeyRequest struct {
	Key  string `json:"key" binding:"required"`
	Name string `json:"name" binding:"required"`
}

// ListAPIKeys returns all API keys
func ListAPIKeys(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		rows, err := db.Query(`
			SELECT id, key, name, created_at 
			FROM api_keys 
			ORDER BY created_at DESC
		`)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch API keys"})
			return
		}
		defer rows.Close()

		var keys []APIKey
		for rows.Next() {
			var key APIKey
			if err := rows.Scan(&key.ID, &key.Key, &key.Name, &key.CreatedAt); err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to scan API key"})
				return
			}
			keys = append(keys, key)
		}

		if keys == nil {
			keys = []APIKey{}
		}

		c.JSON(http.StatusOK, keys)
	}
}

// CreateAPIKey creates a new API key
func CreateAPIKey(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req CreateAPIKeyRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		result, err := db.Exec(`
			INSERT INTO api_keys (key, name) 
			VALUES ($1, $2)
		`, req.Key, req.Name)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create API key"})
			return
		}

		id, _ := result.LastInsertId()
		c.JSON(http.StatusCreated, gin.H{
			"id":   id,
			"key":  req.Key,
			"name": req.Name,
		})
	}
}

// DeleteAPIKey deletes an API key by ID
func DeleteAPIKey(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")

		result, err := db.Exec("DELETE FROM api_keys WHERE id = $1", id)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete API key"})
			return
		}

		rowsAffected, _ := result.RowsAffected()
		if rowsAffected == 0 {
			c.JSON(http.StatusNotFound, gin.H{"error": "API key not found"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "API key deleted successfully"})
	}
}
