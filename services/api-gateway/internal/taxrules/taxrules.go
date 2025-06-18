package taxrules

import (
    "database/sql"
    _ "github.com/lib/pq"
    "github.com/gin-gonic/gin"
)

type TaxRule struct {
    ID             int     `json:"id"`
    JurisdictionID int     `json:"jurisdiction_id"`
    RuleType       string  `json:"rule_type"`
    Rate           float64 `json:"rate"`
    EffectiveDate  string  `json:"effective_date"`
    Description    string  `json:"description"`
}

func GetTaxRules(db *sql.DB) gin.HandlerFunc {
    return func(c *gin.Context) {
        rows, err := db.Query("SELECT id, jurisdiction_id, rule_type, rate, effective_date, description FROM tax_rules")
        if err != nil {
            c.JSON(500, gin.H{"error": err.Error()})
            return
        }
        defer rows.Close()

        var rules []TaxRule
        for rows.Next() {
            var rule TaxRule
            if err := rows.Scan(&rule.ID, &rule.JurisdictionID, &rule.RuleType, &rule.Rate, &rule.EffectiveDate, &rule.Description); err != nil {
                c.JSON(500, gin.H{"error": err.Error()})
                return
            }
            rules = append(rules, rule)
        }
        c.JSON(200, rules)
    }
}
