package taxrules

import (
    "encoding/json"
    "net/http"
    "time"

    "github.com/gin-gonic/gin"
    "github.com/redis/go-redis/v9"
)

type TaxRule struct {
    ID             int     `json:"id"`
    JurisdictionID int     `json:"jurisdiction_id"`
    RuleType       string  `json:"rule_type"`
    Rate           float64 `json:"rate"`
    EffectiveDate  string  `json:"effective_date"`
    Description    string  `json:"description"`
}

type TaxRulesResponse struct {
    Data []TaxRule `json:"data"`
    Meta struct {
        Limit      int `json:"limit"`
        Page       int `json:"page"`
        Total      int `json:"total"`
        TotalPages int `json:"totalPages"`
    } `json:"meta"`
}

type Handler struct {
    redis *redis.Client
}

func NewHandler(redis *redis.Client) *Handler {
    return &Handler{redis: redis}
}

func (h *Handler) GetTaxRules(c *gin.Context) {
    ctx := c.Request.Context()
    cacheKey := "tax_rules:page1:limit10"

    // Try cache
    cached, err := h.redis.Get(ctx, cacheKey).Result()
    if err == nil {
        var response TaxRulesResponse
        if err := json.Unmarshal([]byte(cached), &response); err == nil {
            c.JSON(http.StatusOK, response)
            return
        }
    }

    // Mock DB call
    response := TaxRulesResponse{
        Data: []TaxRule{
            {ID: 1, JurisdictionID: 1, RuleType: "IVA", Rate: 16, EffectiveDate: "2025-01-01T00:00:00Z", Description: "Standard IVA rate"},
            {ID: 2, JurisdictionID: 2, RuleType: "VAT", Rate: 19, EffectiveDate: "2025-01-01T00:00:00Z", Description: "Standard VAT rate"},
            {ID: 3, JurisdictionID: 3, RuleType: "VAT", Rate: 23, EffectiveDate: "2025-01-01T00:00:00Z", Description: "Standard VAT rate"},
            {ID: 4, JurisdictionID: 4, RuleType: "VAT", Rate: 22, EffectiveDate: "2025-01-01T00:00:00Z", Description: "Standard VAT rate"},
            {ID: 5, JurisdictionID: 5, RuleType: "ICMS", Rate: 17, EffectiveDate: "2025-01-01T00:00:00Z", Description: "Standard ICMS rate"},
        },
        Meta: struct {
            Limit      int `json:"limit"`
            Page       int `json:"page"`
            Total      int `json:"total"`
            TotalPages int `json:"totalPages"`
        }{Limit: 10, Page: 1, Total: 5, TotalPages: 1},
    }

    // Cache response
    data, _ := json.Marshal(response)
    h.redis.Set(ctx, cacheKey, data, 5*time.Minute)

    c.JSON(http.StatusOK, response)
}
