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
    Amount        float64 `json:"amount" validate:"required,gt=0"`
    Country       string  `json:"country,omitempty"`
    JurisdictionID string  `json:"jurisdiction_id,omitempty"`
}

type TaxResponse struct {
    Country     string  `json:"country"`
    TaxRate     float64 `json:"tax_rate"`
    TaxAmount   float64 `json:"tax_amount"`
    NetAmount   float64 `json:"net_amount"`
    GrossAmount float64 `json:"gross_amount"`
    Currency    string  `json:"currency"`
    Tax         float64 `json:"tax"`   // For backward compatibility
    Total       float64 `json:"total"` // For backward compatibility
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
        c.JSON(http.StatusOK, gin.H{"status": "healthy", "service": "tax-engine"})
    }
}

func (h *Handler) CalculateTax() gin.HandlerFunc {
    return func(c *gin.Context) {
        var req TaxRequest
        if err := c.ShouldBindJSON(&req); err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request: " + err.Error()})
            return
        }

        // Use either jurisdiction_id or country
        jurisdiction := req.JurisdictionID
        if jurisdiction == "" {
            jurisdiction = req.Country
        }
        if jurisdiction == "" {
            jurisdiction = "DE" // Default
        }

        // Simple tax calculation without database dependency
        var taxRate float64
        switch jurisdiction {
        case "DE", "GERMANY":
            taxRate = 0.19 // 19% VAT
        case "MX", "MEXICO":
            taxRate = 0.16 // 16% IVA
        case "PL", "POLAND":
            taxRate = 0.23 // 23% VAT
        case "IT", "ITALY":
            taxRate = 0.22 // 22% VAT
        case "BR", "BRAZIL":
            taxRate = 0.17 // 17% ICMS
        default:
            taxRate = 0.20 // Default 20%
        }

        netAmount := req.Amount
        taxAmount := netAmount * taxRate
        grossAmount := netAmount + taxAmount

        // Send to Kafka if available (don't fail if Kafka is down)
        if h.producer != nil {
            event := struct {
                Amount        float64 `json:"amount"`
                Tax           float64 `json:"tax"`
                JurisdictionID string  `json:"jurisdiction_id"`
                CreatedAt     string  `json:"created_at"`
            }{
                Amount:        req.Amount,
                Tax:           taxAmount,
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
            TaxAmount:   taxAmount,
            NetAmount:   netAmount,
            GrossAmount: grossAmount,
            Currency:    "EUR",
            Tax:         taxAmount,   // Backward compatibility
            Total:       grossAmount, // Backward compatibility
        }

        c.JSON(http.StatusOK, response)
    }
}
