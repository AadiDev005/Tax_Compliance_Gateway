package repository

import (
    "context"
    "log"
    "github.com/jmoiron/sqlx"
)

type AuditRepository struct {
    db *sqlx.DB
}

func NewAuditRepository(db *sqlx.DB) *AuditRepository {
    return &AuditRepository{db: db}
}

type AuditLog struct {
    ID            int     `json:"id" db:"id"`
    JurisdictionID string  `json:"jurisdiction_id" db:"jurisdiction_id"`
    Amount        float64 `json:"amount" db:"amount"`
    Tax           float64 `json:"tax" db:"tax"`
    CreatedAt     string  `json:"created_at" db:"created_at"`
}

func (r *AuditRepository) SaveAuditLog(ctx context.Context, jurisdictionID string, amount, tax float64, createdAt string) error {
    query := `
        INSERT INTO audit_logs (jurisdiction_id, amount, tax, created_at) 
        VALUES ($1, $2, $3, $4)
    `
    
    _, err := r.db.ExecContext(ctx, query, jurisdictionID, amount, tax, createdAt)
    if err != nil {
        log.Printf("SaveAuditLog query failed: %v", err)
        return err
    }
    
    return nil
}

func (r *AuditRepository) GetAuditLogs(ctx context.Context) ([]AuditLog, error) {
    var logs []AuditLog
    
    query := `
        SELECT id, jurisdiction_id, amount, tax, created_at 
        FROM audit_logs 
        ORDER BY created_at DESC 
        LIMIT 100
    `
    
    err := r.db.SelectContext(ctx, &logs, query)
    if err != nil {
        log.Printf("GetAuditLogs query failed: %v", err)
        return []AuditLog{}, nil
    }
    
    return logs, nil
}
