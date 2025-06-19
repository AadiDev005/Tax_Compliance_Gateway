package main

import (
	"tax-compliance-gateway/internal/config"
	"tax-compliance-gateway/internal/handlers/rest/taxrules"
	"tax-compliance-gateway/internal/health"

	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9"
)

func main() {
	r := gin.Default()

	cfg := config.GetConfig()
	redisClient := redis.NewClient(&redis.Options{
		Addr: cfg.RedisURL,
	})

	taxHandler := taxrules.NewHandler(redisClient)
	r.GET("/tax-rules", taxHandler.GetTaxRules)
	r.GET("/health", health.CheckHandler(cfg))

	r.Run(":8080")
}
