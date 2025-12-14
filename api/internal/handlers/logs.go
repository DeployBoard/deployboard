package handlers

import (
	"database/sql"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/itskarma/deployboard/api/internal/models"
)

// ListDeploymentLogs handles GET /api/logs
func ListDeploymentLogs(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Optional query parameters for filtering
		app := c.Query("application")
		env := c.Query("environment")
		limit := c.DefaultQuery("limit", "100")

		query := `SELECT id, application, version, environment, meta, timestamp FROM deployment_logs WHERE 1=1`
		args := []interface{}{}
		argCount := 1

		if app != "" {
			query += " AND application = $" + strconv.Itoa(argCount)
			args = append(args, app)
			argCount++
		}

		if env != "" {
			query += " AND environment = $" + strconv.Itoa(argCount)
			args = append(args, env)
			argCount++
		}

		query += " ORDER BY timestamp DESC LIMIT $" + strconv.Itoa(argCount)
		limitInt, _ := strconv.Atoi(limit)
		args = append(args, limitInt)

		rows, err := db.Query(query, args...)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch deployment logs"})
			return
		}
		defer rows.Close()

		logs := []models.Deployment{}
		for rows.Next() {
			var log models.Deployment
			err := rows.Scan(&log.ID, &log.Application, &log.Version, &log.Environment, &log.Meta, &log.Timestamp)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to scan deployment log"})
				return
			}
			logs = append(logs, log)
		}

		c.JSON(http.StatusOK, logs)
	}
}

// GetDeploymentLog handles GET /api/logs/:id
func GetDeploymentLog(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")

		var log models.Deployment
		err := db.QueryRow(`
			SELECT id, application, version, environment, meta, timestamp
			FROM deployment_logs
			WHERE id = $1
		`, id).Scan(
			&log.ID,
			&log.Application,
			&log.Version,
			&log.Environment,
			&log.Meta,
			&log.Timestamp,
		)

		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "Deployment log not found"})
			return
		}

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch deployment log"})
			return
		}

		c.JSON(http.StatusOK, log)
	}
}
