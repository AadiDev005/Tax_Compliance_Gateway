package main

import (
    "context"
    "github.com/gin-gonic/gin"
    "github.com/jmoiron/sqlx"
    "log"
    _ "github.com/lib/pq"
)

type ComplianceReport struct {
    JurisdictionID string  `json:"jurisdiction_id"`
    ComplianceScore float64 `json:"compliance_score"`
}

func main() {
    db, err := sqlx.Open("postgres", "host=postgres user=admin password=secret dbname=tax_compliance sslmode=disable")
    if err != nil {
        log.Fatalf("Failed to connect to database: %v", err)
    }
    defer db.Close()

    r := gin.Default()
    r.GET("/health", func(c *gin.Context) {
        c.JSON(200, gin.H{"status": "healthy"})
    })

    r.GET("/compliance-report", func(c *gin.Context) {
        reports := []ComplianceReport{
            {JurisdictionID: "MX", ComplianceScore: 0.95},
            {JurisdictionID: "DE", ComplianceScore: 0.90},
            {JurisdictionID: "PL", ComplianceScore: 0.88},
            {JurisdictionID: "IT", ComplianceScore: 0.87},
            {JurisdictionID: "BR", ComplianceScore: 0.85},
        }
        c.JSON(200, gin.H{"reports": reports})
    })

    if err := r.Run(":8084"); err != nil {
        log.Fatalf("Failed to start server: %v", err)
    }
}
