package parsers

import (
    "fmt"
    "github.com/antchfx/xmlquery"
    "strings"
)

type XMLParser struct{}

func NewXMLParser() *XMLParser {
    return &XMLParser{}
}

func (xp *XMLParser) Parse(content []byte) (map[string]interface{}, error) {
    doc, err := xmlquery.Parse(strings.NewReader(string(content)))
    if err != nil {
        return nil, fmt.Errorf("failed to parse XML: %w", err)
    }
    
    result := make(map[string]interface{})
    
    // Extract common invoice fields
    if totalNode := xmlquery.FindOne(doc, "//total | //Total | //TOTAL"); totalNode != nil {
        result["total"] = totalNode.InnerText()
    }
    
    if currencyNode := xmlquery.FindOne(doc, "//currency | //Currency | //CURRENCY"); currencyNode != nil {
        result["currency"] = currencyNode.InnerText()
    }
    
    if countryNode := xmlquery.FindOne(doc, "//country | //Country | //COUNTRY"); countryNode != nil {
        result["country"] = countryNode.InnerText()
    }
    
    if dateNode := xmlquery.FindOne(doc, "//date | //Date | //DATE"); dateNode != nil {
        result["date"] = dateNode.InnerText()
    }
    
    // Extract tax information
    if taxNode := xmlquery.FindOne(doc, "//tax | //Tax | //TAX"); taxNode != nil {
        result["tax_amount"] = taxNode.InnerText()
    }
    
    if vatNode := xmlquery.FindOne(doc, "//vat | //VAT"); vatNode != nil {
        result["vat"] = vatNode.InnerText()
    }
    
    result["format"] = "xml"
    result["parsed_successfully"] = true
    
    return result, nil
}
