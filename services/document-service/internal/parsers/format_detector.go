package parsers

import (
    "bytes"
    "strings"
    "tax-compliance-gateway/document-service/internal/models"
)

type FormatDetector struct{}

func NewFormatDetector() *FormatDetector {
    return &FormatDetector{}
}

func (fd *FormatDetector) DetectFormat(content []byte, filename string) models.DocumentFormat {
    // Check by file extension first
    if ext := getFileExtension(filename); ext != "" {
        switch strings.ToLower(ext) {
        case "xml":
            return models.FormatXML
        case "json":
            return models.FormatJSON
        case "pdf":
            return models.FormatPDF
        }
    }

    // Check by content
    trimmed := bytes.TrimSpace(content)
    
    // Check for XML
    if bytes.HasPrefix(trimmed, []byte("<?xml")) || bytes.HasPrefix(trimmed, []byte("<")) {
        return models.FormatXML
    }
    
    // Check for JSON
    if (bytes.HasPrefix(trimmed, []byte("{")) && bytes.HasSuffix(trimmed, []byte("}"))) ||
       (bytes.HasPrefix(trimmed, []byte("[")) && bytes.HasSuffix(trimmed, []byte("]"))) {
        return models.FormatJSON
    }
    
    // Check for PDF
    if bytes.HasPrefix(trimmed, []byte("%PDF")) {
        return models.FormatPDF
    }
    
    return models.FormatUnknown
}

func getFileExtension(filename string) string {
    parts := strings.Split(filename, ".")
    if len(parts) > 1 {
        return parts[len(parts)-1]
    }
    return ""
}
