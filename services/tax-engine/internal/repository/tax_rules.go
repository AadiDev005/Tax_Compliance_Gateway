package repository

import (
    "context"
    "fmt"
    "github.com/Shopify/sarama"
    "github.com/go-redis/redis/v8"
    "github.com/jmoiron/sqlx"
    "time"
)

type TaxRule struct {
    ID            int     `db:"id"`
    JurisdictionID string  `db:"jurisdiction_id"`
    Rate          float64 `db:"rate"`
    RuleType      string  `db:"rule_type"`
    EffectiveDate string  `db:"effective_date"`
}

type TaxRuleRepository struct {
    db      *sqlx.DB
    redis   *redis.Client
    producer sarama.SyncProducer
}

func NewTaxRuleRepository(db *sqlx.DB, redis *redis.Client, producer sarama.SyncProducer) *TaxRuleRepository {
    return &TaxRuleRepository{db: db, redis: redis, producer: producer}
}

func (r *TaxRuleRepository) GetTaxRate(ctx context.Context, jurisdictionID string) (float64, error) {
    // Check cache first
    cacheKey := "tax_rate:" + jurisdictionID
    cachedRate, err := r.redis.Get(ctx, cacheKey).Float64()
    if err == nil {
        return cachedRate, nil
    }

    // Query database with proper SQL
    var rule TaxRule
    query := "SELECT rate FROM tax_rules WHERE jurisdiction_id = $1 LIMIT 1"
    err = r.db.GetContext(ctx, &rule, query, jurisdictionID)
    if err != nil {
        // Return default rates if not found in database
        defaultRate := r.getDefaultTaxRate(jurisdictionID)
        if defaultRate > 0 {
            // Cache the default rate
            r.redis.SetEX(ctx, cacheKey, defaultRate, time.Hour)
            return defaultRate, nil
        }
        return 0, fmt.Errorf("tax rate not found for jurisdiction: %s", jurisdictionID)
    }

    // Cache the result
    err = r.redis.SetEX(ctx, cacheKey, rule.Rate, time.Hour).Err()
    if err != nil {
        // Log error but don't fail the request
        fmt.Printf("Warning: failed to cache tax rate: %v\n", err)
    }

    return rule.Rate, nil
}

// getDefaultTaxRate provides fallback tax rates
func (r *TaxRuleRepository) getDefaultTaxRate(jurisdictionID string) float64 {
    switch jurisdictionID {
    case "MX", "MEXICO":
        return 0.16 // 16% IVA for Mexico
    case "DE", "GERMANY":
        return 0.19 // 19% VAT for Germany
    case "PL", "POLAND":
        return 0.23 // 23% VAT for Poland
    case "IT", "ITALY":
        return 0.22 // 22% VAT for Italy
    case "BR", "BRAZIL":
        return 0.17 // 17% ICMS for Brazil
    case "US", "USA":
        return 0.08 // Average US sales tax
    case "FR", "FRANCE":
        return 0.20 // 20% VAT for France
    case "ES", "SPAIN":
        return 0.21 // 21% VAT for Spain
    default:
        return 0.20 // Default 20% tax rate
    }
}

// GetAllTaxRules retrieves all tax rules
func (r *TaxRuleRepository) GetAllTaxRules(ctx context.Context) ([]TaxRule, error) {
    var rules []TaxRule
    query := "SELECT id, jurisdiction_id, rate, rule_type, effective_date FROM tax_rules ORDER BY jurisdiction_id"
    
    err := r.db.SelectContext(ctx, &rules, query)
    if err != nil {
        return nil, fmt.Errorf("failed to get all tax rules: %w", err)
    }
    
    return rules, nil
}
