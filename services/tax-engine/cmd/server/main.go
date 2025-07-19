package main

import (
    "log"
    "os"
    
    "github.com/Shopify/sarama"
    "github.com/gin-gonic/gin"
    "github.com/go-redis/redis/v8"
    "github.com/jmoiron/sqlx"
    _ "github.com/lib/pq"
    
    "tax-compliance-gateway/tax-engine/internal/handlers/rest"
    "tax-compliance-gateway/tax-engine/internal/repository"
    "tax-compliance-gateway/tax-engine/internal/services"
)

func main() {
    // Database connection with correct credentials
    postgresURL := os.Getenv("POSTGRES_URL")
    if postgresURL == "" {
        postgresURL = "postgres://postgres:postgres@postgres:5432/tax_compliance?sslmode=disable"
    }
    
    db, err := sqlx.Open("postgres", postgresURL)
    if err != nil {
        log.Printf("Warning: Failed to connect to database: %v", err)
        log.Println("Service will use default tax rates...")
    } else {
        defer db.Close()
        if err = db.Ping(); err != nil {
            log.Printf("Warning: Database ping failed: %v", err)
            log.Println("Service will use default tax rates...")
        } else {
            log.Println("✅ Database connected successfully")
        }
    }

    // Redis connection
    redisAddr := os.Getenv("REDIS_URL")
    if redisAddr == "" {
        redisAddr = "redis:6379"
    }
    
    redisClient := redis.NewClient(&redis.Options{
        Addr: redisAddr,
    })
    
    // Test Redis connection
    if err := redisClient.Ping(redisClient.Context()).Err(); err != nil {
        log.Printf("Warning: Redis connection failed: %v", err)
        log.Println("Service will work without caching...")
    } else {
        log.Println("✅ Redis connected successfully")
    }

    // Kafka producer setup
    var producer sarama.SyncProducer
    kafkaBrokers := os.Getenv("KAFKA_BROKERS")
    if kafkaBrokers == "" {
        kafkaBrokers = "kafka:9092"
    }
    
    config := sarama.NewConfig()
    config.Producer.RequiredAcks = sarama.WaitForAll
    config.Producer.Retry.Max = 10
    config.Producer.Return.Successes = true
    
    producer, err = sarama.NewSyncProducer([]string{kafkaBrokers}, config)
    if err != nil {
        log.Printf("Warning: Failed to connect to Kafka: %v", err)
        log.Println("Service will work without event publishing...")
        producer = nil
    } else {
        defer producer.Close()
        log.Println("✅ Kafka connected successfully")
    }

    // Initialize repository and services
    taxRepo := repository.NewTaxRuleRepository(db, redisClient, producer)
    taxService := services.NewTaxService(taxRepo)
    handler := rest.NewHandler(taxService, producer)

    // Setup Gin router
    r := gin.Default()
    
    // Health check
    r.GET("/health", handler.HealthCheckHandler())
    
    // Tax calculation endpoints (multiple routes for compatibility)
    r.POST("/tax-calculate", handler.CalculateTax())
    r.POST("/calculate-tax", handler.CalculateTax())
    r.POST("/calculate", handler.CalculateTax())

    // Port configuration
    port := os.Getenv("PORT")
    if port == "" {
        port = "8082" // Changed from 8081 to match Docker compose
    }

    log.Printf("🚀 Tax engine starting on port %s", port)
    if err := r.Run(":" + port); err != nil {
        log.Fatalf("Failed to start server: %v", err)
    }
}
