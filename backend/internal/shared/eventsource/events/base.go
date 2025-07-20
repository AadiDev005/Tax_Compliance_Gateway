package events

import (
    "encoding/json"
    "time"
    "github.com/google/uuid"
)

type Event interface {
    AggregateID() string
    EventType() string
    EventVersion() int
    OccurredOn() time.Time
    EventData() interface{}
}

type BaseEvent struct {
    ID           string                 `json:"id"`
    AggregateId  string                 `json:"aggregate_id"`
    Type         string                 `json:"event_type"`
    Version      int                    `json:"event_version"`
    Data         map[string]interface{} `json:"event_data"`
    OccurredAt   time.Time              `json:"occurred_on"`
    ProcessedAt  *time.Time             `json:"processed_at,omitempty"`
}

func NewBaseEvent(aggregateID, eventType string, version int, data interface{}) *BaseEvent {
    eventData, _ := json.Marshal(data)
    var dataMap map[string]interface{}
    json.Unmarshal(eventData, &dataMap)
    
    return &BaseEvent{
        ID:          uuid.New().String(),
        AggregateId: aggregateID,
        Type:        eventType,
        Version:     version,
        Data:        dataMap,
        OccurredAt:  time.Now(),
    }
}

func (e *BaseEvent) AggregateID() string     { return e.AggregateId }
func (e *BaseEvent) EventType() string      { return e.Type }
func (e *BaseEvent) EventVersion() int      { return e.Version }
func (e *BaseEvent) OccurredOn() time.Time  { return e.OccurredAt }
func (e *BaseEvent) EventData() interface{} { return e.Data }
