package tax

import (
    "tax-compliance-gateway/backend/internal/shared/eventsource/events"
    "time"
)

const (
    TaxCalculationRequested = "TAX_CALCULATION_REQUESTED"
    TaxCalculationCompleted = "TAX_CALCULATION_COMPLETED"
    TaxCalculationFailed    = "TAX_CALCULATION_FAILED"
    DocumentProcessingStarted = "DOCUMENT_PROCESSING_STARTED"
    DocumentProcessingCompleted = "DOCUMENT_PROCESSING_COMPLETED"
    RegulatoryChangeDetected = "REGULATORY_CHANGE_DETECTED"
    ComplianceValidationPerformed = "COMPLIANCE_VALIDATION_PERFORMED"
)

type TaxCalculationRequestedData struct {
    Amount         float64 `json:"amount"`
    Currency       string  `json:"currency"`
    JurisdictionID string  `json:"jurisdiction_id"`
    RequestedBy    string  `json:"requested_by"`
    RequestedAt    time.Time `json:"requested_at"`
}

type TaxCalculationCompletedData struct {
    Amount         float64 `json:"amount"`
    TaxAmount      float64 `json:"tax_amount"`
    TaxRate        float64 `json:"tax_rate"`
    TotalAmount    float64 `json:"total_amount"`
    Currency       string  `json:"currency"`
    JurisdictionID string  `json:"jurisdiction_id"`
    CalculationDuration time.Duration `json:"calculation_duration"`
    CompletedAt    time.Time `json:"completed_at"`
}

type DocumentProcessingStartedData struct {
    DocumentID   string `json:"document_id"`
    FileName     string `json:"file_name"`
    FileSize     int64  `json:"file_size"`
    Format       string `json:"format"`
    StartedBy    string `json:"started_by"`
    StartedAt    time.Time `json:"started_at"`
}

type DocumentProcessingCompletedData struct {
    DocumentID      string `json:"document_id"`
    ProcessingResult map[string]interface{} `json:"processing_result"`
    TaxCalculations []TaxCalculationCompletedData `json:"tax_calculations"`
    ProcessingDuration time.Duration `json:"processing_duration"`
    CompletedAt     time.Time `json:"completed_at"`
}

type RegulatoryChangeDetectedData struct {
    JurisdictionID  string `json:"jurisdiction_id"`
    ChangeType      string `json:"change_type"`
    ChangeDetails   map[string]interface{} `json:"change_details"`
    EffectiveDate   time.Time `json:"effective_date"`
    ImpactLevel     string `json:"impact_level"`
    DetectedAt      time.Time `json:"detected_at"`
}

func NewTaxCalculationRequestedEvent(aggregateID string, version int, data TaxCalculationRequestedData) *events.BaseEvent {
    return events.NewBaseEvent(aggregateID, TaxCalculationRequested, version, data)
}

func NewTaxCalculationCompletedEvent(aggregateID string, version int, data TaxCalculationCompletedData) *events.BaseEvent {
    return events.NewBaseEvent(aggregateID, TaxCalculationCompleted, version, data)
}

func NewDocumentProcessingStartedEvent(aggregateID string, version int, data DocumentProcessingStartedData) *events.BaseEvent {
    return events.NewBaseEvent(aggregateID, DocumentProcessingStarted, version, data)
}

func NewDocumentProcessingCompletedEvent(aggregateID string, version int, data DocumentProcessingCompletedData) *events.BaseEvent {
    return events.NewBaseEvent(aggregateID, DocumentProcessingCompleted, version, data)
}

func NewRegulatoryChangeDetectedEvent(aggregateID string, version int, data RegulatoryChangeDetectedData) *events.BaseEvent {
    return events.NewBaseEvent(aggregateID, RegulatoryChangeDetected, version, data)
}
