package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "healthy"})
	})

	r.GET("/dashboard", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message":  "Welcome to the Business Portal Dashboard",
			"services": []string{"tax-rules", "audit-logs", "tax-calculate"},
		})
	})

	if err := r.Run(":8083"); err != nil {
		panic("Failed to start server: " + err.Error())
	}
}
