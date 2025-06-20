package health

import (
	"context"
	"strings"

	"github.com/gin-gonic/gin"
)

// CheckHandler returns a simple health status
func CheckHandler(c *gin.Context) {
	c.JSON(200, gin.H{"status": "healthy"})
}

// MetricsHandler returns basic metrics
func MetricsHandler(c *gin.Context) {
	c.JSON(200, gin.H{"metrics": "service is running"}) // Enhance with actual metrics
}

// CheckServices checks the health of dependent services
func CheckServices(ctx context.Context, postgresURL, mongodbURL, redisURL string) map[string]string {
	status := make(map[string]string)
	// Simulate health checks (replace with actual logic)
	if strings.HasPrefix(postgresURL, "invalid") {
		status["postgres"] = "error: invalid URL"
	} else {
		status["postgres"] = "healthy"
	}
	if strings.HasPrefix(mongodbURL, "invalid") {
		status["mongodb"] = "error: invalid URL"
	} else {
		status["mongodb"] = "healthy"
	}
	if strings.HasPrefix(redisURL, "invalid") {
		status["redis"] = "error: invalid URL"
	} else {
		status["redis"] = "healthy"
	}
	return status
}
