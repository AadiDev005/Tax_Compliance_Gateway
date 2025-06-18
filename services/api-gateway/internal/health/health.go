package health

import (
    "context"
    "github.com/gin-gonic/gin"
    "github.com/AadiDev005/Tax_Compliance_Gateway/services/api-gateway/internal/config"
)

func CheckHandler(cfg *config.Config) gin.HandlerFunc {
    return func(c *gin.Context) {
        status := CheckServices(context.Background(), cfg.PostgresURL, cfg.MongoURL, cfg.RedisURL)
        c.JSON(200, gin.H{
            "services": status,
            "status":   "healthy",
        })
    }
}
