package handlers

import "github.com/gin-gonic/gin"

func GetAuditLogs(c *gin.Context) {
	c.JSON(200, gin.H{"message": "Audit logs endpoint"})
}
