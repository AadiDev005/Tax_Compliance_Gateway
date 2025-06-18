package taxrules

import (
	"database/sql"
	"net/http"
	"strconv"

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
		// Get query parameters
		jurisdictionIDStr := c.Query("jurisdiction_id")
		pageStr := c.DefaultQuery("page", "1")
		limitStr := c.DefaultQuery("limit", "10")

		// Parse pagination
		page, err := strconv.Atoi(pageStr)
		if err != nil || page < 1 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid page number"})
			return
		}
		limit, err := strconv.Atoi(limitStr)
		if err != nil || limit < 1 || limit > 100 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid limit (1-100)"})
			return
		}
		offset := (page - 1) * limit

		// Build query
		query := "SELECT id, jurisdiction_id, rule_type, rate, effective_date, description FROM tax_rules"
		args := []interface{}{}
		conditions := []string{}

		if jurisdictionIDStr != "" {
			jurisdictionID, err := strconv.Atoi(jurisdictionIDStr)
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid jurisdiction_id"})
				return
			}
			conditions = append(conditions, "jurisdiction_id = $1")
			args = append(args, jurisdictionID)
		}

		if len(conditions) > 0 {
			query += " WHERE " + conditions[0]
		}
		query += " ORDER BY id LIMIT $" + strconv.Itoa(len(args)+1) + " OFFSET $" + strconv.Itoa(len(args)+2)
		args = append(args, limit, offset)

		// Execute query
		rows, err := db.Query(query, args...)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		defer rows.Close()

		var rules []TaxRule
		for rows.Next() {
			var rule TaxRule
			if err := rows.Scan(&rule.ID, &rule.JurisdictionID, &rule.RuleType, &rule.Rate, &rule.EffectiveDate, &rule.Description); err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
			rules = append(rules, rule)
		}

		if err := rows.Err(); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		// Count total for pagination metadata
		countQuery := "SELECT COUNT(*) FROM tax_rules"
		if len(conditions) > 0 {
			countQuery += " WHERE " + conditions[0]
		}
		var total int
		err = db.QueryRow(countQuery, args[:len(args)-2]...).Scan(&total)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"data": rules,
			"meta": gin.H{
				"page":      page,
				"limit":     limit,
				"total":     total,
				"totalPages": (total + limit - 1) / limit,
			},
		})
	}
}
