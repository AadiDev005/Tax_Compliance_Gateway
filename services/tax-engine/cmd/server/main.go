package main

import (
	"github.com/gin-gonic/gin"
	"tax-compliance-gateway/internal/handlers"
	"tax-compliance-gateway/internal/health"
)

func main() {
	gin.SetMode(gin.ReleaseMode)
	router := gin.New()
	router.Use(gin.Logger())
	router.Use(gin.Recovery())
	router.SetTrustedProxies([]string{"172.18.0.1"}) // Adjust proxy IP as needed
	router.GET("/health", health.CheckHandler)
	router.GET("/metrics", health.MetricsHandler)
	router.POST("/tax-calculate", handlers.CalculateTax)
	router.Run(":8082")
}
