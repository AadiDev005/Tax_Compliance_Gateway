package services

import (
    "bytes"
    "encoding/json"
    "fmt"
    "net/http"
    "tax-compliance-gateway/document-service/internal/config"
    "tax-compliance-gateway/document-service/internal/models"
    "tax-compliance-gateway/document-service/internal/parsers"
    "strconv"
    "strings"
)

type ProcessingService struct {
    formatDetector *parsers.FormatDetector
    xmlParser      *parsers.XMLParser
    jsonParser     *parsers.JSONParser
    config         *config.Config
}

func NewProcessingService(
    formatDetector *parsers.FormatDetector,
    xmlParser *parsers.XMLParser,
    jsonParser *parsers.JSONParser,
    cfg *config.Config,
) *ProcessingService {
    return &ProcessingService{
        formatDetector: formatDetector,
        xmlParser:      xmlParser,
        jsonParser:     jsonParser,
        config:         cfg,
    }
}

func (ps *ProcessingService) ProcessDocument(doc *models.Document) (*models.ProcessingResult, error) {
    result := &models.ProcessingResult{
        DocumentID: doc.ID.Hex(),
        Status:     models.StatusProcessing,
    }
    
    // Parse document based on format
    parsedData, err := ps.parseDocument(doc)
    if err != nil {
        result.Status = models.StatusFailed
        result.Error = fmt.Sprintf("Parse error: %v", err)
        return result, err
    }
    
    result.Data = parsedData
    
    // Calculate tax if we have the required data
    taxResult, err := ps.calculateTax(parsedData)
    if err != nil {
        // Tax calculation error is not fatal - document is still processed
        result.Data["tax_calculation_error"] = err.Error()
    } else if taxResult != nil {
        result.Data["tax_calculation"] = taxResult
    }
    
    result.Status = models.StatusCompleted
    return result, nil
}

func (ps *ProcessingService) parseDocument(doc *models.Document) (map[string]interface{}, error) {
    switch doc.Format {
    case models.FormatXML:
        return ps.xmlParser.Parse(doc.Content)
    case models.FormatJSON:
        return ps.jsonParser.Parse(doc.Content)
    case models.FormatPDF:
        return ps.parsePDF(doc.Content)
    default:
        return nil, fmt.Errorf("unsupported document format: %s", doc.Format)
    }
}

func (ps *ProcessingService) parsePDF(content []byte) (map[string]interface{}, error) {
    // Basic PDF text extraction placeholder
    // In a production system, you'd use a proper PDF library like github.com/ledongthuc/pdf
    result := map[string]interface{}{
        "format": "pdf",
        "size":   len(content),
        "note":   "PDF parsing requires OCR implementation",
        "parsed_successfully": false,
    }
    
    return result, nil
}

type TaxCalculationRequest struct {
    Amount   float64 `json:"amount"`
    Country  string  `json:"country"`
    Currency string  `json:"currency,omitempty"`
}

type TaxCalculationResponse struct {
    Country     string  `json:"country"`
    TaxRate     float64 `json:"tax_rate"`
    TaxAmount   float64 `json:"tax_amount"`
    NetAmount   float64 `json:"net_amount"`
    GrossAmount float64 `json:"gross_amount"`
    Currency    string  `json:"currency"`
}

func (ps *ProcessingService) calculateTax(parsedData map[string]interface{}) (*models.TaxResult, error) {
    // Extract required fields for tax calculation
    amount, err := extractAmount(parsedData)
    if err != nil {
        return nil, fmt.Errorf("cannot extract amount: %v", err)
    }
    
    country, err := extractCountry(parsedData)
    if err != nil {
        return nil, fmt.Errorf("cannot extract country: %v", err)
    }
    
    currency := extractCurrency(parsedData)
    
    // Prepare request to tax-engine service
    taxReq := TaxCalculationRequest{
        Amount:   amount,
        Country:  country,
        Currency: currency,
    }
    
    reqBody, err := json.Marshal(taxReq)
    if err != nil {
        return nil, fmt.Errorf("failed to marshal tax request: %v", err)
    }
    
    // Call tax-engine service
    resp, err := http.Post(
        ps.config.TaxEngineURL+"/tax-calculate",
        "application/json",
        bytes.NewBuffer(reqBody),
    )
    if err != nil {
        return nil, fmt.Errorf("failed to call tax engine: %v", err)
    }
    defer resp.Body.Close()
    
    if resp.StatusCode != http.StatusOK {
        return nil, fmt.Errorf("tax engine returned status: %d", resp.StatusCode)
    }
    
    var taxResp TaxCalculationResponse
    if err := json.NewDecoder(resp.Body).Decode(&taxResp); err != nil {
        return nil, fmt.Errorf("failed to decode tax response: %v", err)
    }
    
    // Convert to our model
    return &models.TaxResult{
        Country:     taxResp.Country,
        TaxRate:     taxResp.TaxRate,
        TaxAmount:   taxResp.TaxAmount,
        NetAmount:   taxResp.NetAmount,
        GrossAmount: taxResp.GrossAmount,
        Currency:    taxResp.Currency,
    }, nil
}

func extractAmount(data map[string]interface{}) (float64, error) {
    // Try different field names for amount
    for _, key := range []string{"total", "amount", "gross_amount", "net_amount"} {
        if val, exists := data[key]; exists {
            switch v := val.(type) {
            case float64:
                return v, nil
            case float32:
                return float64(v), nil
            case int:
                return float64(v), nil
            case string:
                if amount, err := strconv.ParseFloat(v, 64); err == nil {
                    return amount, nil
                }
            }
        }
    }
    return 0, fmt.Errorf("amount field not found or invalid")
}

func extractCountry(data map[string]interface{}) (string, error) {
    if val, exists := data["country"]; exists {
        if country, ok := val.(string); ok && country != "" {
            return strings.ToUpper(country), nil
        }
    }
    
    // Default to Germany for testing if no country specified
    return "DE", nil
}

func extractCurrency(data map[string]interface{}) string {
    if val, exists := data["currency"]; exists {
        if currency, ok := val.(string); ok && currency != "" {
            return strings.ToUpper(currency)
        }
    }
    return "EUR" // Default currency
}
