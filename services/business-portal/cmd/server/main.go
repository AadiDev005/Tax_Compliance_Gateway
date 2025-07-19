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
        c.JSON(http.StatusOK, gin.H{"status": "healthy", "service": "business-portal"})
    })

    // Dashboard endpoint (placeholder)
    r.GET("/dashboard", func(c *gin.Context) {
        dashboard := map[string]interface{}{
            "total_documents": 42,
            "processed_today": 15,
            "active_jurisdictions": 5,
            "compliance_score": 98.5,
        }
        c.JSON(http.StatusOK, gin.H{"dashboard": dashboard})
    })

    port := os.Getenv("PORT")
    if port == "" {
        port = "8086"
    }

    log.Printf("🚀 Business portal starting on port %s", port)
    if err := r.Run(":" + port); err != nil {
        log.Fatalf("Failed to start server: %v", err)
    }
}
