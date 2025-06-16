package main

import (
    "net/http"
    "github.com/AadiDev005/Tax_Compliance_Gateway/services/api-gateway/internal/config"
    "github.com/gin-gonic/gin"
    "github.com/rs/zerolog/log"
)

func main() {
    cfg := config.LoadConfig()
    r := gin.Default()

    r.GET("/health", func(c *gin.Context) {
        log.Info().Msg("Health check requested")
        c.JSON(http.StatusOK, gin.H{"status": "healthy"})
    })

    log.Info().Str("env", cfg.AppEnv).Msg("Starting API Gateway")
    if err := r.Run(":8080"); err != nil {
        log.Fatal().Err(err).Msg("Server failed")
    }
}
