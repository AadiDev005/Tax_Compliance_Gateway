package handlers

import "github.com/gin-gonic/gin"

func GetTaxRules(c *gin.Context) {
    c.JSON(200, gin.H{"message": "Tax rules endpoint"})
}
