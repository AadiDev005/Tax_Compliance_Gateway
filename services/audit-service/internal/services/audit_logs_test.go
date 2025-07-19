package services

import (
    "encoding/json"
    "testing"
    "tax-compliance-gateway/audit-service/internal/repository"
    "github.com/Shopify/sarama"
    "github.com/jmoiron/sqlx"
    _ "github.com/mattn/go-sqlite3"
)

type MockConsumer struct {
    messages chan *sarama.ConsumerMessage
}

func (m *MockConsumer) ConsumePartition(topic string, partition int32, offset int64) (sarama.PartitionConsumer, error) {
    return &MockPartitionConsumer{messages: m.messages}, nil
}

func (m *MockConsumer) Close() error { return nil }
func (m *MockConsumer) HighWaterMarks() map[string]map[int32]int64 { return nil }
func (m *MockConsumer) Partitions(topic string) ([]int32, error) { return nil, nil }
func (m *MockConsumer) Pause(partitions map[string][]int32) {}
func (m *MockConsumer) PauseAll() {}
func (m *MockConsumer) Resume(partitions map[string][]int32) {}
func (m *MockConsumer) ResumeAll() {}

type MockPartitionConsumer struct {
    messages chan *sarama.ConsumerMessage
}

func (m *MockPartitionConsumer) AsyncClose() {}
func (m *MockPartitionConsumer) Close() error { return nil }
func (m *MockPartitionConsumer) Messages() <-chan *sarama.ConsumerMessage { return m.messages }
func (m *MockPartitionConsumer) Errors() <-chan *sarama.ConsumerError { return nil }
func (m *MockPartitionConsumer) HighWaterMarkOffset() int64 { return 0 }

func TestConsumeTaxCalculations(t *testing.T) {
    db, _ := sqlx.Open("sqlite3", ":memory:")
    _, _ = db.Exec("CREATE TABLE audit_logs (id INTEGER PRIMARY KEY, event TEXT, jurisdiction_id TEXT, amount REAL, created_at TEXT)")
    repo := repository.NewAuditRepository(db)
    service := NewAuditService(repo)

    messages := make(chan *sarama.ConsumerMessage, 1)
    consumer := &MockConsumer{messages: messages}

    event := struct {
        Amount        float64 `json:"amount"`
        Tax           float64 `json:"tax"`
        JurisdictionID string  `json:"jurisdiction_id"`
        CreatedAt     string  `json:"created_at"`
    }{
        Amount:        100,
        Tax:           16,
        JurisdictionID: "MX",
        CreatedAt:     "2025-07-04T12:00:00Z",
    }
    eventBytes, _ := json.Marshal(event)
    messages <- &sarama.ConsumerMessage{Value: eventBytes}
    close(messages)

    service.ConsumeTaxCalculations(consumer)

    var count int
    db.Get(&count, "SELECT COUNT(*) FROM audit_logs WHERE jurisdiction_id = 'MX'")
    if count != 1 {
        t.Errorf("Expected 1 audit log, got %d", count)
    }
}
