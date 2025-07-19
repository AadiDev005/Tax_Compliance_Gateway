package models

import (
    "time"
    "go.mongodb.org/mongo-driver/bson/primitive"
)

type ProcessingStatus string

const (
    StatusPending    ProcessingStatus = "pending"
    StatusProcessing ProcessingStatus = "processing"
    StatusCompleted  ProcessingStatus = "completed"
    StatusFailed     ProcessingStatus = "failed"
)

type DocumentFormat string

const (
    FormatXML  DocumentFormat = "xml"
    FormatJSON DocumentFormat = "json"
    FormatPDF  DocumentFormat = "pdf"
    FormatUnknown DocumentFormat = "unknown"
)

type Document struct {
    ID              primitive.ObjectID `bson:"_id,omitempty" json:"id"`
    FileName        string            `bson:"filename" json:"filename"`
    Format          DocumentFormat    `bson:"format" json:"format"`
    Size            int64             `bson:"size" json:"size"`
    Status          ProcessingStatus  `bson:"status" json:"status"`
    UploadedAt      time.Time         `bson:"uploaded_at" json:"uploaded_at"`
    ProcessedAt     *time.Time        `bson:"processed_at,omitempty" json:"processed_at,omitempty"`
    Content         []byte            `bson:"content" json:"-"`
    ParsedData      map[string]interface{} `bson:"parsed_data,omitempty" json:"parsed_data,omitempty"`
    TaxCalculation  *TaxResult        `bson:"tax_calculation,omitempty" json:"tax_calculation,omitempty"`
    ErrorMessage    string            `bson:"error_message,omitempty" json:"error_message,omitempty"`
}

type TaxResult struct {
    Country     string  `bson:"country" json:"country"`
    TaxRate     float64 `bson:"tax_rate" json:"tax_rate"`
    TaxAmount   float64 `bson:"tax_amount" json:"tax_amount"`
    NetAmount   float64 `bson:"net_amount" json:"net_amount"`
    GrossAmount float64 `bson:"gross_amount" json:"gross_amount"`
    Currency    string  `bson:"currency" json:"currency"`
}

type ProcessingResult struct {
    DocumentID string                 `json:"document_id"`
    Status     ProcessingStatus       `json:"status"`
    Data       map[string]interface{} `json:"data,omitempty"`
    Error      string                 `json:"error,omitempty"`
}
