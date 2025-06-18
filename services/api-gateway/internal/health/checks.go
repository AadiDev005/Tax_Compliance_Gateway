package health

import (
    "context"
    "database/sql"
    "github.com/redis/go-redis/v9"
    "go.mongodb.org/mongo-driver/mongo"
    "go.mongodb.org/mongo-driver/mongo/options"
    "github.com/rs/zerolog/log"
    _ "github.com/lib/pq"
)

type HealthStatus struct {
    Postgres bool `json:"Postgres"`
    MongoDB  bool `json:"MongoDB"`
    Redis    bool `json:"Redis"`
}

func CheckServices(ctx context.Context, postgresURL, mongoURL, redisURL string) HealthStatus {
    status := HealthStatus{}
    log.Info().Str("postgres_url", postgresURL).Msg("Attempting PostgreSQL connection")
    if db, err := sql.Open("postgres", postgresURL); err != nil {
        log.Error().Err(err).Str("url", postgresURL).Msg("Failed to open PostgreSQL connection")
    } else {
        defer db.Close()
        if err := db.PingContext(ctx); err != nil {
            log.Error().Err(err).Str("url", postgresURL).Msg("Failed to ping PostgreSQL")
        } else {
            status.Postgres = true
            log.Info().Str("url", postgresURL).Msg("PostgreSQL connection successful")
        }
    }
    log.Info().Str("mongo_url", mongoURL).Msg("Attempting MongoDB connection")
    if client, err := mongo.Connect(ctx, options.Client().ApplyURI(mongoURL)); err != nil {
        log.Error().Err(err).Str("url", mongoURL).Msg("Failed to connect to MongoDB")
    } else {
        defer client.Disconnect(ctx)
        if err := client.Ping(ctx, nil); err != nil {
            log.Error().Err(err).Str("url", mongoURL).Msg("Failed to ping MongoDB")
        } else {
            status.MongoDB = true
            log.Info().Str("url", mongoURL).Msg("MongoDB connection successful")
        }
    }
    log.Info().Str("redis_url", redisURL).Msg("Attempting Redis connection")
    rdb := redis.NewClient(&redis.Options{Addr: redisURL})
    defer rdb.Close()
    if _, err := rdb.Ping(ctx).Result(); err != nil {
        log.Error().Err(err).Str("url", redisURL).Msg("Failed to ping Redis")
    } else {
        status.Redis = true
        log.Info().Str("url", redisURL).Msg("Redis connection successful")
    }
    return status
}
