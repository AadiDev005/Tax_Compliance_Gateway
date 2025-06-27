package health

import (
    "log"
    "github.com/gin-gonic/gin"
)

func CheckHandler(c *gin.Context) {
    log.Println("Received /health request")
    c.JSON(200, gin.H{"status": "ok"})
}

func MetricsHandler(c *gin.Context) {
    log.Println("Received /metrics request")
    c.JSON(200, gin.H{"metrics": "ok"})
}
