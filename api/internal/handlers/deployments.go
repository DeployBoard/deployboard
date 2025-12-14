package handlers

import (
	"database/sql"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/itskarma/deployboard/api/internal/models"
)

// CreateDeployment handles POST /api/deployments
func CreateDeployment(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req models.CreateDeploymentRequest
		
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		timestamp := time.Now()

		// Start a transaction to insert into both tables
		tx, err := db.Begin()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to start transaction"})
			return
		}
		defer tx.Rollback()

		// Insert into deployments table
		var deployment models.Deployment
		err = tx.QueryRow(`
			INSERT INTO deployments (application, version, environment, meta, timestamp)
			VALUES ($1, $2, $3, $4, $5)
			RETURNING id, application, version, environment, meta, timestamp
		`, req.Application, req.Version, req.Environment, req.Meta, timestamp).Scan(
			&deployment.ID,
			&deployment.Application,
			&deployment.Version,
			&deployment.Environment,
			&deployment.Meta,
			&deployment.Timestamp,
		)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create deployment"})
			return
		}

		// Insert into deployment_logs table for historical tracking
		_, err = tx.Exec(`
			INSERT INTO deployment_logs (application, version, environment, meta, timestamp)
			VALUES ($1, $2, $3, $4, $5)
		`, req.Application, req.Version, req.Environment, req.Meta, timestamp)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to log deployment"})
			return
		}

		// Commit the transaction
		if err = tx.Commit(); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to commit deployment"})
			return
		}

		c.JSON(http.StatusCreated, deployment)
	}
}

// ListDeployments handles GET /api/deployments
func ListDeployments(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Optional query parameters for filtering
		app := c.Query("application")
		env := c.Query("environment")
		limit := c.DefaultQuery("limit", "100")

		query := `SELECT id, application, version, environment, meta, timestamp FROM deployments WHERE 1=1`
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
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch deployments"})
			return
		}
		defer rows.Close()

		deployments := []models.Deployment{}
		for rows.Next() {
			var d models.Deployment
			err := rows.Scan(&d.ID, &d.Application, &d.Version, &d.Environment, &d.Meta, &d.Timestamp)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to scan deployment"})
				return
			}
			deployments = append(deployments, d)
		}

		c.JSON(http.StatusOK, deployments)
	}
}

// GetDeployment handles GET /api/deployments/:id
func GetDeployment(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")

		var deployment models.Deployment
		err := db.QueryRow(`
			SELECT id, application, version, environment, meta, timestamp
			FROM deployments
			WHERE id = $1
		`, id).Scan(
			&deployment.ID,
			&deployment.Application,
			&deployment.Version,
			&deployment.Environment,
			&deployment.Meta,
			&deployment.Timestamp,
		)

		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "Deployment not found"})
			return
		}

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch deployment"})
			return
		}

		c.JSON(http.StatusOK, deployment)
	}
}
