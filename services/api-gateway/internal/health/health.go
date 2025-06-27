package health

import (
    "database/sql"
    "fmt"
    "log"
    "os"
    "github.com/gin-gonic/gin"
    _ "github.com/lib/pq"
)

func CheckHandler(c *gin.Context) {
    log.Println("Received /health request")
    connStr := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
        os.Getenv("POSTGRES_HOST"), os.Getenv("POSTGRES_PORT"), os.Getenv("POSTGRES_USER"), os.Getenv("POSTGRES_PASSWORD"), os.Getenv("POSTGRES_DB"))
    log.Printf("Connecting to database with connStr: %s", connStr)
    db, err := sql.Open("postgres", connStr)
    if err != nil {
        log.Printf("Failed to open database connection: %v", err)
        c.JSON(500, gin.H{"status": "error", "message": "Database connection failed"})
        return
    }
    defer db.Close()
    if err := db.Ping(); err != nil {
        log.Printf("Failed to ping database: %v", err)
        c.JSON(500, gin.H{"status": "error", "message": "Database ping failed"})
        return
    }
    log.Println("Database connection successful")
    c.JSON(200, gin.H{"status": "ok"})
}

func MetricsHandler(c *gin.Context) {
    log.Println("Received /metrics request")
    c.JSON(200, gin.H{"metrics": "ok"})
}
