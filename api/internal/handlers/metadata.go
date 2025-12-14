package handlers

import (
	"database/sql"
	"net/http"

	"github.com/gin-gonic/gin"
)

// GetMetadata handles GET /api/metadata
func GetMetadata(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Get distinct applications
		appRows, err := db.Query("SELECT DISTINCT application FROM deployments ORDER BY application")
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch applications"})
			return
		}
		defer appRows.Close()

		applications := []string{}
		for appRows.Next() {
			var app string
			if err := appRows.Scan(&app); err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to scan application"})
				return
			}
			applications = append(applications, app)
		}

		// Get distinct environments
		envRows, err := db.Query("SELECT DISTINCT environment FROM deployments ORDER BY environment")
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch environments"})
			return
		}
		defer envRows.Close()

		environments := []string{}
		for envRows.Next() {
			var env string
			if err := envRows.Scan(&env); err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to scan environment"})
				return
			}
			environments = append(environments, env)
		}

		c.JSON(http.StatusOK, gin.H{
			"applications": applications,
			"environments": environments,
		})
	}
}
