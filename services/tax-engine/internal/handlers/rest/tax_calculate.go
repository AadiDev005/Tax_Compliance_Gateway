package rest

import (
    "github.com/gin-gonic/gin"
    "net/http"
)

type TaxRequest struct {
    Amount      float64 `json:"amount"`
    Jurisdiction string  `json:"jurisdiction"`
}

type TaxResponse struct {
    Tax float64 `json:"tax"`
}

type Handler struct{}

func NewHandler() *Handler {
    return &Handler{}
}

func (h *Handler) HealthCheckHandler() gin.HandlerFunc {
    return func(c *gin.Context) {
        c.JSON(http.StatusOK, gin.H{
            "status": "healthy",
        })
    }
}

func (h *Handler) CalculateTax() gin.HandlerFunc {
    return func(c *gin.Context) {
        var req TaxRequest
        if err := c.ShouldBindJSON(&req); err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
            return
        }
        // Mock tax calculation
        tax := req.Amount * 0.2 // 20% tax rate
        c.JSON(http.StatusOK, TaxResponse{Tax: tax})
    }
}
