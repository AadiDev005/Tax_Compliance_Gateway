package health

import (
    "context"
    "testing"
    "github.com/stretchr/testify/assert"
)

func TestCheckServices(t *testing.T) {
    ctx := context.Background()
    // Use invalid URLs to test failure case
    postgresURL := "postgres://invalid:invalid@localhost:5432/invalid"
    mongoURL := "mongodb://invalid:27017/invalid"
    redisURL := "localhost:6379/invalid"

    status := CheckServices(ctx, postgresURL, mongoURL, redisURL)
    assert.False(t, status.Postgres, "Postgres should be unhealthy with invalid URL")
    assert.False(t, status.MongoDB, "MongoDB should be unhealthy with invalid URL")
    assert.False(t, status.Redis, "Redis should be unhealthy with invalid URL")
}
