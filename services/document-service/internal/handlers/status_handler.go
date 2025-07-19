package handlers

import (
    "net/http"
    "tax-compliance-gateway/document-service/internal/services"
    "strconv"
    
    "github.com/gin-gonic/gin"
    "github.com/sirupsen/logrus"
)

type StatusHandler struct {
    documentService *services.DocumentService
}

func NewStatusHandler(docService *services.DocumentService) *StatusHandler {
    return &StatusHandler{
        documentService: docService,
    }
}

func (sh *StatusHandler) HandleStatus(c *gin.Context) {
    documentID := c.Param("id")
    
    doc, err := sh.documentService.GetDocument(documentID)
    if err != nil {
        logrus.WithError(err).WithField("document_id", documentID).Error("Failed to get document status")
        c.JSON(http.StatusNotFound, gin.H{"error": "Document not found"})
        return
    }
    
    response := gin.H{
        "document_id": doc.ID.Hex(),
        "filename":    doc.FileName,
        "format":      doc.Format,
        "status":      doc.Status,
        "uploaded_at": doc.UploadedAt,
    }
    
    if doc.ProcessedAt != nil {
        response["processed_at"] = doc.ProcessedAt
    }
    
    if doc.ErrorMessage != "" {
        response["error_message"] = doc.ErrorMessage
    }
    
    if doc.ParsedData != nil {
        response["parsed_data"] = doc.ParsedData
    }
    
    if doc.TaxCalculation != nil {
        response["tax_calculation"] = doc.TaxCalculation
    }
    
    c.JSON(http.StatusOK, response)
}

func (sh *StatusHandler) HandleGetDocument(c *gin.Context) {
    documentID := c.Param("id")
    
    doc, err := sh.documentService.GetDocument(documentID)
    if err != nil {
        logrus.WithError(err).WithField("document_id", documentID).Error("Failed to get document")
        c.JSON(http.StatusNotFound, gin.H{"error": "Document not found"})
        return
    }
    
    // Don't return the raw content in the response for security
    response := gin.H{
        "id":         doc.ID.Hex(),
        "filename":   doc.FileName,
        "format":     doc.Format,
        "size":       doc.Size,
        "status":     doc.Status,
        "uploaded_at": doc.UploadedAt,
    }
    
    if doc.ProcessedAt != nil {
        response["processed_at"] = doc.ProcessedAt
    }
    
    if doc.ParsedData != nil {
        response["parsed_data"] = doc.ParsedData
    }
    
    if doc.TaxCalculation != nil {
        response["tax_calculation"] = doc.TaxCalculation
    }
    
    if doc.ErrorMessage != "" {
        response["error_message"] = doc.ErrorMessage
    }
    
    c.JSON(http.StatusOK, response)
}

func (sh *StatusHandler) HandleListDocuments(c *gin.Context) {
    limitStr := c.DefaultQuery("limit", "50")
    limit, err := strconv.ParseInt(limitStr, 10, 64)
    if err != nil {
        limit = 50
    }
    
    documents, err := sh.documentService.ListDocuments(limit)
    if err != nil {
        logrus.WithError(err).Error("Failed to list documents")
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to list documents"})
        return
    }
    
    // Transform documents for response (exclude content)
    var response []gin.H
    for _, doc := range documents {
        docResponse := gin.H{
            "id":         doc.ID.Hex(),
            "filename":   doc.FileName,
            "format":     doc.Format,
            "size":       doc.Size,
            "status":     doc.Status,
            "uploaded_at": doc.UploadedAt,
        }
        
        if doc.ProcessedAt != nil {
            docResponse["processed_at"] = doc.ProcessedAt
        }
        
        if doc.TaxCalculation != nil {
            docResponse["tax_calculation"] = doc.TaxCalculation
        }
        
        response = append(response, docResponse)
    }
    
    c.JSON(http.StatusOK, gin.H{
        "documents": response,
        "count":     len(response),
    })
}
