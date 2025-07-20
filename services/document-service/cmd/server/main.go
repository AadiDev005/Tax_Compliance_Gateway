package main

import (
	"log"
	"net/http"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"*"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status":    "healthy",
			"service":   "document-service",
			"timestamp": time.Now(),
		})
	})

	r.POST("/documents/upload", func(c *gin.Context) {
		file, header, err := c.Request.FormFile("file")
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "No file uploaded"})
			return
		}
		defer file.Close()

		c.JSON(http.StatusOK, gin.H{
			"message":  "File uploaded successfully",
			"filename": header.Filename,
			"size":     header.Size,
			"status":   "processing",
		})
	})

	r.GET("/documents", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"data": gin.H{
				"documents": []gin.H{
					{"id": "1", "filename": "invoice_DE_001.xml", "format": "xml", "size": 2048, "status": "completed"},
					{"id": "2", "filename": "invoice_MX_002.json", "format": "json", "size": 1536, "status": "processing"},
				},
			},
		})
	})

	log.Println("🚀 Document Service starting on :8083")
	r.Run(":8083")
}
