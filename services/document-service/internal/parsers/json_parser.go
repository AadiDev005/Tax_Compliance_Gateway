package parsers

import (
    "fmt"
    "github.com/tidwall/gjson"
)

type JSONParser struct{}

func NewJSONParser() *JSONParser {
    return &JSONParser{}
}

func (jp *JSONParser) Parse(content []byte) (map[string]interface{}, error) {
    if !gjson.ValidBytes(content) {
        return nil, fmt.Errorf("invalid JSON content")
    }
    
    result := make(map[string]interface{})
    json := string(content)
    
    // Extract common invoice fields with multiple path attempts
    if total := gjson.Get(json, "total"); total.Exists() {
        result["total"] = total.Value()
    } else if total := gjson.Get(json, "invoice.total"); total.Exists() {
        result["total"] = total.Value()
    } else if total := gjson.Get(json, "amount.total"); total.Exists() {
        result["total"] = total.Value()
    }
    
    if currency := gjson.Get(json, "currency"); currency.Exists() {
        result["currency"] = currency.String()
    } else if currency := gjson.Get(json, "invoice.currency"); currency.Exists() {
        result["currency"] = currency.String()
    }
    
    if country := gjson.Get(json, "country"); country.Exists() {
        result["country"] = country.String()
    } else if country := gjson.Get(json, "invoice.country"); country.Exists() {
        result["country"] = country.String()
    }
    
    if date := gjson.Get(json, "date"); date.Exists() {
        result["date"] = date.String()
    } else if date := gjson.Get(json, "invoice.date"); date.Exists() {
        result["date"] = date.String()
    }
    
    // Extract tax information
    if tax := gjson.Get(json, "tax"); tax.Exists() {
        result["tax_amount"] = tax.Value()
    } else if tax := gjson.Get(json, "invoice.tax"); tax.Exists() {
        result["tax_amount"] = tax.Value()
    }
    
    if vat := gjson.Get(json, "vat"); vat.Exists() {
        result["vat"] = vat.Value()
    } else if vat := gjson.Get(json, "invoice.vat"); vat.Exists() {
        result["vat"] = vat.Value()
    }
    
    result["format"] = "json"
    result["parsed_successfully"] = true
    
    return result, nil
}
