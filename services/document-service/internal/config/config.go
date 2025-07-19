package config

import (
    "os"
    "strconv"
)

type Config struct {
    Port            string
    MongoURI        string
    RedisURL        string
    TaxEngineURL    string
    MaxUploadSize   int64
    ProcessingWorkers int
    LogLevel        string
}

func LoadConfig() *Config {
    maxUploadSize, _ := strconv.ParseInt(getEnvOrDefault("MAX_UPLOAD_SIZE", "52428800"), 10, 64) // 50MB default
    processingWorkers, _ := strconv.Atoi(getEnvOrDefault("PROCESSING_WORKERS", "5"))
    
    return &Config{
        Port:            getEnvOrDefault("PORT", "8083"),
        MongoURI:        getEnvOrDefault("MONGO_URI", "mongodb://mongodb:27017"),
        RedisURL:        getEnvOrDefault("REDIS_URL", "redis:6379"),
        TaxEngineURL:    getEnvOrDefault("TAX_ENGINE_URL", "http://tax-engine:8082"),
        MaxUploadSize:   maxUploadSize,
        ProcessingWorkers: processingWorkers,
        LogLevel:        getEnvOrDefault("LOG_LEVEL", "info"),
    }
}

func getEnvOrDefault(key, defaultValue string) string {
    if value := os.Getenv(key); value != "" {
        return value
    }
    return defaultValue
}
