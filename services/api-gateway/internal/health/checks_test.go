package health

import (
    "context"
    "strings"
    "testing"
)

func TestCheckServices(t *testing.T) {
    status := CheckServices(context.Background(), "invalid://postgres", "invalid://mongodb", "invalid://redis")
    if !strings.Contains(status["postgres"], "error") {
        t.Errorf("Expected postgres error, got %v", status["postgres"])
    }
    if !strings.Contains(status["mongodb"], "error") {
        t.Errorf("Expected mongodb error, got %v", status["mongodb"])
    }
    if !strings.Contains(status["redis"], "error") {
        t.Errorf("Expected redis error, got %v", status["redis"])
    }
}
