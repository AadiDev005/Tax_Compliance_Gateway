package health

import "github.com/gin-gonic/gin"

func CheckHandler(c *gin.Context) {
	c.JSON(200, gin.H{"status": "healthy"})
}

func MetricsHandler(c *gin.Context) {
	c.JSON(200, gin.H{"metrics": "service is running"})
}
