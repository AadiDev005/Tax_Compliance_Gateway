package handlers

import (
    "io"
    "net/http"
    "tax-compliance-gateway/document-service/internal/models"
    "tax-compliance-gateway/document-service/internal/parsers"
    "tax-compliance-gateway/document-service/internal/services"
    
    "github.com/gin-gonic/gin"
    "github.com/sirupsen/logrus"
)

type UploadHandler struct {
    documentService   *services.DocumentService
    processingService *services.ProcessingService
    formatDetector    *parsers.FormatDetector
}

func NewUploadHandler(docService *services.DocumentService, procService *services.ProcessingService) *UploadHandler {
    return &UploadHandler{
        documentService:   docService,
        processingService: procService,
        formatDetector:    parsers.NewFormatDetector(),
    }
}

type UploadResponse struct {
    DocumentID string               `json:"document_id"`
    Status     models.ProcessingStatus `json:"status"`
    Message    string               `json:"message"`
}

func (uh *UploadHandler) HandleUpload(c *gin.Context) {
    // Get uploaded file
    file, header, err := c.Request.FormFile("file")
    if err != nil {
        logrus.WithError(err).Error("Failed to get uploaded file")
        c.JSON(http.StatusBadRequest, gin.H{"error": "No file uploaded"})
        return
    }
    defer file.Close()
    
    // Read file content
    content, err := io.ReadAll(file)
    if err != nil {
        logrus.WithError(err).Error("Failed to read file content")
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read file"})
        return
    }
    
    // Detect format
    format := uh.formatDetector.DetectFormat(content, header.Filename)
    if format == models.FormatUnknown {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Unsupported file format"})
        return
    }
    
    // Create document model
    doc := &models.Document{
        FileName: header.Filename,
        Format:   format,
        Size:     header.Size,
        Content:  content,
        Status:   models.StatusPending,
    }
    
    // Save document to database
    if err := uh.documentService.SaveDocument(doc); err != nil {
        logrus.WithError(err).Error("Failed to save document")
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save document"})
        return
    }
    
    // Process document asynchronously
    go uh.processDocumentAsync(doc)
    
    response := UploadResponse{
        DocumentID: doc.ID.Hex(),
        Status:     models.StatusPending,
        Message:    "Document uploaded successfully and queued for processing",
    }
    
    logrus.WithFields(logrus.Fields{
        "document_id": doc.ID.Hex(),
        "filename":    header.Filename,
        "format":      format,
        "size":        header.Size,
    }).Info("Document uploaded successfully")
    
    c.JSON(http.StatusAccepted, response)
}

func (uh *UploadHandler) processDocumentAsync(doc *models.Document) {
    // Update status to processing
    if err := uh.documentService.UpdateDocumentStatus(doc.ID.Hex(), models.StatusProcessing, ""); err != nil {
        logrus.WithError(err).WithField("document_id", doc.ID.Hex()).Error("Failed to update status to processing")
        return
    }
    
    // Process the document
    result, err := uh.processingService.ProcessDocument(doc)
    if err != nil {
        logrus.WithError(err).WithField("document_id", doc.ID.Hex()).Error("Document processing failed")
        uh.documentService.UpdateDocumentStatus(doc.ID.Hex(), models.StatusFailed, err.Error())
        return
    }
    
    // Extract tax calculation if available
    var taxResult *models.TaxResult
    if taxCalc, exists := result.Data["tax_calculation"]; exists {
        if tr, ok := taxCalc.(*models.TaxResult); ok {
            taxResult = tr
        }
    }
    
    // Update document with processed data
    if err := uh.documentService.UpdateDocumentData(doc.ID.Hex(), result.Data, taxResult); err != nil {
        logrus.WithError(err).WithField("document_id", doc.ID.Hex()).Error("Failed to update document data")
        uh.documentService.UpdateDocumentStatus(doc.ID.Hex(), models.StatusFailed, "Failed to save processed data")
        return
    }
    
    logrus.WithField("document_id", doc.ID.Hex()).Info("Document processed successfully")
}
