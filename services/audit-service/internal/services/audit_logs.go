package services

import (
    "context"
    "encoding/json"
    "log"
    "tax-compliance-gateway/audit-service/internal/repository"
    "github.com/Shopify/sarama"
)

type AuditService struct {
    repo *repository.AuditRepository
}

func NewAuditService(repo *repository.AuditRepository) *AuditService {
    return &AuditService{repo: repo}
}

func (s *AuditService) ConsumeTaxCalculations(consumer sarama.Consumer) {
    partitionConsumer, err := consumer.ConsumePartition("tax_calculations", 0, sarama.OffsetNewest)
    if err != nil {
        log.Fatalf("Failed to consume partition: %v", err)
    }
    defer partitionConsumer.Close()

    for msg := range partitionConsumer.Messages() {
        var event struct {
            Amount        float64 `json:"amount"`
            Tax           float64 `json:"tax"`
            JurisdictionID string  `json:"jurisdiction_id"`
            CreatedAt     string  `json:"created_at"`
        }
        if err := json.Unmarshal(msg.Value, &event); err != nil {
            log.Printf("Failed to unmarshal event: %v", err)
            continue
        }
        if err := s.repo.SaveAuditLog(context.Background(), event.JurisdictionID, event.Amount, event.Tax, event.CreatedAt); err != nil {
            log.Printf("Failed to save audit log: %v", err)
        }
    }
}

func (s *AuditService) GetAuditLogs(ctx context.Context) ([]repository.AuditLog, error) {
    if s.repo == nil {
        return []repository.AuditLog{}, nil
    }
    
    logs, err := s.repo.GetAuditLogs(ctx)
    if err != nil {
        return nil, err
    }
    
    return logs, nil
}
