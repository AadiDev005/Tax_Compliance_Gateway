package main

import (
    "database/sql"
    "encoding/json"
    "log"
    "net/http"
    "os"
    "time"

    "github.com/IBM/sarama"
    "github.com/dgrijalva/jwt-go"
    "github.com/gin-gonic/gin"
    _ "github.com/lib/pq"  // PostgreSQL driver
)

type TaxRule struct {
    ID             int     `json:"id"`
    JurisdictionID string  `json:"jurisdiction_id"`
    Rate          float64 `json:"rate"`
    RuleType      string  `json:"rule_type"`
    Description   string  `json:"description"`
    EffectiveDate string  `json:"effective_date"`
}

func main() {
    // Database connection
    postgresURL := os.Getenv("POSTGRES_URL")
    if postgresURL == "" {
        postgresURL = "postgres://postgres:postgres@postgres:5432/tax_compliance?sslmode=disable"
    }
    
    db, err := sql.Open("postgres", postgresURL)
    if err != nil {
        log.Printf("Warning: Failed to connect to database: %v", err)
        log.Println("API Gateway will work with limited functionality...")
    } else {
        defer db.Close()
        if err = db.Ping(); err != nil {
            log.Printf("Warning: Database ping failed: %v", err)
            db = nil
        } else {
            log.Println("✅ Database connected successfully")
        }
    }

    // Setup Gin router
    r := gin.Default()

    // CORS middleware
    r.Use(func(c *gin.Context) {
        c.Header("Access-Control-Allow-Origin", "*")
        c.Header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        c.Header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        if c.Request.Method == "OPTIONS" {
            c.AbortWithStatus(204)
            return
        }
        c.Next()
    })

    // Health check
    r.GET("/health", func(c *gin.Context) {
        c.JSON(http.StatusOK, gin.H{
            "status":    "healthy",
            "service":   "api-gateway",
            "timestamp": time.Now().Format(time.RFC3339),
        })
    })

    // Tax rules endpoint
    r.GET("/tax-rules", func(c *gin.Context) {
        if db == nil {
            // Return default tax rules if no database
            defaultRules := []TaxRule{
                {ID: 1, JurisdictionID: "DE", Rate: 0.19, RuleType: "VAT", Description: "Germany VAT", EffectiveDate: "2023-01-01"},
                {ID: 2, JurisdictionID: "MX", Rate: 0.16, RuleType: "IVA", Description: "Mexico IVA", EffectiveDate: "2023-01-01"},
                {ID: 3, JurisdictionID: "PL", Rate: 0.23, RuleType: "VAT", Description: "Poland VAT", EffectiveDate: "2023-01-01"},
                {ID: 4, JurisdictionID: "IT", Rate: 0.22, RuleType: "VAT", Description: "Italy VAT", EffectiveDate: "2023-01-01"},
                {ID: 5, JurisdictionID: "BR", Rate: 0.17, RuleType: "ICMS", Description: "Brazil ICMS", EffectiveDate: "2023-01-01"},
            }
            c.JSON(http.StatusOK, gin.H{"tax_rules": defaultRules})
            return
        }

        // Query database for tax rules
        rows, err := db.Query("SELECT id, jurisdiction_id, rate, rule_type, description, effective_date FROM tax_rules ORDER BY jurisdiction_id")
        if err != nil {
            log.Printf("Database query error: %v", err)
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch tax rules"})
            return
        }
        defer rows.Close()

        var rules []TaxRule
        for rows.Next() {
            var rule TaxRule
            err := rows.Scan(&rule.ID, &rule.JurisdictionID, &rule.Rate, &rule.RuleType, &rule.Description, &rule.EffectiveDate)
            if err != nil {
                log.Printf("Row scan error: %v", err)
                continue
            }
            rules = append(rules, rule)
        }

        c.JSON(http.StatusOK, gin.H{"tax_rules": rules})
    })

    // Proxy to document service
    r.POST("/documents/upload", func(c *gin.Context) {
        // Proxy to document-service
        c.Header("Location", "http://localhost:8083/documents/upload")
        c.JSON(http.StatusTemporaryRedirect, gin.H{"redirect": "http://localhost:8083/documents/upload"})
    })

    // Proxy to tax engine
    r.POST("/tax-calculate", func(c *gin.Context) {
        c.Header("Location", "http://localhost:8082/tax-calculate")
        c.JSON(http.StatusTemporaryRedirect, gin.H{"redirect": "http://localhost:8082/tax-calculate"})
    })

    port := os.Getenv("PORT")
    if port == "" {
        port = "8080"
    }

    log.Printf("🚀 API Gateway starting on port %s", port)
    if err := r.Run(":" + port); err != nil {
        log.Fatalf("Failed to start server: %v", err)
    }
}
