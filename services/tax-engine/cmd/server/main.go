package main

import (
    "fmt"
    "net/http"

    "github.com/gin-gonic/gin"
)

func calculateTax(c *gin.Context) {
    country := c.Query("country")
    amount := c.Query("amount")

    var tax float64
    switch country {
    case "mexico":
        tax = 0.16 * toFloat(amount)
    case "germany":
        tax = 0.19 * toFloat(amount)
    default:
        c.JSON(http.StatusBadRequest, gin.H{"error": "unsupported country"})
        return
    }
    c.JSON(http.StatusOK, gin.H{"tax": tax})
}

func toFloat(s string) float64 {
    var f float64
    fmt.Sscanf(s, "%f", &f)
    return f
}

func main() {
    r := gin.Default()
    r.GET("/calculate-tax", calculateTax)
    r.Run(":8082")
}
