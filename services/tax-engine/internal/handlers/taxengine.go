package handlers

import "github.com/gin-gonic/gin"

func CalculateTax(c *gin.Context) {
	c.JSON(200, gin.H{"message": "Tax calculated"})
}
