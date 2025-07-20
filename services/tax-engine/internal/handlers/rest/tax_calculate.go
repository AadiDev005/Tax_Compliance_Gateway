package rest

import (
    "encoding/json"
    "net/http"
    "time"

    "github.com/Shopify/sarama"
    "github.com/gin-gonic/gin"
    "github.com/go-playground/validator/v10"
    "tax-compliance-gateway/tax-engine/internal/services"
)

type TaxRequest struct {
    Amount         float64 `json:"amount" validate:"required,gt=0"`
    Currency       string  `json:"currency,omitempty"`
    Country        string  `json:"country,omitempty"`
    JurisdictionID string  `json:"jurisdiction_id,omitempty"`
}

type TaxResponse struct {
    Country     string  `json:"country"`
    TaxRate     float64 `json:"tax_rate"`
    TaxAmount   float64 `json:"tax_amount"`
    NetAmount   float64 `json:"net_amount"`
    GrossAmount float64 `json:"gross_amount"`
    Currency    string  `json:"currency"`
    Tax         float64 `json:"tax"`
    Total       float64 `json:"total"`
}

type Handler struct {
    taxService *services.TaxService
    producer   sarama.SyncProducer
    validator  *validator.Validate
}

func NewHandler(taxService *services.TaxService, producer sarama.SyncProducer) *Handler {
    return &Handler{
        taxService: taxService,
        producer:   producer,
        validator:  validator.New(),
    }
}

func (h *Handler) HealthCheckHandler() gin.HandlerFunc {
    return func(c *gin.Context) {
        c.JSON(http.StatusOK, gin.H{
            "status":    "healthy",
            "service":   "tax-engine",
            "timestamp": time.Now().Format(time.RFC3339),
        })
    }
}

func (h *Handler) CalculateTax() gin.HandlerFunc {
    return func(c *gin.Context) {
        var req TaxRequest
        if err := c.ShouldBindJSON(&req); err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request: " + err.Error()})
            return
        }

        jurisdiction := req.JurisdictionID
        if jurisdiction == "" {
            jurisdiction = req.Country
        }
        if jurisdiction == "" {
            jurisdiction = "DE"
        }

        tax, total, err := h.taxService.CalculateTax(c, req.Amount, jurisdiction)
        if err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
            return
        }

        taxRate := 0.0
        if req.Amount > 0 {
            taxRate = tax / req.Amount
        }

        currency := req.Currency
        if currency == "" {
            currency = "EUR"
        }

        if h.producer != nil {
            event := struct {
                Amount        float64 `json:"amount"`
                Tax           float64 `json:"tax"`
                JurisdictionID string  `json:"jurisdiction_id"`
                CreatedAt     string  `json:"created_at"`
            }{
                Amount:        req.Amount,
                Tax:           tax,
                JurisdictionID: jurisdiction,
                CreatedAt:     time.Now().Format(time.RFC3339),
            }
            eventBytes, _ := json.Marshal(event)
            h.producer.SendMessage(&sarama.ProducerMessage{
                Topic: "tax_calculations",
                Value: sarama.ByteEncoder(eventBytes),
            })
        }

        response := TaxResponse{
            Country:     jurisdiction,
            TaxRate:     taxRate,
            TaxAmount:   tax,
            NetAmount:   req.Amount,
            GrossAmount: total,
            Currency:    currency,
            Tax:         tax,
            Total:       total,
        }

        c.JSON(http.StatusOK, response)
    }
}
