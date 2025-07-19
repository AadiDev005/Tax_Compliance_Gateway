package main

import (
    "log"
    "net/http"
    "os"

    "github.com/Shopify/sarama"
    "github.com/gin-gonic/gin"
    "github.com/jmoiron/sqlx"
    _ "github.com/lib/pq"
    
    "tax-compliance-gateway/audit-service/internal/repository"
    "tax-compliance-gateway/audit-service/internal/services"
)

func main() {
    // Use correct database credentials
    postgresURL := os.Getenv("POSTGRES_URL")
    if postgresURL == "" {
        postgresURL = "postgres://postgres:postgres@postgres:5432/tax_compliance?sslmode=disable"
    }

    db, err := sqlx.Open("postgres", postgresURL)
    if err != nil {
        log.Printf("Warning: Failed to connect to database: %v", err)
    } else {
        defer db.Close()
        if err = db.Ping(); err != nil {
            log.Printf("Warning: Database ping failed: %v", err)
            db = nil
        } else {
            log.Println("✅ Database connected successfully")
        }
    }

    // Initialize Kafka producer (optional)
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
        producer = nil
    }
    defer func() {
        if producer != nil {
            producer.Close()
        }
    }()

    // Initialize repository and services
    var auditRepo *repository.AuditRepository
    var auditService *services.AuditService

    if db != nil {
        auditRepo = repository.NewAuditRepository(db)
        auditService = services.NewAuditService(auditRepo)
    }

    // Setup Gin router
    r := gin.Default()

    // Health check
    r.GET("/health", func(c *gin.Context) {
    r.GET("/audit-logs", func(c *gin.Context) {
        if auditService != nil {
            logs, err := auditService.GetAuditLogs(c)
            if err != nil {
                c.JSON(500, gin.H{"error": err.Error()})
                return
            }
            c.JSON(200, gin.H{"audit_logs": logs})
        } else {
            c.JSON(200, gin.H{"audit_logs": []})
        }
    })        c.JSON(http.StatusOK, gin.H{"status": "healthy", "service": "audit-service"})
    })

    // Audit logs endpoint
    if auditService != nil {
        r.GET("/audit-logs", func(c *gin.Context) {
            logs, err := auditService.GetAuditLogs(c)
            if err != nil {
                c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
                return
            }
            c.JSON(http.StatusOK, gin.H{"audit_logs": logs})
        })
    }

    port := os.Getenv("PORT")
    if port == "" {
        port = "8084"
    }

    log.Printf("🚀 Audit service starting on port %s", port)
    if err := r.Run(":" + port); err != nil {
        log.Fatalf("Failed to start server: %v", err)
    }
}
