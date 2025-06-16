package main

import (
    "context"
    "fmt"
    "github.com/gin-gonic/gin"
    "github.com/prometheus/client_golang/prometheus"
    "github.com/prometheus/client_golang/prometheus/promhttp"
    "github.com/rs/zerolog/log"
    "net/http"
    "github.com/AadiDev005/Tax_Compliance_Gateway/services/api-gateway/internal/config"
    "github.com/AadiDev005/Tax_Compliance_Gateway/services/api-gateway/internal/health"
)

var (
    httpRequestsTotal = prometheus.NewCounterVec(
        prometheus.CounterOpts{
            Name: "http_requests_total",
            Help: "Total number of HTTP requests",
        },
        []string{"method", "path", "status"},
    )
)

func init() {
    prometheus.MustRegister(httpRequestsTotal)
}

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

    // Middleware to track requests
    r.Use(func(c *gin.Context) {
        path := c.Request.URL.Path
        method := c.Request.Method
        c.Next()
        status := fmt.Sprintf("%d", c.Writer.Status())
        httpRequestsTotal.WithLabelValues(method, path, status).Inc()
    })

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
