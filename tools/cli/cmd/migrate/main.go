package main

import (
    "log"
    "github.com/golang-migrate/migrate/v4"
    _ "github.com/golang-migrate/migrate/v4/database/postgres"
    _ "github.com/golang-migrate/migrate/v4/source/file"
)

func main() {
    m, err := migrate.New(
        "file://../../data/migrations/postgres",
        "postgres://tax_user:tax_password@localhost:5434/tax_compliance?sslmode=disable",
    )
    if err != nil {
        log.Fatalf("Migration init failed: %v", err)
    }

    if err := m.Up(); err != nil && err != migrate.ErrNoChange {
        log.Fatalf("Migration failed: %v", err)
    }

    log.Println("Migrations applied successfully")
}
