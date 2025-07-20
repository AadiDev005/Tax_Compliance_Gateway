package postgres

import (
    "context"
    "database/sql"
    "encoding/json"
    "fmt"
    "time"
    
    "tax-compliance-gateway/backend/internal/shared/eventsource/events"
    "tax-compliance-gateway/backend/internal/shared/eventsource/store"
    
    "github.com/lib/pq"
)

type PostgresEventStore struct {
    db *sql.DB
}

func NewPostgresEventStore(db *sql.DB) *PostgresEventStore {
    return &PostgresEventStore{db: db}
}

func (s *PostgresEventStore) InitSchema(ctx context.Context) error {
    schema := `
    CREATE TABLE IF NOT EXISTS event_store (
        id SERIAL PRIMARY KEY,
        event_id VARCHAR(255) UNIQUE NOT NULL,
        aggregate_id VARCHAR(255) NOT NULL,
        event_type VARCHAR(255) NOT NULL,
        event_version INTEGER NOT NULL,
        event_data JSONB NOT NULL,
        occurred_on TIMESTAMP WITH TIME ZONE NOT NULL,
        processed_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    CREATE INDEX IF NOT EXISTS idx_event_store_aggregate_id ON event_store(aggregate_id);
    CREATE INDEX IF NOT EXISTS idx_event_store_event_type ON event_store(event_type);
    CREATE INDEX IF NOT EXISTS idx_event_store_occurred_on ON event_store(occurred_on);
    `
    
    _, err := s.db.ExecContext(ctx, schema)
    return err
}

func (s *PostgresEventStore) SaveEvents(ctx context.Context, aggregateID string, evts []events.Event, expectedVersion int) error {
    tx, err := s.db.BeginTx(ctx, nil)
    if err != nil {
        return err
    }
    defer tx.Rollback()
    
    var currentVersion int
    err = tx.QueryRowContext(ctx, 
        "SELECT COALESCE(MAX(event_version), 0) FROM event_store WHERE aggregate_id = $1", 
        aggregateID).Scan(&currentVersion)
    
    if err != nil && err != sql.ErrNoRows {
        return err
    }
    
    if currentVersion != expectedVersion {
        return store.ErrConcurrencyConflict
    }
    
    stmt, err := tx.PrepareContext(ctx, `
        INSERT INTO event_store (event_id, aggregate_id, event_type, event_version, event_data, occurred_on)
        VALUES ($1, $2, $3, $4, $5, $6)
    `)
    if err != nil {
        return err
    }
    defer stmt.Close()
    
    for _, evt := range evts {
        eventDataJSON, err := json.Marshal(evt.EventData())
        if err != nil {
            return err
        }
        
        _, err = stmt.ExecContext(ctx,
            evt.(*events.BaseEvent).ID,
            evt.AggregateID(),
            evt.EventType(),
            evt.EventVersion(),
            eventDataJSON,
            evt.OccurredOn(),
        )
        if err != nil {
            return err
        }
    }
    
    return tx.Commit()
}

func (s *PostgresEventStore) GetEvents(ctx context.Context, aggregateID string) ([]events.Event, error) {
    rows, err := s.db.QueryContext(ctx, `
        SELECT event_id, aggregate_id, event_type, event_version, event_data, occurred_on, processed_at
        FROM event_store 
        WHERE aggregate_id = $1 
        ORDER BY event_version ASC
    `, aggregateID)
    
    if err != nil {
        return nil, err
    }
    defer rows.Close()
    
    var result []events.Event
    for rows.Next() {
        evt, err := s.scanEvent(rows)
        if err != nil {
            return nil, err
        }
        result = append(result, evt)
    }
    
    return result, rows.Err()
}

func (s *PostgresEventStore) GetEventsByType(ctx context.Context, eventType string, limit int) ([]events.Event, error) {
    rows, err := s.db.QueryContext(ctx, `
        SELECT event_id, aggregate_id, event_type, event_version, event_data, occurred_on, processed_at
        FROM event_store 
        WHERE event_type = $1 
        ORDER BY occurred_on DESC 
        LIMIT $2
    `, eventType, limit)
    
    if err != nil {
        return nil, err
    }
    defer rows.Close()
    
    var result []events.Event
    for rows.Next() {
        evt, err := s.scanEvent(rows)
        if err != nil {
            return nil, err
        }
        result = append(result, evt)
    }
    
    return result, rows.Err()
}

func (s *PostgresEventStore) GetAllEvents(ctx context.Context, offset, limit int) ([]events.Event, error) {
    rows, err := s.db.QueryContext(ctx, `
        SELECT event_id, aggregate_id, event_type, event_version, event_data, occurred_on, processed_at
        FROM event_store 
        ORDER BY occurred_on DESC 
        LIMIT $1 OFFSET $2
    `, limit, offset)
    
    if err != nil {
        return nil, err
    }
    defer rows.Close()
    
    var result []events.Event
    for rows.Next() {
        evt, err := s.scanEvent(rows)
        if err != nil {
            return nil, err
        }
        result = append(result, evt)
    }
    
    return result, rows.Err()
}

func (s *PostgresEventStore) scanEvent(rows *sql.Rows) (*events.BaseEvent, error) {
    var evt events.BaseEvent
    var eventDataJSON []byte
    var processedAt sql.NullTime
    
    err := rows.Scan(
        &evt.ID,
        &evt.AggregateId,
        &evt.Type,
        &evt.Version,
        &eventDataJSON,
        &evt.OccurredAt,
        &processedAt,
    )
    
    if err != nil {
        return nil, err
    }
    
    if processedAt.Valid {
        evt.ProcessedAt = &processedAt.Time
    }
    
    err = json.Unmarshal(eventDataJSON, &evt.Data)
    if err != nil {
        return nil, err
    }
    
    return &evt, nil
}
