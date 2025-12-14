package handlers

import (
	"database/sql"
	"net/http"

	"github.com/gin-gonic/gin"
)

type Environment struct {
	ID       int    `json:"id"`
	Name     string `json:"name"`
	Priority int    `json:"priority"`
}

type UpdateEnvironmentPriorityRequest struct {
	Priority int `json:"priority" binding:"required"`
}

// ListEnvironments returns all environments ordered by priority
func ListEnvironments(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		rows, err := db.Query(`
			SELECT id, name, priority 
			FROM environments 
			ORDER BY priority DESC, name ASC
		`)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch environments"})
			return
		}
		defer rows.Close()

		var environments []Environment
		for rows.Next() {
			var env Environment
			if err := rows.Scan(&env.ID, &env.Name, &env.Priority); err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to scan environment"})
				return
			}
			environments = append(environments, env)
		}

		if environments == nil {
			environments = []Environment{}
		}

		c.JSON(http.StatusOK, environments)
	}
}

// UpdateEnvironmentPriority updates the priority of an environment
func UpdateEnvironmentPriority(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		
		var req UpdateEnvironmentPriorityRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		result, err := db.Exec(`
			UPDATE environments 
			SET priority = $1 
			WHERE id = $2
		`, req.Priority, id)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update environment priority"})
			return
		}

		rowsAffected, _ := result.RowsAffected()
		if rowsAffected == 0 {
			c.JSON(http.StatusNotFound, gin.H{"error": "Environment not found"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Priority updated successfully"})
	}
}

// SyncEnvironments ensures all distinct environments from deployments exist in environments table
func SyncEnvironments(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Get distinct environments from deployments
		rows, err := db.Query(`
			SELECT DISTINCT environment 
			FROM deployments 
			WHERE environment IS NOT NULL
		`)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch environments from deployments"})
			return
		}
		defer rows.Close()

		var addedCount int
		for rows.Next() {
			var envName string
			if err := rows.Scan(&envName); err != nil {
				continue
			}

			// Insert if not exists (will be ignored if already exists due to UNIQUE constraint)
			_, err := db.Exec(`
				INSERT INTO environments (name, priority) 
				VALUES ($1, 0) 
				ON CONFLICT (name) DO NOTHING
			`, envName)
			if err == nil {
				addedCount++
			}
		}

		c.JSON(http.StatusOK, gin.H{
			"message": "Environments synced successfully",
			"added":   addedCount,
		})
	}
}
