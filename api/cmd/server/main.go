package main

import (
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/itskarma/deployboard/api/internal/db"
	"github.com/itskarma/deployboard/api/internal/handlers"
	"github.com/itskarma/deployboard/api/internal/middleware"
)

func main() {
	// Initialize database connection
	database, err := db.Connect()
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer database.Close()

	// Create Gin router
	router := gin.Default()

	// API routes
	api := router.Group("/api")
	{
		// Deployment routes (require API key)
		deployments := api.Group("/deployments")
		deployments.Use(middleware.RequireAPIKey(database))
		{
			deployments.POST("", handlers.CreateDeployment(database))
			deployments.GET("", handlers.ListDeployments(database))
			deployments.GET("/:id", handlers.GetDeployment(database))
		}

		// Deployment logs routes (require API key)
		logs := api.Group("/logs")
		logs.Use(middleware.RequireAPIKey(database))
		{
			logs.GET("", handlers.ListDeploymentLogs(database))
			logs.GET("/:id", handlers.GetDeploymentLog(database))
		}

		// Metadata route (no auth required for UI)
		api.GET("/metadata", handlers.GetMetadata(database))

		// Admin routes (no auth for now, will lock down later)
		admin := api.Group("/admin")
		{
			admin.GET("/keys", handlers.ListAPIKeys(database))
			admin.POST("/keys", handlers.CreateAPIKey(database))
			admin.DELETE("/keys/:id", handlers.DeleteAPIKey(database))
			
			admin.GET("/environments", handlers.ListEnvironments(database))
			admin.PUT("/environments/:id", handlers.UpdateEnvironmentPriority(database))
			admin.POST("/environments/sync", handlers.SyncEnvironments(database))
		}

		// Health check (no auth required)
		api.GET("/health", func(c *gin.Context) {
			c.JSON(200, gin.H{"status": "ok"})
		})
	}

	// Get port from environment or default to 8080
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Starting server on port %s", port)
	if err := router.Run(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
