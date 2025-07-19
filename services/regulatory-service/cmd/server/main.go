package main

import (
    "log"
    "net/http"
    "os"

    "github.com/gin-gonic/gin"
)

func main() {
    r := gin.Default()

    // Health check
    r.GET("/health", func(c *gin.Context) {
        c.JSON(http.StatusOK, gin.H{"status": "healthy", "service": "regulatory-service"})
    })

    // Regulatory changes endpoint (placeholder)
    r.GET("/regulatory-changes", func(c *gin.Context) {
        changes := []map[string]interface{}{
            {"id": 1, "country": "DE", "change": "VAT rate update", "effective_date": "2024-01-01"},
            {"id": 2, "country": "MX", "change": "IVA compliance rule", "effective_date": "2024-02-01"},
        }
        c.JSON(http.StatusOK, gin.H{"regulatory_changes": changes})
    })

    port := os.Getenv("PORT")
    if port == "" {
        port = "8085"
    }

    log.Printf("🚀 Regulatory service starting on port %s", port)
    if err := r.Run(":" + port); err != nil {
        log.Fatalf("Failed to start server: %v", err)
    }
}
