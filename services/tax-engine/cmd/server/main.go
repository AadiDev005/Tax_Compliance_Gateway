package main

import (
    "github.com/gin-gonic/gin"
    "tax-compliance-gateway/internal/handlers/rest"
)

func main() {
    r := gin.Default()
    handler := rest.NewHandler()
    r.GET("/health", handler.HealthCheckHandler())
    r.POST("/tax-calculate", handler.CalculateTax())
    r.Run(":8082")
}
