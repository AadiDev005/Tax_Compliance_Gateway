package main

import (
    "database/sql"
    "fmt"
    "github.com/gin-gonic/gin"
    "github.com/prometheus/client_golang/prometheus"
    "github.com/prometheus/client_golang/prometheus/promhttp"
    "github.com/rs/zerolog/log"
    "time"
    _ "github.com/lib/pq"
    "github.com/AadiDev005/Tax_Compliance_Gateway/services/api-gateway/internal/config"
    "github.com/AadiDev005/Tax_Compliance_Gateway/services/api-gateway/internal/health"
    "github.com/AadiDev005/Tax_Compliance_Gateway/services/api-gateway/internal/taxrules"
)

var (
    httpRequestsTotal = prometheus.NewCounterVec(
        prometheus.CounterOpts{
            Name: "http_requests_total",
            Help: "Total number of HTTP requests",
        },
        []string{"method", "path", "status"},
    )
    httpRequestDurationSeconds = prometheus.NewHistogramVec(
        prometheus.HistogramOpts{
            Name:    "http_request_duration_seconds",
            Help:    "Duration of HTTP requests in seconds",
            Buckets: prometheus.DefBuckets,
        },
        []string{"method", "path", "status"},
    )
)

func init() {
    prometheus.MustRegister(httpRequestsTotal, httpRequestDurationSeconds)
}

func main() {
    cfg := config.LoadConfig()

    db, err := sql.Open("postgres", cfg.PostgresURL)
    if err != nil {
        log.Fatal().Err(err).Msg("Failed to connect to PostgreSQL")
    }
    defer db.Close()

    r := gin.Default()

    // Middleware to track requests and latency
    r.Use(func(c *gin.Context) {
        start := time.Now()
        path := c.Request.URL.Path
        method := c.Request.Method
        c.Next()
        status := fmt.Sprintf("%d", c.Writer.Status())
        duration := time.Since(start).Seconds()
        httpRequestsTotal.WithLabelValues(method, path, status).Inc()
        httpRequestDurationSeconds.WithLabelValues(method, path, status).Observe(duration)
    })

    r.GET("/health", health.CheckHandler(cfg))
    r.GET("/metrics", gin.WrapH(promhttp.Handler()))
    r.GET("/tax-rules", taxrules.GetTaxRules(db))

    log.Info().Msg("Starting server on port 8080")
    if err := r.Run(":8080"); err != nil {
        log.Fatal().Err(err).Msg("Failed to start server")
    }
}
