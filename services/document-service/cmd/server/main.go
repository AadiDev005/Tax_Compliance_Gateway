package main

import (
    "context"
    "log"
    "tax-compliance-gateway/document-service/internal/config"
    "tax-compliance-gateway/document-service/internal/handlers"
    "tax-compliance-gateway/document-service/internal/services"
    "tax-compliance-gateway/document-service/internal/parsers"
    
    "github.com/gin-gonic/gin"
    "go.mongodb.org/mongo-driver/mongo"
    "go.mongodb.org/mongo-driver/mongo/options"
)

func main() {
    // Load configuration
    cfg := config.LoadConfig()
    
    // Connect to MongoDB
    client, err := mongo.Connect(context.Background(), options.Client().ApplyURI(cfg.MongoURI))
    if err != nil {
        log.Fatalf("Failed to connect to MongoDB: %v", err)
    }
    defer client.Disconnect(context.Background())
    
    // Initialize database
    database := client.Database("tax_compliance")
    
    // Initialize parsers
    formatDetector := parsers.NewFormatDetector()
    xmlParser := parsers.NewXMLParser()
    jsonParser := parsers.NewJSONParser()
    
    // Initialize services
    documentService := services.NewDocumentService(database, cfg)
    processingService := services.NewProcessingService(
        formatDetector,
        xmlParser,
        jsonParser,
        cfg,
    )
    
    // Initialize handlers
    uploadHandler := handlers.NewUploadHandler(documentService, processingService)
    statusHandler := handlers.NewStatusHandler(documentService)
    
    // Setup Gin router
    r := gin.Default()
    
    // Add middleware for file uploads
    r.MaxMultipartMemory = cfg.MaxUploadSize
    
    // Health check
    r.GET("/health", func(c *gin.Context) {
        c.JSON(200, gin.H{"status": "healthy", "service": "document-service"})
    })
    
    // Document processing endpoints
    r.POST("/documents/upload", uploadHandler.HandleUpload)
    r.GET("/documents/:id/status", statusHandler.HandleStatus)
    r.GET("/documents/:id", statusHandler.HandleGetDocument)
    r.GET("/documents", statusHandler.HandleListDocuments)
    
    // Legacy endpoint for backward compatibility
    r.POST("/invoices", func(c *gin.Context) {
        c.JSON(200, gin.H{"message": "Use /documents/upload endpoint for new functionality"})
    })
    
    log.Printf("Document service starting on port %s", cfg.Port)
    if err := r.Run(":" + cfg.Port); err != nil {
        log.Fatalf("Failed to start server: %v", err)
    }
}
