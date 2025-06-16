package main

import (
    "context"
    "github.com/gin-gonic/gin"
    "github.com/prometheus/client_golang/prometheus/promhttp"
    "github.com/rs/zerolog/log"
    "net/http"
    "github.com/AadiDev005/Tax_Compliance_Gateway/services/api-gateway/internal/config"
    "github.com/AadiDev005/Tax_Compliance_Gateway/services/api-gateway/internal/health"
)

func main() {
    // Load configuration
    cfg := config.LoadConfig()
    if cfg.PostgresURL == "" {
        log.Fatal().Msg("POSTGRES_URL is not set")
    }
    log.Info().
        Str("postgres_url", cfg.PostgresURL).
        Str("mongo_url", cfg.MongoURL).
        Str("redis_url", cfg.RedisURL).
        Str("kafka_brokers", cfg.KafkaBrokers).
        Str("app_env", cfg.AppEnv).
        Msg("Configuration loaded")

    r := gin.Default()

    r.GET("/health", func(c *gin.Context) {
        status := health.CheckServices(context.Background(), cfg.PostgresURL, cfg.MongoURL, cfg.RedisURL)
        if status.Postgres && status.MongoDB && status.Redis {
            c.JSON(http.StatusOK, gin.H{"status": "healthy", "services": status})
        } else {
            c.JSON(http.StatusServiceUnavailable, gin.H{"status": "unhealthy", "services": status})
            log.Info().Interface("status", status).Msg("Health check requested")
        }
    })

    r.GET("/metrics", gin.WrapH(promhttp.Handler()))

    if err := r.Run(":8080"); err != nil {
        log.Fatal().Err(err).Msg("Failed to start server")
    }
}
