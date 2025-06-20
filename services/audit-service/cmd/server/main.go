package main

import (
	"github.com/gin-gonic/gin"
	"tax-compliance-gateway/internal/handlers"
	"tax-compliance-gateway/internal/health"
	"log"
)

func main() {
	gin.SetMode(gin.ReleaseMode)
	router := gin.New()
	router.Use(gin.Logger())
	router.Use(gin.Recovery())
	router.SetTrustedProxies([]string{"172.18.0.1"})
	router.GET("/health", health.CheckHandler)
	router.GET("/metrics", health.MetricsHandler)
	router.GET("/audit-logs", handlers.GetAuditLogs)
	log.Println("Server starting on :8081")
	router.Run(":8081")
}
