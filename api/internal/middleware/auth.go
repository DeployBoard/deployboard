package middleware

import (
	"database/sql"
	"net/http"

	"github.com/gin-gonic/gin"
)

// RequireAPIKey validates the API key from the X-API-Key header
func RequireAPIKey(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		apiKey := c.GetHeader("X-API-Key")
		
		if apiKey == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "API key required"})
			c.Abort()
			return
		}

		// Validate API key against database
		var exists bool
		err := db.QueryRow("SELECT EXISTS(SELECT 1 FROM api_keys WHERE key = $1)", apiKey).Scan(&exists)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to validate API key"})
			c.Abort()
			return
		}

		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid API key"})
			c.Abort()
			return
		}

		c.Next()
	}
}
