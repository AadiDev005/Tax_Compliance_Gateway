package store

import (
    "context"
    "tax-compliance-gateway/backend/internal/shared/eventsource/events"
)

type EventStore interface {
    SaveEvents(ctx context.Context, aggregateID string, events []events.Event, expectedVersion int) error
    GetEvents(ctx context.Context, aggregateID string) ([]events.Event, error)
    GetEventsByType(ctx context.Context, eventType string, limit int) ([]events.Event, error)
    GetAllEvents(ctx context.Context, offset, limit int) ([]events.Event, error)
}

type EventStoreError struct {
    Type    string
    Message string
    Err     error
}

func (e *EventStoreError) Error() string {
    if e.Err != nil {
        return e.Message + ": " + e.Err.Error()
    }
    return e.Message
}

var (
    ErrConcurrencyConflict = &EventStoreError{
        Type:    "CONCURRENCY_CONFLICT",
        Message: "Concurrency conflict: events were modified",
    }
    
    ErrAggregateNotFound = &EventStoreError{
        Type:    "AGGREGATE_NOT_FOUND",
        Message: "Aggregate not found",
    }
)
