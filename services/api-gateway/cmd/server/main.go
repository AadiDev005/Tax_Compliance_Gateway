package main

import (
    "net/http"
    "github.com/AadiDev005/Tax_Compliance_Gateway/services/api-gateway/internal/config"
    "github.com/gin-gonic/gin"
    "github.com/prometheus/client_golang/prometheus"
    "github.com/prometheus/client_golang/prometheus/promhttp"
    "github.com/rs/zerolog/log"
)

var (
    requestCounter = prometheus.NewCounterVec(
        prometheus.CounterOpts{
            Name: "http_requests_total",
            Help: "Total number of HTTP requests",
        },
        []string{"path", "method", "status"},
    )
)

func init() {
    prometheus.MustRegister(requestCounter)
}

func main() {
    cfg := config.LoadConfig()
    r := gin.Default()

    r.Use(func(c *gin.Context) {
        path := c.Request.URL.Path
        method := c.Request.Method
        c.Next()
        status := c.Writer.Status()
        requestCounter.WithLabelValues(path, method, string(rune(status))).Inc()
    })

    r.GET("/health", func(c *gin.Context) {
        log.Info().Msg("Health check requested")
        c.JSON(http.StatusOK, gin.H{"status": "healthy"})
    })

    r.GET("/metrics", gin.WrapH(promhttp.Handler()))

    log.Info().Str("env", cfg.AppEnv).Msg("Starting API Gateway")
    if err := r.Run(":8080"); err != nil {
        log.Fatal().Err(err).Msg("Server failed")
    }
}
